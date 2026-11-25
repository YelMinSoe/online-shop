import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, MapPin, Pencil } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"
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
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600"

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm font-bold text-red-500">{message}</p> : null

const AddressSection = () => {
  const [saved, setSaved] = useState<FormData | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/auth/address/get-address")
        const a = res.data.address
        if (a) {
          const value = {
            name: a.name,
            phone: a.phone,
            postalCode: a.postalCode,
            address: a.address,
          }
          setSaved(value)
          reset(value)
        } else {
          setEditing(true) // if address is not existing , show form
        }
      } catch {
        setEditing(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reset])

  const onSave = async (data: FormData) => {
    try {
      await axios.patch("/api/auth/address/modify-address", data)
      setSaved(data)
      reset(data)
      setEditing(false)
      toast.success("Address saved")
    } catch (error) {
      console.log("Error found in this section")
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to save address")
          : "An unexpected error occurred"
      )
    }
  }

  const handleSearch = async () => {
    setSearching(true)
    const result = await lookupPostal(getValues("postalCode"))
    setSearching(false)
    if (!result)
      return toast.error("Address not found. Please enter it manually.")
    setValue("address", result, { shouldValidate: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading...
      </div>
    )
  }

  if (!editing && saved) {
    return (
      <div className="flex items-start gap-3 rounded-xl border bg-card p-5 shadow-sm">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">{saved.name}</p>
          <p className="text-muted-foreground">{saved.phone}</p>
          <p className="mt-2">〒{saved.postalCode}</p>
          <p className="wrap-anywhere">{saved.address}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
          className="cursor-pointer"
        >
          <Pencil className="mr-1 h-3 w-3" /> Edit
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm"
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
        {saved && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 cursor-pointer"
            onClick={() => {
              reset(saved) // reject it
              setEditing(false)
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save address"
          )}
        </Button>
      </div>
    </form>
  )
}

export default AddressSection
