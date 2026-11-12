import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import { toast } from "react-toastify"

// Types

type Role = "ADMIN" | "CUSTOMER"

type State = {
  email: string | null
  role: Role | null
}

type Action =
  { type: "LOGIN"; payload: { email: string; role: Role } } | { type: "LOGOUT" }

type ContextType = State & { dispatch: Dispatch<Action> }

export const AuthContext = createContext<ContextType | null>(null)

const AuthReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("email", JSON.stringify(action.payload))
      return { email: action.payload.email, role: action.payload.role }
    case "LOGOUT":
      localStorage.removeItem("email")
      return { email: null, role: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    email: null,
    role: null,
  })
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("email")
      if (storedEmail) {
        const { email, role } = JSON.parse(storedEmail) as {
          email: string
          role: Role
        }
        dispatch({ type: "LOGIN", payload: { email, role } })
      } else {
        dispatch({ type: "LOGOUT" })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error))
      dispatch({ type: "LOGOUT" })
    }
  }, [])
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
