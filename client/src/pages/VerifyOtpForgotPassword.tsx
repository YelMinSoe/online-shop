import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { isAxiosError } from "@/helpers/axios"

import { useNavigate } from "react-router"
import { toast } from "react-toastify"

const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
})

type verifyOtpFormData = z.infer<typeof verifyOtpSchema>

const VerifyOtpForgotPassword = () => {
  const navigate = useNavigate()
  const email = sessionStorage.getItem("registeredEmail")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<verifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  })

  const onSubmit = async (data: verifyOtpFormData) => {
    try {
      const response = await axios.post(
        "/api/auth/verify-otp-forget-password",
        {
          email,
          otp: data.otp,
        }
      )
      toast.success(response.data.message)
      sessionStorage.setItem("verifyToken", response.data.verifyToken)
      reset()
      navigate("/forgot-password/reset-password")
    } catch (error) {
      if (isAxiosError(error)) {
        setError("otp", {
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
        <div className="flex flex-col gap-2">
          <label
            htmlFor="otp"
            className="text-sm font-medium md:text-base lg:text-lg"
          >
            OTP
          </label>
          <input
            {...register("otp")}
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="Required"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:py-3 md:text-base lg:px-4 lg:py-4 lg:text-lg"
          />
          {errors.otp && (
            <p className="text-sm font-bold text-red-500">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full md:h-11 md:text-base lg:h-14 lg:text-lg"
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default VerifyOtpForgotPassword
