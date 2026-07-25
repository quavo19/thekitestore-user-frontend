import { InspirationDetailModal } from "@/components/inspiration/InspirationDetailModal";
import { InspirationMasonryGrid } from "@/components/inspiration/InspirationMasonryGrid";
import { Pagination } from "@/components/ui/Pagination";
import {
  INSPIRATION_BOARDS,
  INSPIRATION_PAGE_SIZE,
} from "@/constants/inspiration";
import { useMemo, useState } from "react";

export function InspirationPage() {
  const [page, setPage] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const totalPages = Math.max(
    1,
    Math.ceil(INSPIRATION_BOARDS.length / INSPIRATION_PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedBoards = useMemo(() => {
    const start = (currentPage - 1) * INSPIRATION_PAGE_SIZE;
    return INSPIRATION_BOARDS.slice(start, start + INSPIRATION_PAGE_SIZE);
  }, [currentPage]);

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-hero-dark sm:text-4xl">
          Inspiration
        </h1>
        <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-hero-muted sm:text-base">
          Browse styled spaces and plant arrangements. Tap any board to see
          more photos.
        </p>
      </div>

      <InspirationMasonryGrid
        boards={paginatedBoards}
        onSelectBoard={setSelectedBoard}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <InspirationDetailModal
        board={selectedBoard}
        onClose={() => setSelectedBoard(null)}
      />
    </section>
  );
}
