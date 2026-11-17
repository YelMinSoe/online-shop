import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"

// Local imports
import { router } from "@/routes/router"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthContextProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
)
