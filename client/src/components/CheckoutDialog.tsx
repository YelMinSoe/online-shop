import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImagePlus, Loader2, MapPin, Pencil, X } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/hooks/useCart"
import { lookupPostal } from "@/helpers/lookupPostal"
import ImageViewer from "./ImageViewer"

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Max 50 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{6,15}$/, "Invalid phone number"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{3}-?\d{4}$/, "Invalid postal code (e.g. 100-0001)"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(255, "Max 255 characters"),
})

type FormData = z.infer<typeof schema>

const EMPTY: FormData = { name: "", phone: "", postalCode: "", address: "" }

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600"

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm font-bold text-red-500">{message}</p> : null

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CheckoutDialog = ({ open, onOpenChange }: Props) => {
  const { items, totalPrice, clear } = useCart()
  const navigate = useNavigate()

  const [saved, setSaved] = useState<FormData | null>(null) // address from db
  const [editing, setEditing] = useState(false)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [searching, setSearching] = useState(false)
  const [ordering, setOrdering] = useState(false)
  // Payment slip
  const [slip, setSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  // Image viewer
  const [viewerOpen, setViewerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  })

  const busy = isSubmitting || ordering

  // Dialog ဖွင့်တိုင်း saved address ကို ယူ
  useEffect(() => {
    if (!open) return
    const loadAddress = async () => {
      setLoadingAddress(true)
      try {
        const res = await axios.get("/api/auth/address/get-address")
        const a = res.data.address
        if (a) {
          const value: FormData = {
            name: a.name,
            phone: a.phone,
            postalCode: a.postalCode,
            address: a.address,
          }
          setSaved(value)
          reset(value)
          setEditing(false) // ရှိရင် summary ကို အရင်ပြ
        } else {
          setSaved(null)
          reset(EMPTY)
          setEditing(true) // မရှိရင် form ကို တန်းပြ
        }
      } catch {
        setSaved(null)
        reset(EMPTY)
        setEditing(true)
      } finally {
        setLoadingAddress(false)
      }
    }
    loadAddress()
  }, [open, reset])

  // Payment slip function and clear it
  const handleSlip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image")
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be under 5MB")

    if (slipPreview) URL.revokeObjectURL(slipPreview)
    setSlip(file)
    setSlipPreview(URL.createObjectURL(file))
  }
  // clear slip
  const clearSlip = () => {
    if (slipPreview) URL.revokeObjectURL(slipPreview)
    setSlip(null)
    setSlipPreview(null)
  }
  // Save Address
  const onSaveAddress = async (data: FormData) => {
    try {
      // if address already exist, updated it
      if (saved) {
        await axios.patch("/api/auth/address/modify-address", data)
      } else {
        // or create new address
        await axios.post("/api/auth/address/create-new-address", data)
      }
      setSaved(data)
      reset(data)
      setEditing(false)
      toast.success("Address saved")
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to save address")
          : "An unexpected error occurred"
      )
    }
  }

  // place order
  const handlePlaceOrder = async () => {
    if (!saved) return
    if (!slip) return toast.error("Please upload your payment slip")
    setOrdering(true)
    try {
      const formData = new FormData()
      formData.append(
        "items",
        JSON.stringify(
          items.map((i) => ({ productId: i.id, quantity: i.quantity }))
        )
      )
      formData.append("paymentSlip", slip)

      const res = await axios.post("/api/auth/orders/place-orders", formData)
      toast.success(res.data.message ?? "Order placed successfully")
      clear()
      onOpenChange(false)
      navigate("/products")
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to place order")
          : "An unexpected error occurred"
      )
    } finally {
      setOrdering(false)
    }
  }

  // Postal code နဲ့ address auto fill
  const handleSearch = async () => {
    setSearching(true)
    const result = await lookupPostal(getValues("postalCode"))
    setSearching(false)
    if (!result)
      return toast.error("Address not found. Please enter it manually.")

    // continue input for next address
    setValue("address", result, { shouldValidate: true })
  }

  const handleCancelEdit = () => {
    if (saved) {
      reset(saved) // save old address
      setEditing(false)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!busy) onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delivery address</DialogTitle>
          <DialogDescription>
            {editing
              ? "Enter where we should send your order."
              : "Check your address before placing the order."}
          </DialogDescription>
        </DialogHeader>
        {/* Image viewer */}
        <ImageViewer
          src={viewerOpen ? slipPreview : null}
          alt="Payment slip"
          onClose={() => setViewerOpen(false)}
        />
        {/* Payment slip */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Payment slip <span className="text-red-500">*</span>
          </label>

          {slipPreview ? (
            <div className="relative h-40 overflow-hidden rounded-lg border bg-muted">
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                aria-label="View full image"
                className="h-full w-full cursor-zoom-in"
              >
                <img
                  src={slipPreview}
                  alt="Payment slip"
                  className="h-full w-full object-contain"
                />
              </button>
              <button
                type="button"
                onClick={clearSlip}
                disabled={ordering}
                aria-label="Remove slip"
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-1.5 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30">
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Upload payment slip</span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG · up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlip}
                className="hidden"
              />
            </label>
          )}
        </div>

        {loadingAddress ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : editing ? (
          /* ---------- Edit / Create form ---------- */
          <form
            onSubmit={handleSubmit(onSaveAddress)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Full name</label>
              <input {...register("name")} className={inputClass} />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Phone</label>
                <input
                  {...register("phone")}
                  inputMode="tel"
                  maxLength={15}
                  placeholder="08012345678"
                  className={inputClass}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Postal code</label>
                <div className="flex gap-2">
                  <input
                    {...register("postalCode")}
                    maxLength={8}
                    placeholder="100-0001"
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    disabled={searching}
                    onClick={handleSearch}
                    className="cursor-pointer"
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
                <FieldError message={errors.postalCode?.message} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Address</label>
              <textarea
                {...register("address")}
                rows={3}
                maxLength={255}
                className={`${inputClass} resize-none`}
              />
              <FieldError message={errors.address?.message} />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save address"
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* ---------- Summary + Place order ---------- */
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{saved?.name}</p>
                <p className="text-muted-foreground">{saved?.phone}</p>
                <p className="mt-1">〒{saved?.postalCode}</p>
                <p className="wrap-break-word">{saved?.address}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={ordering}
                onClick={() => setEditing(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-1 h-3 w-3" />
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3 dark:bg-purple-950">
              <span className="text-md font-bold">Total</span>
              <span className="text-lg font-bold">
                {totalPrice.toLocaleString()} MMK
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={ordering}
                className="flex-1 cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={ordering}
                onClick={handlePlaceOrder}
                className="flex-1 cursor-pointer"
              >
                {ordering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing...
                  </>
                ) : (
                  "Place order"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutDialog
