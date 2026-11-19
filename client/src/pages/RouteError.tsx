import { isRouteErrorResponse, useRouteError } from "react-router"
import { Home, RefreshCw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotFound from "@/pages/NotFound"

const RouteError = () => {
  const error = useRouteError()

  // if no routes show not found page
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />
  }

  const detail =
    import.meta.env.DEV && error instanceof Error ? error.message : null

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <TriangleAlert className="h-20 w-20 animate-wiggle text-orange-500 motion-reduce:animate-none" />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>

      {detail && (
        <pre className="mt-4 max-w-full overflow-x-auto rounded-lg bg-muted p-3 text-left text-xs">
          {detail}
        </pre>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="cursor-pointer"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload
        </Button>
        <Button nativeButton={false} render={<a href="/" />}>
          <Home className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </div>
    </div>
  )
}

export default RouteError
