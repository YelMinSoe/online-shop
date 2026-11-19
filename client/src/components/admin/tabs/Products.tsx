import { useCallback, useEffect, useState } from "react"
import { ImageOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
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
import ProductForm, { type AdminProduct } from "./ProductForm"

const LIST_URL = "/api/products/get-all-products" // get products api
const ADMIN_URL = "/api/auth/admin/products/drop-product" //delete product api
const LIMIT = 10

const Products = () => {
  const [view, setView] = useState<"list" | "form">("list")
  const [editing, setEditing] = useState<AdminProduct | null>(null)

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [target, setTarget] = useState<AdminProduct | null>(null) // delete မယ့် product
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await axios.get(LIST_URL, {
        params: { page: p, limit: LIMIT },
      })
      setProducts(res.data.products)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to load products")
          : "An unexpected error occurred"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (view === "list") fetchProducts(page)
  }, [view, page, fetchProducts])

  const openNew = () => {
    setEditing(null)
    setView("form")
  }
  const openEdit = (p: AdminProduct) => {
    setEditing(p)
    setView("form")
  }

  const handleDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      const res = await axios.delete(`${ADMIN_URL}/${target.id}`)
      toast.success(res.data.message ?? "Product deleted")
      setTarget(null)
      // go to first if it is left one
      if (products.length === 1 && page > 1) setPage(page - 1)
      else fetchProducts(page)
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to delete product")
          : "An unexpected error occurred"
      )
      setTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  if (view === "form") {
    return (
      <ProductForm
        product={editing}
        onCancel={() => setView("list")}
        onSaved={() => setView("list")}
      />
    )
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search in this page..."
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600"
        />
        <Button onClick={openNew} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> New product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {search ? `No results for "${search}"` : "No products yet"}
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const price = Number(p.price)
                const discount = Number(p.discount)
                const finalPrice = price - (price * discount) / 100
                const img = p.images[0]
                  ? `${import.meta.env.VITE_BACKEND_URL}/${p.images[0].urlPath}`
                  : null

                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          {img ? (
                            <img
                              src={img}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <ImageOff className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <span className="line-clamp-2 min-w-30 font-medium">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium">
                        {finalPrice.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          {price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.stock === 0
                            ? "font-medium text-red-500"
                            : p.stock <= 5
                              ? "font-medium text-orange-500"
                              : ""
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(p)}
                          aria-label={`Edit ${p.name}`}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setTarget(p)}
                          aria-label={`Delete ${p.name}`}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Delete confirm */}
      <Dialog
        open={target !== null}
        onOpenChange={(o) => {
          if (!o && !deleting) setTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this product?</DialogTitle>
            <DialogDescription>
              "{target?.name}" will be removed from the shop. If it is in
              existing orders, it will be hidden instead of deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => setTarget(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
              className="cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Products
