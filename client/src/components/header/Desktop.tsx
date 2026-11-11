import { Button } from "@/components/ui/button"
import { NavLink } from "react-router"
import { ModeToggle } from "../mode-toggle"
import {
  LayoutDashboard,
  LogIn,
  ShoppingCartMinus,
  UserPlus,
} from "lucide-react"

const Desktop = () => {
  return (
    <div className="hidden h-full items-center justify-between px-10 xl:flex">
      <NavLink to="/">
        <h1 className="ml-4 text-2xl font-bold">Team Hex Shop</h1>
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
        <p className="text-lg font-medium">user@example.com</p>

        <Button
          variant="destructive"
          nativeButton={false}
          render={<NavLink to="/register" />}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </Button>

        <Button
          variant="destructive"
          nativeButton={false}
          render={<NavLink to="/login" />}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>

        <Button
          variant="destructive"
          nativeButton={false}
          render={<NavLink to="/admin-dashboard" />}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Button>
        <Button variant="outline" className="relative">
          <ShoppingCartMinus className="h-5 w-5" />

          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
            19
          </span>
        </Button>
        <ModeToggle />
      </ul>
    </div>
  )
}

export default Desktop
