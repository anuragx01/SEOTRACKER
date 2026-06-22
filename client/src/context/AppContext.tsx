
import axios from "axios";
import { createContext, useEffect, useState, useContext, type ReactNode } from "react";

interface User {
    id : string;
    name: string;
    email: string;
    plan: string;
    analysisCount?: number;
}

interface AppContextType {
    user: User | null ;
    token: string | null ;
    loading: boolean;
    api: ReturnType<typeof axios.create>;
    login: (email: string , password: string) => Promise<{success: boolean;
         message?: string}>;
    register: (name: string ,email: string , password: string) => Promise<
    {success: boolean; message?: string}>;
    logout: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({children}: {children:ReactNode}) {

    const [user,setUser] = useState<User | null>(null);
    const storedToken = localStorage.getItem("token");
    const [token, setToken] = useState<string | null>(storedToken);
    const [loading, setLoading] = useState(Boolean(storedToken));

    useEffect(() => {
        if (!token) return;

        api.get('/api/auth/user')
            .then(({ data }) => {
                if (data.success) setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [token]);


    const login = async(email: string , password: string) => {
           try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/login`,{email,password})
            if(res.data.success) {
                setToken(res.data.token)
                setUser(res.data.user)
                localStorage.setItem("token", res.data.token)
                return {success: true}
            }
            return {success : false , message: res.data.message}
           } catch(error: unknown) {
             const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;
             return {success: false, message: message || "Login failed"}
           }
    }

    
    const register = async(name: string , email: string , password: string) => {
       try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/register`,{name,email,password})
            if(res.data.success) {
                setToken(res.data.token)
                setUser(res.data.user)
                localStorage.setItem("token", res.data.token)
                return {success: true}
            }
            return {success : false , message: res.data.message}
           } catch(error: unknown) {
             const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;
             return {success: false, message: message || "Registration failed"}
           }
    }

    
    const logout = () => {
          setToken(null)
          setUser(null)
          localStorage.removeItem("token")
    }

    const value = {user ,token , loading , api , login , register , logout }

    return<AppContext.Provider value = {value}>
        {children}
    </AppContext.Provider>
}

// The context hook intentionally lives with its provider as their shared public API.
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
    const context = useContext(AppContext) 
    if(!context) throw new Error("useApp must be used within AppProvider");
    return context;
}
