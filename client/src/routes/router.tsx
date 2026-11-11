import { createBrowserRouter } from "react-router"
// Local imports
import RootLayout from "@/RootLayout"
import Home from "@/pages/Home"
import Products from "@/pages/Products"
import About from "@/pages/About"
import Register from "@/pages/Register"
import VerifyOtp from "@/pages/VerifyOtp"
import RegisterLayout from "../layouts/RegisterLayout"
import ConfirmPassword from "@/pages/ConfirmPassword"
import Login from "@/pages/Login"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "about", Component: About },
      {
        path: "register",
        Component: RegisterLayout,
        children: [
          { index: true, Component: Register },
          { path: "verify-otp", Component: VerifyOtp },
          { path: "confirm-password", Component: ConfirmPassword },
        ],
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
])
