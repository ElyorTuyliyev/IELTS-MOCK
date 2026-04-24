import type { CSSProperties } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import type {
  PrizeQuizGridRow,
  PrizeQuizStatus,
  PrizeQuizType,
} from "./PrizeQuizzesPage.constants";

const levelToneMap = {
  orange: "#fb923c",
  teal: "#5cc0b8",
  pink: "#f472d0",
  yellow: "#f4c84f",
  blue: "#67ace7",
} as const;

const levelBarBaseHeights = [8, 12, 16] as const;

const getStatusClassName = (status: PrizeQuizStatus) =>
  `prize-table__pill prize-table__pill--${status.toLowerCase()}`;

const getTypeClassName = (type: PrizeQuizType) =>
  `prize-table__pill prize-table__pill--${type.toLowerCase().replace(/\s+/g, "-")}`;

function getLevelBarMetrics(level: string) {
  const [scoreText, totalText] = level.split("/");
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
    const segmentProgress = Math.max(0, Math.min(ratio * levelBarBaseHeights.length - index, 1));

    return {
      height: Math.max(5, Math.round(baseHeight * (0.4 + segmentProgress * 0.6))),
      opacity: 0.28 + segmentProgress * 0.72,
    };
  });
}

export function createPrizeQuizColumns(): GridColDef<PrizeQuizGridRow>[] {
  return [
    {
      field: "name",
      headerName: "Name",
      flex: 1.15,
      minWidth: 240,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <Box className="prize-table__name">
          <Box
            className="prize-table__avatar"
            sx={
              {
                "--avatar-gradient": params.row.avatarGradient,
              } as CSSProperties
            }
          >
            {params.row.initials}
          </Box>
          <Typography component="p" className="prize-table__name-text">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.15,
      minWidth: 240,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="prize-table__description">
          {params.row.description}
        </span>
      ),
    },
    {
      field: "level",
      headerName: "Level",
      minWidth: 136,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => {
        const levelBars = getLevelBarMetrics(params.row.level);

        return (
          <Box className="prize-table__level">
            <Box className="prize-table__level-bars" aria-hidden="true">
              {levelBars.map((bar, index) => (
                <Box
                  key={`${params.row.id}-bar-${index}`}
                  className="prize-table__level-bar"
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
            <span className="prize-table__level-text">{params.row.level}</span>
          </Box>
        );
      },
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      minWidth: 138,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="prize-table__date">{params.row.createdDate}</span>
      ),
    },
    {
      field: "examStatus",
      headerName: "Exam Status",
      minWidth: 146,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className={getStatusClassName(params.row.examStatus)}>
          {params.row.examStatus}
        </span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 110,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className="prize-table__category">{params.row.category}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      sortable: false,
      headerAlign: "left",
      renderCell: (params) => (
        <span className={getTypeClassName(params.row.status)}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: "left",
      renderCell: () => (
        <Box className="prize-table__action-buttons">
          <IconButton
            className="prize-table__icon-button"
            aria-label="Delete prize quiz"
          >
            🗑
          </IconButton>
          <IconButton
            className="prize-table__icon-button"
            aria-label="Edit prize quiz"
          >
            ✎
          </IconButton>
        </Box>
      ),
    },
  ];
}
