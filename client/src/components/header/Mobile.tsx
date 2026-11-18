import { Link, NavLink, useNavigate } from "react-router"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { ModeToggle } from "../mode-toggle"
import {
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package2,
  ShoppingCartMinus,
  Store,
  User,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import axios, { isAxiosError } from "@/helpers/axios"
import { toast } from "react-toastify"
import { useState } from "react"
import AdminDashboardModal from "../admin/AdminDashboard"
import { useCart } from "@/hooks/useCart"

const Mobile = () => {
  const { email, role, dispatch } = useAuth()
  const navigate = useNavigate()
  const [adminOpen, setAdminOpen] = useState(false)
  const { totalQuantity } = useCart()

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout")
      dispatch({ type: "LOGOUT" })
      toast.success(response.data.message)
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
    <div className="flex h-full items-center justify-between gap-8 xl:hidden">
      <NavLink to="/">
        <div className="flex items-center justify-center">
          <Store className="ml-2 size-6" />
          <h1 className="ml-2 text-xl font-semibold">Team Hex Shop</h1>
        </div>
      </NavLink>
      <div className="flex items-center gap-3">
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
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="mr-4">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader>
              <SheetTitle className={"mt-4 text-xl font-semibold"}>
                {!email ? (
                  "Welcome to my Shop"
                ) : (
                  <SheetClose>
                    <Link
                      to="/profile"
                      className="flex max-w-50 items-center gap-2 rounded-md px-2 py-1 text-lg font-medium transition hover:bg-muted"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">{email}</span>
                    </Link>
                  </SheetClose>
                )}
              </SheetTitle>
            </SheetHeader>
            <ul className="">
              <SheetClose
                nativeButton={false}
                render={<li />}
                className="flex w-full flex-col gap-6 p-4"
              >
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<NavLink to="/" />}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<NavLink to="/products" />}
                >
                  <Package2 className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<NavLink to="/about" />}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </Button>
              </SheetClose>
            </ul>
            <SheetFooter>
              <SheetClose
                nativeButton={false}
                render={<div />}
                className="flex w-full flex-col gap-4 p-4"
              >
                {email ? (
                  <>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="destructive"
                      className="w-full"
                      nativeButton={false}
                      render={<NavLink to="/register" />}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      nativeButton={false}
                      render={<NavLink to="/login" />}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </>
                )}
                {role === "ADMIN" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setAdminOpen(true)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <AdminDashboardModal open={adminOpen} onOpenChange={setAdminOpen} />
    </div>
  )
}

export default Mobile
