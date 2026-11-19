import { Link, useNavigate } from "react-router"
import { ArrowLeft, Home, PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  title?: string
  message?: string
}

const NotFound = ({
  title = "Page not found",
  message = "The page you are looking for doesn't exist or has been moved.",
}: Props) => {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      {/* 4 [icon] 4 */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-2 text-8xl font-black text-purple-600 select-none sm:text-9xl"
      >
        <span className="animate-fade-up motion-reduce:animate-none">4</span>
        <PackageX className="animate-float h-20 w-20 text-purple-500 motion-reduce:animate-none sm:h-28 sm:w-28" />
        <span
          className="animate-fade-up motion-reduce:animate-none"
          style={{ animationDelay: "0.15s" }}
        >
          4
        </span>
      </div>

      <h1
        className="animate-fade-up mt-6 text-2xl font-bold motion-reduce:animate-none sm:text-3xl"
        style={{ animationDelay: "0.3s" }}
      >
        {title}
      </h1>
      <p
        className="animate-fade-up mt-2 text-muted-foreground motion-reduce:animate-none"
        style={{ animationDelay: "0.45s" }}
      >
        {message}
      </p>

      <div
        className="animate-fade-up mt-8 flex flex-col gap-3 motion-reduce:animate-none sm:flex-row"
        style={{ animationDelay: "0.6s" }}
      >
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
        <Button nativeButton={false} render={<Link to="/" />}>
          <Home className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
