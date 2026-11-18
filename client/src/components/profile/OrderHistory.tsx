import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Loader2, ShoppingBag } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"

type Order = {
  id: number
  code: string
  totalPrice: string
  status?: "PENDING" | "SENT"
  createdAt: string
  products: {
    id: number
    quantity: number
    price: string
    product: { id: number; name: string }
  }[]
}

const STATUS = {
  PENDING: {
    label: "Pending",
    className: "bg-orange-50 text-orange-600 dark:bg-orange-950",
  },
  SENT: {
    label: "Sent",
    className: "bg-green-50 text-green-600 dark:bg-green-950",
  },
} as const

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/auth/orders/get-my-orders")
        setOrders(res.data.orders ?? [])
      } catch (error) {
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Failed to load orders")
            : "An unexpected error occurred"
        )
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading orders...
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">You have no orders yet</p>
        <Button nativeButton={false} render={<Link to="/products" />}>
          Start shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const status = order.status ? STATUS[order.status] : null
        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            {/* Top */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">#{order.code}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              )}
            </div>

            {/* Items */}
            <ul className="divide-y px-4">
              {order.products.map((line) => (
                <li
                  key={line.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <Link
                      to={`/products/${line.product.id}`}
                      className="line-clamp-1 font-medium hover:underline"
                    >
                      {line.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {Number(line.price).toLocaleString()} MMK ×{" "}
                      {line.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium">
                    {(Number(line.price) * line.quantity).toLocaleString()} MMK
                  </p>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="flex items-center justify-between border-t px-4 py-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-green-600">
                {Number(order.totalPrice).toLocaleString()} MMK
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderHistory
