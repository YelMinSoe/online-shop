import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
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

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 "

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm font-bold text-red-500">{message}</p> : null

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CheckoutDialog = ({ open, onOpenChange }: Props) => {
  const { items, totalPrice, clear } = useCart()
  const navigate = useNavigate()
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [searching, setSearching] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", postalCode: "", address: "" },
  })

  // Dialog ဖွင့်တိုင်း saved address ကို ကြိုဖြည့်
  useEffect(() => {
    if (!open) return
    const loadAddress = async () => {
      setLoadingAddress(true)
      try {
        const res = await axios.get("/api/address")
        if (res.data.address) {
          const { name, phone, postalCode, address } = res.data.address
          reset({ name, phone, postalCode, address })
        }
      } catch {
        // address မရှိတာ/ဖတ်မရတာ ပုံမှန်၊ form ဗလာနဲ့ ဆက်သွား
      } finally {
        setLoadingAddress(false)
      }
    }
    loadAddress()
  }, [open, reset])

  const onSubmit = async (address: FormData) => {
    try {
      const res = await axios.post("/api/orders", {
        // ဈေး မပို့ပါ၊ backend က DB ကနေ တွက်မယ်
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        address,
      })
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
    }
  }

  //   auto fill address by postal code
  const handleSearch = async () => {
    setSearching(true)
    const result = await lookupPostal(getValues("postalCode"))
    setSearching(false)
    if (!result)
      return toast.error("Address not found. Please enter it manually.")

    // ကိုယ်တိုင်ရိုက်ထားပြီးသားကို မထပ်ရေးဖို့
    if (!getValues("address")) {
      setValue("address", result, { shouldValidate: true })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isSubmitting) onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delivery address</DialogTitle>
          <DialogDescription>
            Where should we send your order?
          </DialogDescription>
        </DialogHeader>

        {loadingAddress ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                  placeholder="08xxxxxxxxx"
                  className={inputClass}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center lg:justify-between">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Postal code</label>

                    <input
                      {...register("postalCode")}
                      maxLength={8}
                      className={inputClass}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    disabled={searching}
                    onClick={handleSearch}
                    className="mt-6 ml-2 h-9 cursor-pointer"
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
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
                onClick={() => onOpenChange(false)}
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
                    Placing...
                  </>
                ) : (
                  "Place order"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutDialog
