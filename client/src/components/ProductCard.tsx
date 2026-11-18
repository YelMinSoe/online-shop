import { ImageOff, ShoppingCart } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"

export type Product = {
  id: number
  name: string
  description: string
  price: string // Decimal က string လာတယ်
  discount: string
  stock: number
  images: { id: number; urlPath: string }[]
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()

  const price = Number(product.price)
  const discount = Number(product.discount)
  const hasDiscount = discount > 0
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price

  const imageUrl = product.images[0]
    ? `${import.meta.env.VITE_BACKEND_URL}/${product.images[0].urlPath}`
    : null

  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  return (
    // relative: ဖုံးထားတဲ့ link ရဲ့ အကျယ်အဝန်းကို card ကန့်သတ်ဖို့
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              outOfStock ? "opacity-50 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}

        {hasDiscount && !outOfStock && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">
          {/* after:absolute after:inset-0 ဆိုတာ card တစ်ခုလုံးကို နှိပ်လို့ရအောင် ချဲ့တာ */}
          <Link
            to={`/products/${product.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-green-600">
            {`¥ ${finalPrice.toLocaleString()}`}
          </span>
          {hasDiscount && (
            <span className="text-sm text-red-600 line-through">
              {price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        <p
          className={`text-xs font-medium ${
            outOfStock
              ? "text-red-500"
              : lowStock
                ? "text-orange-500"
                : "text-muted-foreground"
          }`}
        >
          {outOfStock
            ? "Out of stock"
            : lowStock
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
        </p>

        {/* relative z-10: ဖုံးထားတဲ့ link အပေါ်မှာ ရှိအောင်၊ ဒါမှ button ကိုနှိပ်ရင် cart ထဲပဲ ထည့် */}
        <Button
          className="relative z-10 mt-auto w-full cursor-pointer"
          disabled={outOfStock}
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: finalPrice,
              image: imageUrl ?? undefined,
              stock: product.stock,
            })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {outOfStock ? "Unavailable" : "Add to cart"}
        </Button>
      </div>
    </div>
  )
}

export default ProductCard
