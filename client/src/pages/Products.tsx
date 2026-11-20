import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import ProductCard, { type Product } from "@/components/ProductCard"
import Pagination from "@/components/Pagination"
import CategoryFilter from "@/components/CategoryFilter"

const LIMIT = 12

type Category = { id: number; name: string }

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const categoryParam = Number(searchParams.get("category"))
  const categoryId = categoryParam > 0 ? categoryParam : null

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // fectch categories when product page is running
  useEffect(() => {
    axios
      .get("/api/categories/get-categories")
      .then((res) => {
        setCategories(res.data.categories ?? [])
      })
      .catch(() => {
        return // if categories are empty array
      })
  }, [])

  // Product lists
  useEffect(() => {
    let ignore = false

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/products/get-all-products", {
          params: { page, limit: LIMIT, categoryId: categoryId ?? undefined },
        })
        if (ignore) return
        setProducts(res.data.products)
        setTotalPages(res.data.totalPages)
      } catch (error) {
        if (ignore) return
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Failed to load products")
            : "An unexpected error occurred"
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      ignore = true
    }
  }, [page, categoryId])

  // if invalid page or empty go to all
  useEffect(() => {
    if (!loading && page > totalPages) {
      // eslint-disable-next-line react-hooks/immutability
      updateParams(categoryId, totalPages, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page, totalPages])

  const updateParams = (cat: number | null, p: number, replace = false) => {
    const next = new URLSearchParams()
    if (cat) next.set("category", String(cat))
    if (p > 1) next.set("page", String(p))
    setSearchParams(next, { replace })
  }

  const handleCategory = (id: number | null) => updateParams(id, 1) // page ကို 1 ပြန်ထား
  const handlePage = (p: number) => {
    updateParams(categoryId, p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-6">
      <CategoryFilter
        categories={categories}
        selected={categoryId}
        onChange={handleCategory}
      />

      {loading && products.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
        </div>
      ) : !loading && products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {categoryId ? "No products in this category" : "No products yet"}
        </p>
      ) : (
        <>
          <div
            className={`grid grid-cols-2 gap-3 transition-opacity sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePage}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Products
