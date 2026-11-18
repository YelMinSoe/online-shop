import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { ImageOff, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import CheckoutDialog from "@/components/CheckoutDialog"

const Cart = () => {
  const { items, totalQuantity, totalPrice, increase, decrease, remove } =
    useCart()
  const { email } = useAuth()
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleOrder = () => {
    if (!email) {
      toast.info("Please login to place an order")
      navigate("/login")
      return
    }
    setCheckoutOpen(true)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="h-14 w-14 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Button nativeButton={false} render={<Link to="/products" />}>
          Go to products
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {/* Items */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        <h1 className="text-2xl font-bold">Shopping cart</h1>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="line-clamp-1 font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.price.toLocaleString()} MMK
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="cursor-pointer rounded-md p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-lg border">
                  <button
                    type="button"
                    onClick={() => decrease(item.id)}
                    aria-label="Decrease quantity"
                    className="cursor-pointer p-2 hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increase(item.id)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                    className="cursor-pointer p-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="font-bold">
                  {`¥ ${(item.price * item.quantity).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="h-fit rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-semibold">Order summary</h2>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Items</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t pt-3">
          <span className="font-medium">Total</span>
          <span className="text-2xl font-bold text-red-500">
            {`¥ ${totalPrice.toLocaleString()}`}
          </span>
        </div>

        <Button
          className="mt-5 w-full cursor-pointer md:h-11"
          onClick={handleOrder}
        >
          Order now
        </Button>
      </div>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}

export default Cart
