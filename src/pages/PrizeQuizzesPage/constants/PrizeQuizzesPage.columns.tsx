import type { CSSProperties } from "react";

import { Box, Button, Typography } from "@mui/material";
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

const getStatusClassName = (status: PrizeQuizStatus) =>
  `prize-table__pill prize-table__pill--${status.toLowerCase()}`;

const getTypeClassName = (type: PrizeQuizType) =>
  `prize-table__pill prize-table__pill--${type.toLowerCase().replace(/\s+/g, "-")}`;

export function createPrizeQuizColumns(): GridColDef<PrizeQuizGridRow>[] {
  return [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      minWidth: 210,
      sortable: false,
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
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="prize-table__description">
          {params.row.description}
        </span>
      ),
    },
    {
      field: "level",
      headerName: "Level",
      minWidth: 128,
      sortable: false,
      renderCell: (params) => (
        <Box className="prize-table__level">
          <Box className="prize-table__level-bars">
            {[8, 12, 16].map((barHeight, index) => (
              <Box
                key={`${params.row.id}-bar-${index}`}
                className="prize-table__level-bar"
                sx={
                  {
                    "--bar-height": `${barHeight}px`,
                    "--bar-opacity": index === 2 ? 1 : 0.52,
                    "--level-color": levelToneMap[params.row.levelTone],
                  } as CSSProperties
                }
              />
            ))}
          </Box>
          <span>{params.row.level}</span>
        </Box>
      ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="prize-table__date">{params.row.createdDate}</span>
      ),
    },
    {
      field: "examStatus",
      headerName: "Exam Status",
      minWidth: 132,
      sortable: false,
      renderCell: (params) => (
        <span className={getStatusClassName(params.row.examStatus)}>
          {params.row.examStatus}
        </span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 108,
      sortable: false,
      renderCell: (params) => (
        <span className="prize-table__category">{params.row.category}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 126,
      sortable: false,
      renderCell: (params) => (
        <span className={getTypeClassName(params.row.status)}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 108,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: () => (
        <Box className="prize-table__action-buttons">
          <Button className="prize-table__icon-button" variant="outlined">
            🗑
          </Button>
          <Button className="prize-table__icon-button" variant="outlined">
            ✎
          </Button>
        </Box>
      ),
    },
  ];
}
