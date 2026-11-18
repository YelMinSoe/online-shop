import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import ProductCard, { type Product } from "@/components/ProductCard"
import Pagination from "@/components/Pagination"

const LIMIT = 12 // 2၊ 3၊ 4 ကော်လံ အားလုံးနဲ့ အပြည့်ကိုက်

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false // page မြန်မြန်ပြောင်းရင် response အဟောင်းက အသစ်ကို မဖြတ်ရေးအောင်

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/products/get-all-products", {
          params: { page, limit: LIMIT },
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
  }, [page])

  // ?page=999 လို့ ရိုက်ရင် နောက်ဆုံး page ကို ပြန်ပို့
  useEffect(() => {
    if (!loading && page > totalPages) {
      setSearchParams({ page: String(totalPages) }, { replace: true })
    }
  }, [loading, page, totalPages, setSearchParams])

  const goToPage = (p: number) => {
    setSearchParams({ page: String(p) })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">No products yet</p>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-6">
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
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      </div>
    </div>
  )
}

export default Products
