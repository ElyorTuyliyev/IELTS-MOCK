import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { useAppSelector } from "../../../store/hooks";
import { selectUserRole } from "../../../store";
import { hasRequiredRole } from "../../../store/slices/authSlice";
import { ROUTES_PATH, SIDEBAR_ROUTE_GROUPS } from "../../../routes";
import { SidebarRoot } from "./Sidebar.style";

const SIDEBAR_ACCORDION_STORAGE_KEY = "sidebar-expanded-items";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useAppSelector(selectUserRole);
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
            child.allowedRoles ? hasRequiredRole(role, child.allowedRoles) : true,
          ),
        })),
    })).filter((group) => group.items.length > 0);

    if (!normalizedSearch) {
      return roleFilteredGroups;
    }

    return roleFilteredGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesItem = item.label.toLowerCase().includes(normalizedSearch);
        const matchesChildren = item.children?.some((child) =>
          child.label.toLowerCase().includes(normalizedSearch),
        );

        return matchesItem || matchesChildren;
      }),
    })).filter((group) => group.items.length > 0);
  }, [role, searchTerm]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

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
    // #region agent log
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "post-fix",
        hypothesisId: "H25",
        location: "Sidebar.tsx:handleLogout",
        message: "Sidebar logout clicked",
        data: {
          fromPath: location.pathname,
          toPath: ROUTES_PATH.signIn,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    navigate(ROUTES_PATH.signIn);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        SIDEBAR_ACCORDION_STORAGE_KEY,
        JSON.stringify(expandedItems),
      );
    }
  }, [expandedItems]);

  return (
    <SidebarRoot as="aside" className="dashboard__sidebar sidebar">
      <Box component="header" className="sidebar__header">
        <Box className="sidebar__brand">
          <Box className="sidebar__brand-logo" aria-hidden="true">
            ✦
          </Box>
          <Box className="sidebar__brand-copy">
            <Typography component="strong" className="sidebar__brand-title">
              IELTS Study
            </Typography>
            <Typography component="span" className="sidebar__brand-text">
              Assessment workspace
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
        <TextField
          className="sidebar__search-input"
          type="search"
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
                      <Button
                        className={`sidebar__link sidebar__link--accordion${
                          isActive ? " sidebar__link--active" : ""
                        }`}
                        variant="text"
                        onClick={() => toggleItem(item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={`sidebar-sublist-${item.label}`}
                      >
                        <Box
                          component="span"
                          className="sidebar__link-icon"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </Box>
                        <span className="sidebar__link-text">{item.label}</span>
                        <span
                          className={`sidebar__link-arrow${
                            isExpanded ? " sidebar__link-arrow--expanded" : ""
                          }`}
                        >
                          ⌄
                        </span>
                      </Button>
                    ) : (
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
                          {item.icon}
                        </Box>
                        <span className="sidebar__link-text">{item.label}</span>
                      </Button>
                    )}

                    {hasChildren ? (
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
                                  className="sidebar__sublink-dot"
                                  aria-hidden="true"
                                />
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

      <Button className="sidebar__profile" variant="text">
        <Box
          component="span"
          className="sidebar__profile-avatar"
          aria-hidden="true"
        >
          TA
        </Box>
        <Box className="sidebar__profile-copy">
          <Typography component="strong" className="sidebar__profile-name">
            Tahsan
          </Typography>
          <Typography component="span" className="sidebar__profile-email">
            tahsan@gmail.com
          </Typography>
        </Box>
        <span className="sidebar__profile-arrow" aria-hidden="true">
          ˅
        </span>
      </Button>
      <Button className="sidebar__logout" variant="outlined" onClick={handleLogout}>
        <span className="sidebar__logout-icon" aria-hidden="true">
          ⇦
        </span>
        Logout
      </Button>
    </SidebarRoot>
  );
}
