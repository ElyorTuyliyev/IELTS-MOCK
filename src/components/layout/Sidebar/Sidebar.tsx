import type { MouseEvent, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  Box,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { Button } from "../../common/Button";
import { SearchField } from "../../../components/common/SearchField";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectAuthToken, selectUserRole } from "../../../store";
import { clearAuth, hasRequiredRole } from "../../../store/slices/authSlice";
import { ROUTES_PATH, SIDEBAR_ROUTE_GROUPS } from "../../../routes";
import { SIDEBAR_ICONS, type SidebarIconKey } from "../../../routes/sidebarIcons";
import { agentLog } from "../../../utils/agentLog";
import { SidebarCollapsedPopover, SidebarCollapsedPopoverPaper, SidebarRoot } from "./Sidebar.style";

type CollapsedSubmenuState = {
  label: string;
  children: Array<{ label: string; icon: SidebarIconKey; path?: string }>;
  anchorEl: HTMLElement;
};

const SIDEBAR_ACCORDION_STORAGE_KEY = "sidebar-expanded-items";
const SIDEBAR_COLLAPSED_MEDIA_QUERY = "(max-width:1120px)";
const ME_CENTER_QUERY = gql`
  query MeCenter {
    meCenter {
      _id
      name
      logo
      availableExamCredits
    }
  }
`;

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);
  const authToken = useAppSelector(selectAuthToken);
  const isCollapsed = useMediaQuery(SIDEBAR_COLLAPSED_MEDIA_QUERY);
  const navEpoch = `${location.pathname}:${isCollapsed}`;
  const [collapsedSubmenuState, setCollapsedSubmenuState] = useState<{
    epoch: string;
    value: CollapsedSubmenuState | null;
  }>({ epoch: navEpoch, value: null });
  const collapsedSubmenu =
    collapsedSubmenuState.epoch === navEpoch ? collapsedSubmenuState.value : null;
  const setCollapsedSubmenu = (
    value:
      | CollapsedSubmenuState
      | null
      | ((current: CollapsedSubmenuState | null) => CollapsedSubmenuState | null),
  ) => {
    setCollapsedSubmenuState((prev) => {
      const current = prev.epoch === navEpoch ? prev.value : null;
      const next = typeof value === "function" ? value(current) : value;
      return { epoch: navEpoch, value: next };
    });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<
    Record<string, boolean | undefined>
  >(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const storedValue = window.sessionStorage.getItem(
      SIDEBAR_ACCORDION_STORAGE_KEY,
    );

    if (!storedValue) {
      return {};
    }

    try {
      return JSON.parse(storedValue) as Record<string, boolean | undefined>;
    } catch {
      return {};
    }
  });
  const { data: meCenterData } = useQuery<{
    meCenter?: {
      _id: string;
      name?: string | null;
      logo?: string | null;
      availableExamCredits?: number;
    } | null;
  }>(ME_CENTER_QUERY, {
    skip: !authToken || (role !== "center" && role !== "student"),
    fetchPolicy: "cache-and-network",
  });

  const availableExamCredits = meCenterData?.meCenter?.availableExamCredits ?? 0;

  const visibleGroups = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const roleFilteredGroups = SIDEBAR_ROUTE_GROUPS.map((group) => ({
      ...group,
      items: group.items
        .filter((item) =>
          item.allowedRoles ? hasRequiredRole(role, item.allowedRoles) : true,
        )
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) =>
            child.allowedRoles
              ? hasRequiredRole(role, child.allowedRoles)
              : true,
          ),
        })),
    })).filter((group) => group.items.length > 0);

    if (!normalizedSearch) {
      return roleFilteredGroups;
    }

    return roleFilteredGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchesItem = item.label
            .toLowerCase()
            .includes(normalizedSearch);
          const matchesChildren = item.children?.some((child) =>
            child.label.toLowerCase().includes(normalizedSearch),
          );

          return matchesItem || matchesChildren;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [role, searchTerm]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const centerMetaFromToken = (() => {
    if (!authToken) {
      return { name: null, logo: null };
    }

    const parts = authToken.split(".");
    if (parts.length < 2) {
      return { name: null, logo: null };
    }

    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      const payload = JSON.parse(atob(padded)) as {
        centerName?: string | null;
        centerLogo?: string | null;
      };
      const normalizedCenterName = payload.centerName?.trim();
      const normalizedCenterLogo = payload.centerLogo?.trim();
      return {
        name: normalizedCenterName || null,
        logo: normalizedCenterLogo || null,
      };
    } catch {
      return { name: null, logo: null };
    }
  })();
  const centerMeta = {
    name: meCenterData?.meCenter?.name?.trim() || centerMetaFromToken.name,
    logo: meCenterData?.meCenter?.logo?.trim() || centerMetaFromToken.logo,
  };

  useEffect(() => {
    agentLog({
      sessionId: "24497a",
      runId: "pre-fix",
      hypothesisId: "H8",
      location: "Sidebar.tsx:visibleGroups/useEffect",
      message: "Sidebar visible items snapshot by role",
      data: {
        role,
        groupTitles: visibleGroups.map((group) => group.title),
        visibleItemLabels: visibleGroups.flatMap((group) =>
          group.items.map((item) => item.label),
        ),
        hasCentersItem: visibleGroups.some((group) =>
          group.items.some((item) => item.label === "Centers"),
        ),
        hasPaymentsItem: visibleGroups.some((group) =>
          group.items.some((item) => item.label === "Payments"),
        ),
      },
    });
  }, [role, visibleGroups]);

  const isItemActive = (path?: string, children?: Array<{ path?: string }>) => {
    if (path && location.pathname === path) {
      return true;
    }

    return Boolean(
      children?.some((child) => child.path && location.pathname === child.path),
    );
  };

  const toggleItem = (label: string) => {
    setExpandedItems((currentState) => ({
      ...currentState,
      [label]: !currentState[label],
    }));
  };

  const collapseAccordionItems = () => {
    setExpandedItems({});
  };

  const handleLogout = () => {
    agentLog({
      sessionId: "393b5a",
      runId: "post-fix",
      hypothesisId: "H25",
      location: "Sidebar.tsx:handleLogout",
      message: "Sidebar logout clicked",
      data: {
        fromPath: location.pathname,
        toPath: ROUTES_PATH.signIn,
      },
    });
    dispatch(clearAuth());
    navigate(ROUTES_PATH.signIn, { replace: true });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        SIDEBAR_ACCORDION_STORAGE_KEY,
        JSON.stringify(expandedItems),
      );
    }
  }, [expandedItems]);

  const renderSidebarIcon = (
    iconKey: SidebarIconKey,
    className = "sidebar__link-icon-svg",
  ) => {
    const Icon = SIDEBAR_ICONS[iconKey];
    return <Icon className={className} fontSize="small" />;
  };

  const wrapWithTooltip = (
    label: string,
    node: ReactElement,
    enabled = true,
  ) =>
    isCollapsed && enabled ? (
      <Tooltip title={label} placement="right" arrow>
        {node}
      </Tooltip>
    ) : (
      node
    );

  const closeCollapsedSubmenu = () => {
    setCollapsedSubmenu(null);
  };

  const handleAccordionClick = (
    item: {
      label: string;
      path?: string;
      children?: Array<{ label: string; icon: SidebarIconKey; path?: string }>;
    },
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (isCollapsed) {
      if (item.children?.length) {
        setCollapsedSubmenu((current) =>
          current?.label === item.label
            ? null
            : {
                label: item.label,
                children: item.children ?? [],
                anchorEl: event.currentTarget,
              },
        );
      }
      return;
    }

    toggleItem(item.label);
  };

  return (
    <SidebarRoot
      as="aside"
      className={`dashboard__sidebar sidebar${isCollapsed ? " sidebar--collapsed" : ""}`}
    >
      <Box component="header" className="sidebar__header">
        <Box className="sidebar__brand">
          <Box className="sidebar__brand-logo" aria-hidden="true">
            {centerMeta.logo ? (
              <img src={centerMeta.logo} alt="Center logo" className="sidebar__brand-logo-image" />
            ) : (
              "✦"
            )}
          </Box>
          <Box className="sidebar__brand-copy">
            <Typography component="strong" className="sidebar__brand-title">
              IELTS Exam
            </Typography>
            <Typography component="span" className="sidebar__brand-text">
              {centerMeta.name || "Mock Exam Platform"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          className="sidebar__utility-button"
          aria-label="Quick action"
        >
          ⎋
        </IconButton>
      </Box>

      <Box component="form" className="sidebar__search" role="search">
        <SearchField
          className="sidebar__search-input"
          showIcon={false}
          placeholder="Search"
          aria-label="Search menu"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <IconButton className="sidebar__search-button" aria-label="Filters">
          ⌘
        </IconButton>
      </Box>

      <Box
        component="nav"
        className="sidebar__nav"
        aria-label="Sidebar navigation"
      >
        {visibleGroups.map((group) => (
          <Box
            key={group.title}
            component="section"
            className="sidebar__section"
          >
            <Typography component="h2" className="sidebar__section-title">
              {group.title}
            </Typography>

            <Box component="ul" className="sidebar__list">
              {group.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isActive = isItemActive(item.path, item.children);
                const isExpanded =
                  hasChildren &&
                  (normalizedSearch !== "" ||
                    Boolean(expandedItems[item.label]));

                return (
                  <Box
                    key={item.label}
                    component="li"
                    className="sidebar__item"
                  >
                    {hasChildren ? (
                      wrapWithTooltip(
                        item.label,
                        <Button
                          className={`sidebar__link sidebar__link--accordion${
                            isActive ? " sidebar__link--active" : ""
                          }`}
                          variant="text"
                          onClick={(event) => handleAccordionClick(item, event)}
                          aria-expanded={isCollapsed ? undefined : isExpanded}
                          aria-controls={
                            isCollapsed
                              ? undefined
                              : `sidebar-sublist-${item.label}`
                          }
                          aria-haspopup={isCollapsed ? "menu" : undefined}
                        >
                          <Box
                            component="span"
                            className="sidebar__link-icon"
                            aria-hidden="true"
                          >
                            {renderSidebarIcon(item.icon)}
                          </Box>
                          <span className="sidebar__link-text">{item.label}</span>
                          <span
                            className={`sidebar__link-arrow${
                              isExpanded ? " sidebar__link-arrow--expanded" : ""
                            }`}
                          >
                            ⌄
                          </span>
                        </Button>,
                        false,
                      )
                    ) : (
                      wrapWithTooltip(
                        item.label,
                        <Button
                          component={item.path ? NavLink : "button"}
                          to={item.path}
                          className={`sidebar__link${isActive ? " sidebar__link--active" : ""}`}
                          variant="text"
                          onClick={collapseAccordionItems}
                        >
                          <Box
                            component="span"
                            className="sidebar__link-icon"
                            aria-hidden="true"
                          >
                            {renderSidebarIcon(item.icon)}
                          </Box>
                          <span className="sidebar__link-text">{item.label}</span>
                        </Button>,
                      )
                    )}

                    {hasChildren && !isCollapsed ? (
                      <Collapse
                        in={isExpanded}
                        timeout="auto"
                        unmountOnExit={normalizedSearch === ""}
                        className="sidebar__sublist-wrap"
                        id={`sidebar-sublist-${item.label}`}
                      >
                        <Box component="ul" className="sidebar__sublist">
                          {item.children?.map((child) => (
                            <Box
                              key={child.label}
                              component="li"
                              className="sidebar__subitem"
                            >
                              <Button
                                component={child.path ? NavLink : "button"}
                                to={child.path}
                                className={`sidebar__sublink${
                                  child.path === location.pathname
                                    ? " sidebar__sublink--active"
                                    : ""
                                }`}
                                variant="text"
                              >
                                <Box
                                  component="span"
                                  className="sidebar__sublink-icon"
                                  aria-hidden="true"
                                >
                                  {renderSidebarIcon(
                                    child.icon,
                                    "sidebar__sublink-icon-svg",
                                  )}
                                </Box>
                                <span>{child.label}</span>
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      <Box component="footer" className="sidebar__footer">
        {role === "center" ? (
          <Box className="sidebar__credits" sx={{ mb: 1.5, px: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Available exams
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
              {availableExamCredits}
            </Typography>
          </Box>
        ) : null}
        {wrapWithTooltip(
          "Sign out",
          <Button
            className="sidebar__logout"
            variant="text"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <Box
              component="span"
              className="sidebar__logout-icon"
              aria-hidden="true"
            >
              <LogoutOutlinedIcon
                className="sidebar__logout-icon-svg"
                fontSize="small"
              />
            </Box>
            <span className="sidebar__logout-text">Sign out</span>
          </Button>,
        )}
      </Box>

      <SidebarCollapsedPopover
        open={Boolean(collapsedSubmenu)}
        anchorEl={collapsedSubmenu?.anchorEl ?? null}
        onClose={closeCollapsedSubmenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            component: SidebarCollapsedPopoverPaper,
            elevation: 0,
          },
        }}
      >
        <Typography component="h3" className="sidebar__collapsed-popover-title">
          {collapsedSubmenu?.label}
        </Typography>
        <Box
          component="ul"
          className="sidebar__collapsed-popover-list"
          role="menu"
        >
          {collapsedSubmenu?.children.map((child) => (
            <Box
              key={child.label}
              component="li"
              className="sidebar__collapsed-popover-item"
              role="none"
            >
              <Button
                component={child.path ? NavLink : "button"}
                to={child.path}
                className={`sidebar__collapsed-popover-link${
                  child.path === location.pathname
                    ? " sidebar__collapsed-popover-link--active"
                    : ""
                }`}
                variant="text"
                role="menuitem"
                onClick={closeCollapsedSubmenu}
              >
                <Box
                  component="span"
                  className="sidebar__collapsed-popover-icon"
                  aria-hidden="true"
                >
                  {renderSidebarIcon(
                    child.icon,
                    "sidebar__collapsed-popover-icon-svg",
                  )}
                </Box>
                <span>{child.label}</span>
              </Button>
            </Box>
          ))}
        </Box>
      </SidebarCollapsedPopover>
    </SidebarRoot>
  );
}
