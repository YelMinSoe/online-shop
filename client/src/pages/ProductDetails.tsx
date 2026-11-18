import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, ImageOff, Loader2, ShoppingCart } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import type { Product } from "@/components/ProductCard"

type ProductDetail = Product & { category?: { id: number; name: string } }

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [active, setActive] = useState(0) // ရွေးထားတဲ့ ပုံ

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/products/${id}`)
        setProduct(res.data.product)
        setActive(0)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true)
        } else {
          toast.error("Failed to load product")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading...
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button nativeButton={false} render={<Link to="/products" />}>
          Back to products
        </Button>
      </div>
    )
  }

  const price = Number(product.price)
  const discount = Number(product.discount)
  const hasDiscount = discount > 0
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price
  const saved = price - finalPrice

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const imageUrls = product.images.map(
    (img) => `${import.meta.env.VITE_BACKEND_URL}/${img.urlPath}`
  )

  const handleAdd = () =>
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: imageUrls[0],
      stock: product.stock,
    })

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-28 lg:px-6 lg:pb-10">
      <Link
        to="/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            {imageUrls[active] ? (
              <img
                src={imageUrls[active]}
                alt={product.name}
                className={`h-full w-full object-cover ${
                  outOfStock ? "opacity-50 grayscale" : ""
                }`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-14 w-14" />
              </div>
            )}

            {hasDiscount && !outOfStock && (
              <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
            {outOfStock && (
              <span className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white">
                Sold out
              </span>
            )}
          </div>

          {imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {imageUrls.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 ${
                    i === active ? "border-purple-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col gap-4">
          {product.category && (
            <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {product.category.name.toLocaleUpperCase()}
            </span>
          )}

          <h1 className="text-2xl font-bold wrap-anywhere lg:text-3xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-green-600">
              {finalPrice.toLocaleString()} MMK
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-red-600 line-through">
                  {price.toLocaleString()}
                </span>
                <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-medium text-red-600 dark:bg-red-950">
                  Save {saved.toLocaleString()} MMK
                </span>
              </>
            )}
          </div>

          <p
            className={`text-sm font-medium ${
              outOfStock
                ? "text-red-500"
                : lowStock
                  ? "text-orange-500"
                  : "text-green-600"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : lowStock
                ? `Only ${product.stock} left`
                : `${product.stock} in stock`}
          </p>

          <div className="border-t pt-4">
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="text-sm leading-relaxed wrap-anywhere whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Desktop button */}
          <Button
            size="lg"
            disabled={outOfStock}
            onClick={handleAdd}
            className="mt-2 hidden w-full cursor-pointer lg:inline-flex"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {outOfStock ? "Unavailable" : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t bg-background p-3 lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">Total price</p>
          <p className="text-lg font-bold text-green-600">
            {finalPrice.toLocaleString()} MMK
          </p>
        </div>
        <Button
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1 cursor-pointer"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {outOfStock ? "Unavailable" : "Add to cart"}
        </Button>
      </div>
    </div>
  )
}

export default ProductDetails
