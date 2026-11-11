import { createContext, useReducer, type Dispatch, type ReactNode } from "react"

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
      return { email: action.payload.email }
    case "LOGOUT":
      return { email: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    email: null,
  })
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
