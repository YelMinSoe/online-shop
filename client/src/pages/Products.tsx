import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import ProductCard, { type Product } from "@/components/ProductCard"

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products/get-all-products")

        setProducts(res.data.products)
      } catch (error) {
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Failed to load products")
            : "An unexpected error occurred"
        )
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">No products yet</p>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default Products
