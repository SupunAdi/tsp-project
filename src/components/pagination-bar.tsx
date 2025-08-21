import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { visiblePages } from "@/hooks/use-pagination"

type Props = {
  total: number
  page: number
  pageSize: number
  pageCount: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  start?: number
  end?: number
}

export default function PaginationBar({
  total,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  start,
  end,
}: Props) {
  const pages = visiblePages(page, pageCount)

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-nowrap items-center gap-4 whitespace-nowrap">
        {/* left: range text */}
        <div className="text-sm text-muted-foreground shrink-0">
          Showing <span className="font-medium">{start ?? 0}</span>–
          <span className="font-medium">{end ?? 0}</span> of{" "}
          <span className="font-medium">{total}</span>
        </div>

        {/* middle: rows-per-page */}
        {onPageSizeChange && (
          <div className="inline-flex items-center gap-2 shrink-0">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
              className="h-9 w-[96px] rounded-md border bg-background px-2 text-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* right: pager */}
        <div className="ml-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(Math.max(1, page - 1))
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pages.map((p, i) =>
                p === "…" ? (
                  <PaginationItem key={`e-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(p as number)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(Math.min(pageCount, page + 1))
                  }}
                  className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
