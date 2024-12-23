import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"
import { baseURL, GOOGLE_CALL_BACK } from "../../../Api/Api";
import  Cookie  from "cookie-universal";

export default function GoogleCallBack(){
    const cookie = Cookie();
    const location = useLocation();
    useEffect(() => {
        async function GoogleCall(){
            try{
                const res = await axios.get(`${baseURL}${GOOGLE_CALL_BACK}${location.search}`);
                const token = res.data.access_token;
                cookie.set("e-commerce", token);
                console.log(res)
            } catch(err){
                console.log(err)
            }
        }
        GoogleCall();
    },[location.search]);
    return(
        <h1>test</h1>
    )
}