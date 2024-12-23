import { Outlet } from "react-router";
import "./dashboard.css";
import TopBar from "../../components/Dashboard/TopBar";
import SideBar from "../../components/Dashboard/SideBar";

export default function Dashboard(){
    return(
        <div className="position-relative">  
            <TopBar />
            <div className=" dashboard d-flex gap-1" style={{marginTop:"70px"}}>
                <SideBar />
                <Outlet />
            </div>
            
        </div>
    )
}