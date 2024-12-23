import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { USER } from "../../../Api/Api";
import Loading from "../../../components/Loading/Loading"
import { Axios } from "../../../Api/axios";
import Err403 from "../Errors/403";

//حماية المسارات
export default function RequireAuth({ allowedRole }){
    //user
    const [user, setUser] = useState("");
    console.log(user)
    const Navigate = useNavigate();

    useEffect(() => {
        Axios.get(`/${USER}`)
        .then((data) => setUser(data.data))
        .catch(() => Navigate("/login", {replace: true}))
    },[])
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    
    return token ? (
            user === "" ? (
                <Loading /> 
            ) : allowedRole.includes(user.role) ? (
                <Outlet />
            ) : (
                <Err403 role={user.role}/>
            ) 
            ) : (
                <Navigate to={"/login"} replace={true} />
            )
}