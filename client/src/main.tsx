import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"

// Local imports
import { router } from "@/routes/router"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthContextProvider } from "./context/AuthContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
)
