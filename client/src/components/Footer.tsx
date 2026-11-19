import { Link } from "react-router"
import { Store } from "lucide-react"

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/cart", label: "Cart" },
]

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
      <div className="flex flex-col items-center gap-1 sm:items-start">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <div className="flex items-center justify-center">
            <Store className="size-8" />
            <h1 className="ml-2 text-2xl font-bold">Team Hex Shop</h1>
          </div>
        </Link>
        <p className="text-sm text-muted-foreground">
          Quality products, delivered across Japan.
        </p>
      </div>

      <nav
        aria-label="Footer"
        className="flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>

    <div className="border-t py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Team Hex Shop. All rights reserved.
    </div>
  </footer>
)

export default Footer
