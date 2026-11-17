// import { createContext, useEffect, useState, type ReactNode } from "react"
// import { toast } from "react-toastify"

// export type CartItem = {
//   id: number
//   name: string
//   price: number
//   image?: string
//   stock: number
//   quantity: number
// }

// export type CartContextType = {
//   items: CartItem[]
//   totalQuantity: number
//   totalPrice: number
//   addToCart: (item: Omit<CartItem, "quantity">) => void
//   increase: (id: number) => void
//   decrease: (id: number) => void
//   remove: (id: number) => void
//   clear: () => void
// }

// export const CartContext = createContext<CartContextType | null>(null)

// const KEY = "cart"

// const readCart = (): CartItem[] => {
//   try {
//     const raw = localStorage.getItem(KEY)
//     return raw ? JSON.parse(raw) : []
//   } catch {
//     return []
//   }
// }

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>(readCart)

//   // Prevent cart data from page's refresh
//   useEffect(() => {
//     try {
//       localStorage.setItem(KEY, JSON.stringify(items))
//     } catch {
//       return
//     }
//   }, [items])

//   const addToCart = (item: Omit<CartItem, "quantity">) => {
//     const existing = items.find((i) => i.id === item.id)

//     if (existing && existing.quantity >= item.stock) {
//       toast.error("No more stock available")
//       return
//     }

//     if (existing) {
//       setItems(
//         items.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//         )
//       )
//     } else {
//       setItems([...items, { ...item, quantity: 1 }])
//     }
//     toast.success("Added to cart")
//   }

//   const increase = (id: number) =>
//     setItems(
//       items.map((i) =>
//         i.id === id && i.quantity < i.stock
//           ? { ...i, quantity: i.quantity + 1 }
//           : i
//       )
//     )

//   const decrease = (id: number) =>
//     setItems(
//       items
//         .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
//         .filter((i) => i.quantity > 0)
//     )

//   const remove = (id: number) => setItems(items.filter((i) => i.id !== id))
//   const clear = () => {
//     localStorage.removeItem(KEY)
//     setItems([])
//   }

//   const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
//   const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         totalQuantity,
//         totalPrice,
//         addToCart,
//         increase,
//         decrease,
//         remove,
//         clear,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

import { createContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"

export type CartItem = {
  id: number
  name: string
  price: number
  image?: string
  stock: number
  quantity: number
}

export type CartContextType = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addToCart: (item: Omit<CartItem, "quantity">) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { email } = useAuth()

  const KEY = email ? `cart:${email.toLowerCase()}` : null

  const [items, setItems] = useState<CartItem[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)

  // Load cart when user changes
  useEffect(() => {
    if (!KEY) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([])
      setLoadedKey(null)
      return
    }

    try {
      const raw = localStorage.getItem(KEY)
      setItems(raw ? JSON.parse(raw) : [])
    } catch {
      setItems([])
    }

    setLoadedKey(KEY)
  }, [KEY])

  // Prevent cart data from page's refresh
  useEffect(() => {
    if (!KEY || loadedKey !== KEY) return

    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      return
    }
  }, [items, KEY, loadedKey])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    const existing = items.find((i) => i.id === item.id)

    if (existing && existing.quantity >= item.stock) {
      toast.error("No more stock available")
      return
    }

    if (existing) {
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setItems([...items, { ...item, quantity: 1 }])
    }
    toast.success("Added to cart")
  }

  const increase = (id: number) =>
    setItems(
      items.map((i) =>
        i.id === id && i.quantity < i.stock
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    )

  const decrease = (id: number) =>
    setItems(
      items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    )

  const remove = (id: number) => setItems(items.filter((i) => i.id !== id))

  const clear = () => {
    if (KEY) {
      localStorage.removeItem(KEY)
    }
    setItems([])
  }

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        addToCart,
        increase,
        decrease,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
