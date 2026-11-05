import { createBrowserRouter } from "react-router"
// Local imports
import RootLayout from "@/RootLayout"
import Home from "@/pages/Home"
import Products from "@/pages/Products"
import About from "@/pages/About"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "about", Component: About },
    ],
  },
])
