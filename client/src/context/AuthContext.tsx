import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import { toast } from "react-toastify"

// Types

type State = {
  email: string | null
}
type Action = { type: "LOGIN"; payload: { email: string } } | { type: "LOGOUT" }

type ContextType = State & { dispatch: Dispatch<Action> }

export const AuthContext = createContext<ContextType | null>(null)

const AuthReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("email", JSON.stringify(action.payload))
      return { email: action.payload.email }
    case "LOGOUT":
      localStorage.removeItem("email")
      return { email: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    email: null,
  })
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("email")
      if (storedEmail) {
        const { email } = JSON.parse(storedEmail) as { email: string }
        dispatch({ type: "LOGIN", payload: { email } })
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
