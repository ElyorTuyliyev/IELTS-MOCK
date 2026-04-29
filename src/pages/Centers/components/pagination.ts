export function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-left', totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis-right', totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, 'ellipsis-left', currentPage, 'ellipsis-right', totalPages] as const
}
