import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const minPage = Math.max(1, currentPage - 2);
  const maxPage = Math.min(totalPages, currentPage + 2);
  const pages = [];
  for (let i = minPage; i <= maxPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="bg-fantasy-cosmic/20 border-fantasy-cosmic/30 hover:bg-fantasy-cosmic/40"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
      )}
      {pages.map((page) => (
        <div key={page}>
          {page === currentPage ? (
            <span className="text-fantasy-primary">
              {page}
            </span>
          ) : (
          <Button
            variant="outline"
            size="sm"
            className="bg-fantasy-cosmic/30 border-fantasy-primary text-fantasy-primary hover:bg-fantasy-primary/20"
            onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )}
        </div>
      ))}
      {currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          className="bg-fantasy-cosmic/20 border-fantasy-cosmic/30 hover:bg-fantasy-cosmic/40"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      )}
    </div>
  )
}
