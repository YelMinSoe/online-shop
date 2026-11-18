import { Button } from "@/components/ui/button"
import { NavLink, useNavigate } from "react-router"
import { ModeToggle } from "../mode-toggle"
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingCartMinus,
  Store,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import axios, { isAxiosError } from "@/helpers/axios"
import { toast } from "react-toastify"
import { useState } from "react"
import AdminDashboardModal from "../admin/AdminDashboard"
import { useCart } from "@/hooks/useCart"

const Desktop = () => {
  const navigate = useNavigate()
  const { email, role, loading, dispatch } = useAuth()
  const [adminOpen, setAdminOpen] = useState(false)
  const { totalQuantity } = useCart()

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout")
      toast.success(response.data.message)
      dispatch({ type: "LOGOUT" })
      navigate("/products")
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }
  return (
    <div className="hidden h-full items-center justify-between px-10 xl:flex">
      <NavLink to="/">
        <div className="flex items-center justify-center">
          <Store className="size-8" />
          <h1 className="ml-2 text-2xl font-bold">Team Hex Shop</h1>
        </div>
      </NavLink>
      <ul className="flex gap-10 text-lg font-semibold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-full after:origin-center after:rounded-full after:bg-red-400 after:transition-transform after:duration-300 ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-full after:origin-center after:rounded-full after:bg-red-400 after:transition-transform after:duration-300 ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-full after:origin-center after:rounded-full after:bg-red-400 after:transition-transform after:duration-300 ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`
          }
        >
          About
        </NavLink>
      </ul>
      {/* User Controls */}
      <ul className="flex items-center gap-7">
        {email ? (
          <>
            <li>
              <p className="text-lg font-medium">{email}</p>
            </li>
            <li>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Button
                variant="destructive"
                nativeButton={false}
                render={<NavLink to="/register" />}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </li>
            <li>
              <Button
                variant="destructive"
                nativeButton={false}
                render={<NavLink to="/login" />}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </li>
          </>
        )}
        {!loading && role === "ADMIN" && (
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setAdminOpen(true)}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
        )}
        <Button
          variant="outline"
          className="relative cursor-pointer"
          render={<NavLink to="cart" />}
        >
          <ShoppingCartMinus className="h-5 w-5" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
              {totalQuantity}
            </span>
          )}
        </Button>
        <ModeToggle />
      </ul>
      <AdminDashboardModal
        open={adminOpen}
        onOpenChange={setAdminOpen}
      ></AdminDashboardModal>
    </div>
  )
}

export default Desktop
