import { NavLink } from "react-router"
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
  Menu,
  Package2,
  ShoppingCartMinus,
  UserPlus,
} from "lucide-react"

const Mobile = () => {
  return (
    <div className="flex h-full items-center justify-between gap-8 xl:hidden">
      <NavLink to="/">
        <h1 className="ml-5 text-xl font-semibold">Team Hex Shop</h1>
      </NavLink>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="relative">
          <ShoppingCartMinus className="h-5 w-5" />

          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
            19
          </span>
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
                user@example.com
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
                <Button
                  variant="destructive"
                  className="w-full"
                  nativeButton={false}
                  render={<NavLink to="/admin-dashboard" />}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Mobile
