import { Outlet } from "react-router-dom"; 
import NavbarSwitcher from "../../NavbarSwitcher";
 
export default function AdminLayout() { 
    return ( 
        <div> 
            <NavbarSwitcher />
            <main className="container mt-3"> 
                <Outlet /> 
            </main> 
        </div> 
    ); 
} 