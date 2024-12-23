import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { LOGIN, baseURL } from "../../../Api/Api";
import LoadingSubmit from "../../../components/Loading/Loading";
import  Cookie  from "cookie-universal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import { Container } from "react-bootstrap";

export default function Login(){
    //states
    const [form,setForm] = useState({
        email:"",
        password:"",
    });

    //Navigate
    const navigate = useNavigate();

    //Loading
    const [loading ,setLoading] = useState(false);

    //Err
    const [err,setErr] = useState("")

    //cookies
    const cookie = Cookie()

    //handle form change
    function handleChange(e){
        setForm({...form,[e.target.name]: e.target.value})
    }

    //handle submit
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        try{
            const res = await axios.post(`${baseURL}/${LOGIN}`,form)
            //console.log("success")
            setLoading(false);
            // console.log(res)
            const token = res.data.token;

            const role = res.data.user.role;
            console.log(role)
            const go = role === "1995" ? "users" : "writer";

            cookie.set("e-commerce",token);
            
            window.location.pathname = `/dashboard/${go}`;
        } catch(err){
            setLoading(false);
            //console.log(err)
            if (err.response.status === 401){
                setErr("wrong Email or Password");
            } else {
                setErr("Internal Server Err")
            }
        }
    }

    //useRef (focus)
    const focus = useRef("");
    useEffect(() => {
        focus.current.focus();
    },[]);
    
    return(
        <>
        {loading && <LoadingSubmit />}
        <div className="container pt-5">
            <div className="row" style={{height: "100vh"}}>
                <Form className="form" onSubmit={handleSubmit}>
                    <div className="custom-form">
                        <h1 className="mb-3">Login</h1>
                        
                            <Form.Group className="form-custom" controlId="exampleForm.ControlInput1">
                                <Form.Control ref={focus} type="email" placeholder="Enter Your Email.." name="email" value={form.email} onChange={handleChange} required id="email"/>
                                <Form.Label htmlFor="email">Email:</Form.Label>
                            </Form.Group>
                        
                            <Form.Group className="form-custom" controlId="exampleForm.ControlInput2">
                                <Form.Control type="password" placeholder="Enter Your Password.." name="password" value={form.password} onChange={handleChange} required minLength={"6"} id="password" />
                                <Form.Label htmlFor="password"> Password:</Form.Label>
                            </Form.Group>

                            <button className="btn btn-primary text-white">Login</button>

                            <div className="google-btn">
                                <a href={`http://127.0.0.1:8000/login-google`}>
                                    <div className="google-icon-wrapper">
                                        <img
                                        className="google-icon"
                                        src="https://cdn.imgbin.com/23/7/2/imgbin-google-logo-google-search-icon-google-google-logo-hEJMjnfCV4MA1gDtjaWTv5kc1.jpg"
                                        alt="sign in with google" 
                                        />
                                    </div>
                                    <p className="btn-text">
                                        <b>sign in with google</b>
                                    </p>
                                </a>
                            </div>

                            {err !== "" && <span className="error">{err}</span>}
                    </div>
                </Form>
            </div>
            
        </div>
        </>
    )
}