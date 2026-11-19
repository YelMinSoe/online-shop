// Packages import
import { Outlet } from "react-router"
import Header from "./components/Header"
import { ToastContainer } from "react-toastify"
import Footer from "./components/Footer"

const RootLayout = () => {
  return (
    <>
      <div className="">
        <Header />

        <main className="flex-1 pt-17">
          <Outlet />
        </main>

        <Footer />
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  )
}

export default RootLayout
