import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImagePlus, Loader2, PackagePlus, X } from "lucide-react"
import { toast } from "react-toastify"
import axios, { isAxiosError } from "@/helpers/axios"
import { Button } from "@/components/ui/button"

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(52, "Max 52 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(255, "Max 255 characters"),
  price: z
    .number({ error: "Price is required" })
    .positive("Must be greater than 0"),
  discount: z.number({ error: "Must be a number" }).min(0).max(100),
  stock: z
    .number({ error: "Stock is required" })
    .int("Whole number only")
    .min(0),
  categoryId: z.number({ error: "Select a category" }),
})

type FormData = z.infer<typeof schema>
type Category = { id: number; name: string }

// initialize for input style
const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600"

// initializes for error message
const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm font-bold text-red-500">{message}</p> : null

const CreateProduct = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [adding, setAdding] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { discount: 0, stock: 0 },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const price = watch("price") //ui render live for final price
  const discount = watch("discount")
  const finalPrice =
    Number.isFinite(price) && Number.isFinite(discount)
      ? price - (price * discount) / 100
      : null

  // useEffect(() => {
  //   axios
  //     .get("/api/admin/categories")
  //     .then((res) => setCategories(res.data.categories))
  //     .catch(() => toast.error("Failed to load categories"))
  // }, [])

  const addCategory = async () => {
    const name = newCategory.trim()
    if (!name) return
    setAdding(true)
    try {
      const res = await axios.post("/api/admin/categories", { name })
      const created: Category = res.data.category
      setCategories((prev) => [...prev, created])
      setValue("categoryId", created.id)
      setNewCategory("")
      toast.success("Category added")
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to add category")
          : "An unexpected error occurred"
      )
    } finally {
      setAdding(false)
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image")
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be under 5MB")

    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  // clear uploaded image
  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(null)
    setPreview(null)
  }

  const onSubmit = async (data: FormData) => {
    if (!image) return toast.error("Please add an image")

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, String(value))
    )
    formData.append("image", image)

    try {
      const res = await axios.post("/api/admin/products", formData)
      toast.success(res.data.message ?? "Product created successfully")
      reset()
      clearImage()
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to create product")
          : "An unexpected error occurred"
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
    >
      {/* Left: details */}
      <div className="flex flex-col gap-5 rounded-lg border p-5 lg:col-span-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <PackagePlus className="h-5 w-5" />
          Product details
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("name")}
            maxLength={52}
            placeholder="e.g. Oak Dining Chair"
            className={inputClass}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            maxLength={255}
            placeholder="Short description of the product"
            className={`${inputClass} resize-none`}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Category</label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.categoryId?.message} />

          <div className="mt-1 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Or add a new category"
              maxLength={50}
              className={inputClass}
            />
            <Button
              type="button"
              variant="default"
              disabled={adding || !newCategory.trim()}
              onClick={addCategory}
              className="h-10 cursor-pointer"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Price</label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className={inputClass}
            />
            <FieldError message={errors.price?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Discount (%)</label>
            <input
              {...register("discount", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className={inputClass}
            />
            <FieldError message={errors.discount?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Stock</label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              className={inputClass}
            />
            <FieldError message={errors.stock?.message} />
          </div>
        </div>
      </div>

      {/* Right: image + price + submit */}
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div className="rounded-lg border p-5">
          <h3 className="mb-4 font-semibold">Image</h3>

          {preview ? (
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove image"
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-1.5 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, WEBP · up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="rounded-lg border bg-purple-50 p-5 dark:bg-purple-950">
          <p className="text-xs text-muted-foreground">Final price</p>
          <p className="mt-1 text-2xl font-bold">
            {finalPrice !== null ? finalPrice.toFixed(2) : "-"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 cursor-pointer"
            onClick={() => {
              reset()
              clearImage()
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create product"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateProduct
