import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import z from "zod"
import axios, { isAxiosError } from "@/helpers/axios"

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().regex(/^\d{8}$/, "Password must be exactly 8 digits"),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post("/api/auth/login", data)
      const registeredEmail = response.data.registeredEmail
      const role = response.data.role
      if (registeredEmail && role) {
        dispatch({ type: "LOGIN", payload: { email: registeredEmail, role } })
        toast.success(response.data.message)
        navigate("/products")
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError("root", {
          message: error.response?.data?.message ?? "Something went wrong",
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }
  return (
    <div className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-4 rounded-md border p-6 shadow-md md:max-w-md md:gap-5 md:p-8 lg:max-w-lg lg:gap-6 lg:p-10"
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium md:text-base lg:text-lg"
          >
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Required"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:py-3 md:text-base lg:px-4 lg:py-4 lg:text-lg"
          />
          {errors.email && (
            <p className="text-sm font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium md:text-base lg:text-lg"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline md:text-base"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              inputMode="numeric"
              maxLength={8}
              autoComplete="current-password"
              placeholder="Required"
              className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:py-3 md:text-base lg:py-4 lg:pr-12 lg:pl-4 lg:text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm font-bold text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Server error (wrong email/password) */}
        {errors.root && (
          <p className="text-sm font-bold text-red-500">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer md:h-11 md:text-base lg:h-14 lg:text-lg"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {/* No account */}
        <p className="text-center text-sm md:text-base">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="cursor-pointer font-medium text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
