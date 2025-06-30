import { createContext, useState } from "react";
import { apiRequest } from "../Services/api";



const AdminContext = createContext();
export const AdminProvider = ({children})=>{
    const [dashboardStats, setDashboardStats] = useState(null);
    const [products, setProducts]= useState([]);
    const [orders, setOrders]= useState([]);
    const [users, setUsers]= useState([]);
    const [error, setError]= useState("");
    const [loading, setLoading] = useState(false);

    const fetchDashboardStats = async () =>{
        try{
            setLoading(true);
            
        }catch(error){

        }
    }
}

return <AdminContext.Provider value={{}}>
    {children}
</AdminContext.Provider>
