import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import homeImage from "../assets/home-page.png"

const Home = () => {
  return (
    <>
      <div className="ml-4 flex h-[calc(100vh-68px)] items-center gap-4 md:ml-4 lg:ml-14">
        <div className="flex flex-col items-center *:gap-4 lg:flex-row lg:justify-between">
          <img
            src={homeImage}
            alt="Home"
            className="mb-8 h-full w-full animate-fade-in-right object-contain lg:order-last lg:mr-4 lg:mb-28 lg:h-150 lg:w-150"
          />
          <div className="">
            <h1 className="mt-4 text-xl font-bold lg:text-3xl">
              Welcome to Team Hex Shop
            </h1>
            <p className="mt-2 text-sm text-muted-foreground lg:text-xl">
              Discover quality products at prices you'll love. Fast delivery and
              easy returns on every order.
            </p>
            <Button
              nativeButton={false}
              variant="default"
              className="mt-4 cursor-pointer"
              render={<Link to="/products" />}
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
