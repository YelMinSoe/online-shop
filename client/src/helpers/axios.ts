import axios, { isAxiosError } from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.withCredentials = true

export { isAxiosError }

export default axios
