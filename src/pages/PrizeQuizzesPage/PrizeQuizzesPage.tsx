import { useMemo, useState } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";

import { Layout } from "../../components/layout";
import { createPrizeQuizColumns } from "./constants/PrizeQuizzesPage.columns";
import {
  PRIZE_QUIZ_PAGE_SIZE,
  PRIZE_QUIZZES,
} from "./constants/PrizeQuizzesPage.constants";
import type { PrizeQuizStatus } from "./constants/PrizeQuizzesPage.constants";
import { PrizeQuizzesPageRoot } from "./PrizeQuizzesPage.style";

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
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              pageSizeOptions={[8, 16, 24]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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
          </Box>
        </Box>
      </PrizeQuizzesPageRoot>
    </Layout>
  );
}
