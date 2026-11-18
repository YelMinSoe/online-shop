import { useState } from "react"
import { Navigate } from "react-router"
import { MapPin, Package } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import OrderHistory from "@/components/profile/OrderHistory"
import AddressSection from "@/components/profile/AddressSection"

type Tab = "orders" | "address"

const TABS = [
  { key: "orders", label: "My orders", icon: Package },
  { key: "address", label: "Address", icon: MapPin },
] as const

const Profile = () => {
  const { email, loading } = useAuth()
  const [tab, setTab] = useState<Tab>("orders")

  if (loading) return null
  if (!email) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6">
      {/* Header card */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white uppercase">
          {email[0]}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-lg font-semibold">{email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === key
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" ? <OrderHistory /> : <AddressSection />}
      </div>
    </div>
  )
}

export default Profile
