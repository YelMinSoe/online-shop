import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router"
import { Loader2, ShoppingBag, XCircle } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Status = "PENDING" | "SHIPPED" | "CANCELLED"

type Order = {
  id: number
  code: string
  totalPrice: string
  status: Status
  createdAt: string
  products: {
    id: number
    quantity: number
    price: string
    product: { id: number; name: string }
  }[]
}

const STATUS: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-orange-50 text-orange-600 dark:bg-orange-950",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-green-50 text-green-600 dark:bg-green-950",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 dark:bg-red-950",
  },
}

const POLL_MS = 15000

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState<Order | null>(null) // cancel လုပ်မယ့် order
  const [cancelling, setCancelling] = useState(false)

  // if silent is true , don't show spinner and  toast.error
  const fetchOrders = useCallback(async (silent: boolean) => {
    try {
      const res = await axios.get("/api/auth/orders/get-my-orders")
      setOrders(res.data.orders ?? [])
    } catch (error) {
      if (silent) return
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to load orders")
          : "An unexpected error occurred"
      )
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // refect very 15 seconds
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders(false)

    const refresh = () => {
      if (document.visibilityState === "visible") fetchOrders(true)
    }
    const timer = setInterval(refresh, POLL_MS)
    document.addEventListener("visibilitychange", refresh)

    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [fetchOrders])

  const handleCancel = async () => {
    if (!target) return
    setCancelling(true)
    try {
      await axios.patch(`/api/auth/orders/cancel-order/${target.id}`)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === target.id ? { ...o, status: "CANCELLED" } : o
        )
      )
      toast.success("Order cancelled")
      setTarget(null)
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to cancel order")
          : "An unexpected error occurred"
      )
      // if got 409, get back new status
      setTarget(null)
      fetchOrders(true)
    } finally {
      setCancelling(false)
    }
  }

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
    <>
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const status = STATUS[order.status]
          const cancelled = order.status === "CANCELLED"

          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">#{order.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <ul className={`divide-y px-4 ${cancelled ? "opacity-60" : ""}`}>
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
                      {(Number(line.price) * line.quantity).toLocaleString()}{" "}
                      MMK
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                <div>
                  <span className="text-sm text-muted-foreground">Total </span>
                  <span
                    className={`text-lg font-bold ${
                      cancelled
                        ? "text-muted-foreground line-through"
                        : "text-green-600"
                    }`}
                  >
                    {Number(order.totalPrice).toLocaleString()} MMK
                  </span>
                </div>

                {/* Don't show button after shipped (just only in pending step) */}
                {order.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTarget(order)}
                    className="cursor-pointer border-red-300 text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Cancel order
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm dialog */}
      <Dialog
        open={target !== null}
        onOpenChange={(o) => {
          if (!o && !cancelling) setTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              Order #{target?.code} will be cancelled. This cannot be undone.
              Please contact the shop about your payment refund.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={cancelling}
              onClick={() => setTarget(null)}
              className="cursor-pointer"
            >
              Keep order
            </Button>
            <Button
              variant="destructive"
              disabled={cancelling}
              onClick={handleCancel}
              className="cursor-pointer"
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrderHistory
