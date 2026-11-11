// Packages import
import { Outlet } from "react-router"
import Header from "./components/Header"
import { ToastContainer } from "react-toastify"
const RootLayout = () => {
  return (
    <>
      <div className="">
        <Header />
        <Outlet />
        <ToastContainer position="top-center" autoClose={5000} />
      </div>
    </>
  )
}

export default RootLayout
