import Desktop from "./header/Desktop"
import Mobile from "./header/Mobile"

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 h-17 w-full border bg-background shadow-md dark:border-b-zinc-700">
      <Desktop />
      <Mobile />
    </nav>
  )
}

export default Header
