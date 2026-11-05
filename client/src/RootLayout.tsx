// Packages import
import { Outlet } from "react-router"
import Header from "./components/Header"

const RootLayout = () => {
  return (
    <>
      <div className="">
        <Header />
        <Outlet />
      </div>
    </>
  )
}

export default RootLayout
