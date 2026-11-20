import { Button } from "@/components/ui/button"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import axios from "@/helpers/axios"

import { toast } from "react-toastify"

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await axios.post("/api/auth/forget-password", data)
      toast.success(response.data.message)
      reset()
      sessionStorage.setItem("registeredEmail", data.email)
      navigate("/forgot-password/verify-otp")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Something went wrong"
        setError("email", { message })
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
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium md:text-base lg:text-lg"
          >
            Enter your registered email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Required"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:py-3 md:text-base lg:px-4 lg:py-4 lg:text-lg"
          />
          {errors.email && (
            <p className="text-sm font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full cursor-pointer md:h-11 md:text-base lg:h-14 lg:text-lg"
        >
          Request OTP
        </Button>
      </form>
    </div>
  )
}

export default ForgotPassword
