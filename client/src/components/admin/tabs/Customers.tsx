import { useEffect, useState } from "react"
import axios, { isAxiosError } from "@/helpers/axios"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Snowflake, UserCheck, Users } from "lucide-react"

type Status = "ACTIVE" | "FREEZE"

type Customer = {
  id: number
  email: string
  role: "ADMIN" | "CUSTOMER"
  status: Status
  createdAt: string
}

type Pending = { email: string; status: Status }

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [pending, setPending] = useState<Pending | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")

  // total users count
  const totalUsers = customers.length
  const activeUsers = customers.filter((c) => c.status === "ACTIVE").length
  const frozenUsers = totalUsers - activeUsers
  // fetch all user when go to admin dashboard -> customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/auth/admin/users/get-all-users")
        setCustomers(response.data.users)
      } catch (error) {
        setError(true)
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Failed to load customers"
          )
        } else {
          toast.error("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  // handle freeze user
  const handleFreezeUser = async () => {
    if (!pending) return
    setSubmitting(true)
    try {
      const response = await axios.patch("/api/auth/admin/users/freeze-user", {
        email: pending.email,
        status: pending.status,
      })
      setCustomers((prev) =>
        prev.map((c) =>
          c.email === pending.email ? { ...c, status: pending.status } : c
        )
      )
      toast.success(
        pending.status === "FREEZE"
          ? (response.data.message ?? "User frozen successfully")
          : "User activated successfully"
      )
      setPending(null)
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to update status")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isFreeze = pending?.status === "FREEZE"

  //   search user by email
  const filteredCustomers = customers.filter((c) =>
    c.email.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search user by email..."
        className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {/* total user count */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border bg-purple-50 px-3 py-1.5 dark:bg-purple-950">
          <Users className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-bold">{totalUsers}</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-green-50 px-3 py-1.5 dark:bg-green-950">
          <UserCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
          <span className="text-xs text-muted-foreground">Active</span>
          <span className="text-sm font-bold">{activeUsers}</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-red-50 px-3 py-1.5 dark:bg-red-950">
          <Snowflake className="h-4 w-4 text-red-600 dark:text-red-300" />
          <span className="text-xs text-muted-foreground">Frozen</span>
          <span className="text-sm font-bold">{frozenUsers}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-t">
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading customers...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr className="border-t">
                <td colSpan={4} className="px-4 py-10 text-center text-red-500">
                  Failed to load customers. Please check your connection and try
                  again.
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr className="border-t">
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td
                    className={`px-4 py-3 ${
                      c.status === "FREEZE" ? "line-through opacity-50" : ""
                    }`}
                  >
                    {c.email}
                  </td>
                  <td className="px-4 py-3">{c.status}</td>
                  <td className="px-4 py-3">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {c.role === "ADMIN" ? (
                      <span className="text-muted-foreground">-</span>
                    ) : c.status === "ACTIVE" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() =>
                          setPending({ email: c.email, status: "FREEZE" })
                        }
                      >
                        FREEZE
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() =>
                          setPending({ email: c.email, status: "ACTIVE" })
                        }
                      >
                        ACTIVE
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm modal */}
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !submitting) setPending(null)
        }}
      >
        <DialogContent className="shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isFreeze ? "Freeze this user?" : "Activate this user?"}
            </DialogTitle>
            <DialogDescription>
              {isFreeze
                ? `${pending?.email} will no longer be able to log in or use the shop.`
                : `${pending?.email} will be able to log in and use the shop again.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={submitting}
              className="cursor-pointer"
              onClick={() => setPending(null)}
            >
              Cancel
            </Button>
            <Button
              variant={isFreeze ? "destructive" : "default"}
              disabled={submitting}
              className="cursor-pointer"
              onClick={handleFreezeUser}
            >
              {submitting ? "Please wait..." : isFreeze ? "Freeze" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Customers
