import { useState, type ReactNode } from "react"
import { History, Package, PackagePlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import NewOrders from "./tabs/NewOrders"
import Customers from "./tabs/Customers"
import SentOrders from "./tabs/SentOrders"
import CreateProduct from "./tabs/CreateProduct"

type Tab = "orders" | "customers" | "history" | "createNewProduct"

const TABS = [
  { key: "orders", label: "New Orders", icon: Package },
  { key: "customers", label: "Customers", icon: Users },
  { key: "history", label: "Sent Orders", icon: History },
  { key: "createNewProduct", label: "Create New Product", icon: PackagePlus },
] as const

const renderTab = (tab: Tab): ReactNode => {
  switch (tab) {
    case "orders":
      return <NewOrders />
    case "customers":
      return <Customers />
    case "history":
      return <SentOrders />
    case "createNewProduct":
      return <CreateProduct />
  }
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AdminDashboardModal = ({ open, onOpenChange }: Props) => {
  const [tab, setTab] = useState<Tab>("orders")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[88vh] w-[95vw] max-w-6xl flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-bold">
            Admin Dashboard
          </DialogTitle>
          <DialogDescription>
            Manage orders, users and shop settings
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b p-3 md:w-60 md:flex-col md:border-r md:border-b-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={tab === key ? "default" : "ghost"}
                className="cursor-pointer justify-start whitespace-nowrap"
                onClick={() => setTab(key)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </nav>

          {/* Content */}
          <main className="min-h-0 flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {TABS.find((t) => t.key === tab)?.label}
            </h2>
            {renderTab(tab)}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdminDashboardModal
