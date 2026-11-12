import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import axios, { isAxiosError } from "@/helpers/axios"

import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const resetPasswordSchema = z.object({
  resetPassword: z
    .string()
    .regex(/^\d{8}$/, "Password must be exactly 8 digits"),
})

type resetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { dispatch } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const onSubmit = async (data: resetPasswordFormData) => {
    const email = sessionStorage.getItem("registeredEmail")
    const verifyToken = sessionStorage.getItem("verifyToken")
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password: data.resetPassword,
        verifyToken,
      })
      const registeredEmail = response.data.registeredEmail
      const role = response.data.role
      if (registeredEmail && role) {
        dispatch({ type: "LOGIN", payload: { email: registeredEmail, role } })
        toast.success(response.data.message)
        reset()
        navigate("/products")
      }
      sessionStorage.removeItem("registeredEmail")
      sessionStorage.removeItem("verifyToken")
    } catch (error) {
      if (isAxiosError(error)) {
        setError("resetPassword", {
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
        <label
          htmlFor="password"
          className="text-sm font-bold md:text-base lg:text-lg"
        >
          Password
        </label>
        <div className="relative">
          <input
            {...register("resetPassword")}
            id="password"
            type={showPassword ? "text" : "password"}
            inputMode="numeric"
            maxLength={8}
            autoComplete="new-password"
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
        {errors.resetPassword && (
          <p className="text-sm font-bold text-red-500">
            {errors.resetPassword.message}
          </p>
        )}
        <Button
          type="submit"
          variant="default"
          className="w-full cursor-pointer md:h-11 md:text-base lg:h-14 lg:text-lg"
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
