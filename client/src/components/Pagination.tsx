import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

// 1 … 4 5 6 … 20 ပုံစံ
const getPages = (page: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)

  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("...")

  pages.push(total)
  return pages
}

const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-2 pb-8"
    >
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className="cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Mobile: လက်ရှိ page / စုစုပေါင်း ပဲပြ */}
      <span className="px-3 text-sm font-medium sm:hidden">
        {page} / {totalPages}
      </span>

      {/* sm အထက်: နံပါတ်တွေ */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {getPages(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => onChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className="cursor-pointer"
            >
              {p}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className="cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

export default Pagination
