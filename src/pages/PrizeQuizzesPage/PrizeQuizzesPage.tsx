import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";

import { Layout } from "../../components/layout";
import { createPrizeQuizColumns } from "./constants/PrizeQuizzesPage.columns";
import {
  PRIZE_QUIZ_PAGE_SIZE,
  PRIZE_QUIZZES,
} from "./constants/PrizeQuizzesPage.constants";
import type { PrizeQuizStatus } from "./constants/PrizeQuizzesPage.constants";
import { PrizeQuizzesPageRoot } from "./PrizeQuizzesPage.style";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis-left", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-right", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "ellipsis-left", currentPage, "ellipsis-right", totalPages] as const;
}

export function PrizeQuizzesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All statuses" | PrizeQuizStatus
  >("All statuses");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: PRIZE_QUIZ_PAGE_SIZE,
  });

  const filteredQuizzes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return PRIZE_QUIZZES.filter((quiz) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        quiz.name.toLowerCase().includes(normalizedSearch) ||
        quiz.description.toLowerCase().includes(normalizedSearch) ||
        quiz.category.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All statuses" || quiz.examStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const rows = useMemo(
    () =>
      filteredQuizzes.map((quiz, index) => ({
        id: `${quiz.name}-${quiz.category}-${index}`,
        ...quiz,
      })),
    [filteredQuizzes],
  );

  const columns = useMemo(() => createPrizeQuizColumns(), []);
  const currentPage = paginationModel.page + 1;
  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize));
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const rangeStart = rows.length === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1;
  const rangeEnd =
    rows.length === 0
      ? 0
      : Math.min((paginationModel.page + 1) * paginationModel.pageSize, rows.length);

  useEffect(() => {
    if (paginationModel.page > totalPages - 1) {
      setPaginationModel((currentState) => ({
        ...currentState,
        page: Math.max(0, totalPages - 1),
      }));
    }
  }, [paginationModel.page, totalPages]);

  return (
    <Layout>
      <PrizeQuizzesPageRoot>
        <Box className="prize-page">
          <Box className="prize-page__head">
            <Typography component="h1" className="prize-page__title">
              Prize Quizzes
            </Typography>

            <Button className="prize-page__primary-button" variant="contained">
              + Add New Prize Quiz
            </Button>
          </Box>

          <Box className="prize-table">
            <Box className="prize-table__filters">
              <TextField
                className="prize-table__search"
                type="search"
                placeholder="Search..."
                aria-label="Search prize quizzes"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="prize-table__search-icon">⌕</Box>
                      </InputAdornment>
                    ),
                  },
                }}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPaginationModel((currentState) => ({
                    ...currentState,
                    page: 0,
                  }));
                }}
              />

              <Box className="prize-table__actions">
                <TextField
                  select
                  className="prize-table__select"
                  aria-label="Exam status"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target.value as "All statuses" | PrizeQuizStatus,
                    );
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: 0,
                    }));
                  }}
                >
                  <MenuItem value="All statuses">Exam status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                </TextField>

                <Button
                  className="prize-table__ghost-button"
                  variant="outlined"
                >
                  Add new category
                </Button>
              </Box>
            </Box>

            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize
              hideFooter
              autoHeight
              rowHeight={66}
              columnHeaderHeight={54}
              pageSizeOptions={[PRIZE_QUIZ_PAGE_SIZE]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={{
                noRowsLabel:
                  "No prize quizzes matched the current search or status filter.",
              }}
              slotProps={{
                pagination: {
                  labelRowsPerPage: "Rows per page:",
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0,
                    pageSize: PRIZE_QUIZ_PAGE_SIZE,
                  },
                },
              }}
              sx={{
                border: 0,
              }}
            />

            <Box className="prize-table__footer">
              <Box className="prize-table__pagination">
                <Button
                  className="prize-table__page-button"
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: Math.max(0, currentState.page - 1),
                    }))
                  }
                >
                  ‹
                </Button>

                {visiblePages.map((item) =>
                  typeof item === "number" ? (
                    <Button
                      key={item}
                      className={`prize-table__page-number${
                        item === currentPage ? " prize-table__page-number--active" : ""
                      }`}
                      variant="text"
                      onClick={() =>
                        setPaginationModel((currentState) => ({
                          ...currentState,
                          page: item - 1,
                        }))
                      }
                    >
                      {item}
                    </Button>
                  ) : (
                    <span key={item} className="prize-table__page-ellipsis">
                      ...
                    </span>
                  ),
                )}

                <Button
                  className="prize-table__page-button"
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: Math.min(totalPages - 1, currentState.page + 1),
                    }))
                  }
                >
                  ›
                </Button>
              </Box>

              <Box className="prize-table__footer-meta">
                <span>
                  Showing {rangeStart} to {rangeEnd} of {rows.length} entries
                </span>
                <Button className="prize-table__show-button" variant="outlined">
                  Show {paginationModel.pageSize} ⌃
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </PrizeQuizzesPageRoot>
    </Layout>
  );
}
