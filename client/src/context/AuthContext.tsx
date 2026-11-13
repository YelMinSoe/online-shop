import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import axios from "@/helpers/axios"

// Types
type Role = "ADMIN" | "CUSTOMER"

type State = {
  email: string | null
  role: Role | null
  loading: boolean
}

type Action =
  { type: "LOGIN"; payload: { email: string; role: Role } } | { type: "LOGOUT" }

type ContextType = State & { dispatch: Dispatch<Action> }

export const AuthContext = createContext<ContextType | null>(null)

const AuthReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload, loading: false }
    case "LOGOUT":
      return { email: null, role: null, loading: false }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    email: null,
    role: null,
    loading: true,
  })

  useEffect(() => {
    const me = async () => {
      try {
        const response = await axios.get("/api/auth/me")
        dispatch({ type: "LOGIN", payload: response.data.user })
      } catch {
        dispatch({ type: "LOGOUT" })
      }
    }
    me()
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
