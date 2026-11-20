import { useCallback, useEffect, useState } from "react"
import { Loader2, Package, RefreshCw, Receipt, Send } from "lucide-react"
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
import Pagination from "@/components/Pagination"
import ImageViewer from "@/components/ImageViewer"

const LIST_URL = "/api/auth/admin/orders/get-orders"
const SLIP_URL = "/api/auth/admin/orders/slip" // + /:id
const SEND_URL = "/api/auth/admin/orders/send-order" // + /:id
const LIMIT = 10

type AdminOrder = {
  id: number
  code: string
  totalPrice: string
  createdAt: string
  updatedAt: string
  hasSlip: boolean
  user: {
    email: string
    address: {
      name: string
      phone: string
      postalCode: string
      address: string
    } | null
  }
  products: {
    id: number
    quantity: number
    price: string
    product: { id: number; name: string }
  }[]
}

type Props = { status: "PENDING" | "SHIPPED" }

const OrdersList = ({ status }: Props) => {
  const isPending = status === "PENDING"

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [slipSrc, setSlipSrc] = useState<string | null>(null)
  const [slipLoading, setSlipLoading] = useState<number | null>(null)

  const [target, setTarget] = useState<AdminOrder | null>(null)
  const [sending, setSending] = useState(false)

  const fetchOrders = useCallback(
    async (p: number) => {
      setLoading(true)
      try {
        const res = await axios.get(LIST_URL, {
          params: { status, page: p, limit: LIMIT },
        })
        setOrders(res.data.orders)
        setTotalPages(res.data.totalPages)
      } catch (error) {
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Failed to load orders")
            : "An unexpected error occurred"
        )
      } finally {
        setLoading(false)
      }
    },
    [status]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders(page)
  }, [page, fetchOrders])

  // Slip ကို Admin cookie နဲ့ blob အဖြစ်ယူပြီး ပြ
  const viewSlip = async (id: number) => {
    setSlipLoading(id)
    try {
      const res = await axios.get(`${SLIP_URL}/${id}`, { responseType: "blob" })
      setSlipSrc(URL.createObjectURL(res.data))
    } catch {
      toast.error("Failed to load payment slip")
    } finally {
      setSlipLoading(null)
    }
  }

  const closeSlip = () => {
    if (slipSrc) URL.revokeObjectURL(slipSrc)
    setSlipSrc(null)
  }

  const handleSend = async () => {
    if (!target) return
    setSending(true)
    try {
      const res = await axios.patch(`${SEND_URL}/${target.id}`)
      toast.success(res.data.message ?? "Order shipped")
      setTarget(null)
      if (orders.length === 1 && page > 1) setPage(page - 1)
      else fetchOrders(page)
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to update order")
          : "An unexpected error occurred"
      )
      setTarget(null)
      fetchOrders(page)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isPending
            ? "Check the payment slip, then ship the order."
            : "Orders that have already been shipped."}
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => fetchOrders(page)}
          className="cursor-pointer"
        >
          <RefreshCw
            className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Package className="h-10 w-10" />
          {isPending ? "No new orders" : "No shipped orders yet"}
        </div>
      ) : (
        <div
          className={`flex flex-col gap-4 transition-opacity ${loading ? "opacity-50" : ""}`}
        >
          {orders.map((o) => (
            <div
              key={o.id}
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              {/* Top */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">#{o.code}</p>
                  <p className="text-xs text-muted-foreground">
                    Ordered {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                {!isPending && (
                  <p className="text-xs text-muted-foreground">
                    Shipped {new Date(o.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                {/* Customer + address */}
                <div className="min-w-0 text-sm">
                  <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                    Customer
                  </p>
                  <p className="font-medium wrap-anywhere">{o.user.email}</p>
                  {o.user.address ? (
                    <div className="mt-2 text-muted-foreground">
                      <p>
                        {o.user.address.name} · {o.user.address.phone}
                      </p>
                      <p>〒{o.user.address.postalCode}</p>
                      <p className="wrap-anywhere">{o.user.address.address}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-orange-500">No address on file</p>
                  )}
                </div>

                {/* Items */}
                <div className="min-w-0 text-sm">
                  <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                    Items
                  </p>
                  <ul className="divide-y">
                    {o.products.map((l) => (
                      <li
                        key={l.id}
                        className="flex justify-between gap-3 py-1.5"
                      >
                        <span className="line-clamp-1">
                          {l.product.name} × {l.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          {(Number(l.price) * l.quantity).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                <div>
                  <span className="text-sm text-muted-foreground">Total </span>
                  <span className="text-lg font-bold text-green-600">
                    {Number(o.totalPrice).toLocaleString()} MMK
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!o.hasSlip || slipLoading === o.id}
                    onClick={() => viewSlip(o.id)}
                    className="cursor-pointer"
                  >
                    {slipLoading === o.id ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Receipt className="mr-1 h-3 w-3" />
                    )}
                    {o.hasSlip ? "View slip" : "No slip"}
                  </Button>

                  {isPending && (
                    <Button
                      size="sm"
                      onClick={() => setTarget(o)}
                      className="cursor-pointer"
                    >
                      <Send className="mr-1 h-3 w-3" /> Mark as shipped
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ImageViewer src={slipSrc} alt="Payment slip" onClose={closeSlip} />

      {/* Ship confirm */}
      <Dialog
        open={target !== null}
        onOpenChange={(o) => {
          if (!o && !sending) setTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ship this order?</DialogTitle>
            <DialogDescription>
              Order #{target?.code} will be marked as shipped and the customer
              will no longer be able to cancel it. Make sure the payment slip is
              valid first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={sending}
              onClick={() => setTarget(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={sending}
              onClick={handleSend}
              className="cursor-pointer"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Yes, ship it"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrdersList
