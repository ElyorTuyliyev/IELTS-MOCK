import type { CSSProperties } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import type {
  StudentGridRow,
  StudentLevelTone,
  StudentStatus,
} from "./AllStudentsPage.constants";

const levelToneMap: Record<StudentLevelTone, string> = {
  orange: "#fb923c",
  teal: "#5cc0b8",
  pink: "#f472d0",
  yellow: "#f4c84f",
  blue: "#67ace7",
};

const levelBarBaseHeights = [8, 12, 16] as const;

function getStatusClassName(status: StudentStatus) {
  return `students-table__pill students-table__pill--${status.toLowerCase()}`;
}

function getLevelBarMetrics(points: string) {
  const [scoreText, totalText] = points.split("/");
  const score = Number(scoreText);
  const total = Number(totalText);

  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
    return levelBarBaseHeights.map((height) => ({
      height,
      opacity: 0.45,
    }));
  }

  const ratio = Math.max(0, Math.min(score / total, 1));

  return levelBarBaseHeights.map((baseHeight, index) => {
    const segmentProgress = Math.max(
      0,
      Math.min(ratio * levelBarBaseHeights.length - index, 1),
    );

    return {
      height: Math.max(
        5,
        Math.round(baseHeight * (0.4 + segmentProgress * 0.6)),
      ),
      opacity: 0.28 + segmentProgress * 0.72,
    };
  });
}

export function createStudentColumns(): GridColDef<StudentGridRow>[] {
  return [
    {
      field: "serial",
      headerName: "No.",
      minWidth: 72,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="students-table__serial">{params.row.serial}</span>
      ),
    },
    {
      field: "name",
      headerName: "Student name",
      minWidth: 220,
      flex: 1.1,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <Box className="students-table__name">
          <Box
            className="students-table__avatar"
            sx={
              {
                "--avatar-gradient": params.row.avatarGradient,
              } as CSSProperties
            }
          >
            {params.row.initials}
          </Box>
          <Typography component="p" className="students-table__name-text">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "points",
      headerName: "Points",
      minWidth: 150,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => {
        const levelBars = getLevelBarMetrics(params.row.points);

        return (
          <Box className="students-table__points">
            <Box className="students-table__points-bars" aria-hidden="true">
              {levelBars.map((bar, index) => (
                <Box
                  key={`${params.row.id}-bar-${index}`}
                  className="students-table__points-bar"
                  sx={
                    {
                      "--bar-height": `${bar.height}px`,
                      "--bar-opacity": bar.opacity,
                      "--level-color": levelToneMap[params.row.levelTone],
                    } as CSSProperties
                  }
                />
              ))}
            </Box>
            <span className="students-table__points-text">
              {params.row.points}
            </span>
          </Box>
        );
      },
    },
    {
      field: "loginTime",
      headerName: "Logon time",
      minWidth: 132,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="students-table__meta students-table__meta--strong">
          {params.row.loginTime}
        </span>
      ),
    },
    {
      field: "creationDate",
      headerName: "Creation date",
      minWidth: 150,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="students-table__meta">{params.row.creationDate}</span>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      minWidth: 230,
      flex: 1.15,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="students-table__department">
          {params.row.department}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className={getStatusClassName(params.row.status)}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 138,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: "left",
      renderCell: () => (
        <Box className="students-table__action-buttons">
          <IconButton
            className="students-table__icon-button"
            aria-label="Delete student"
          >
            🗑
          </IconButton>
          <IconButton
            className="students-table__icon-button"
            aria-label="Edit student"
          >
            ✎
          </IconButton>
          <IconButton
            className="students-table__icon-button"
            aria-label="View student"
          >
            👁
          </IconButton>
        </Box>
      ),
    },
  ];
}
