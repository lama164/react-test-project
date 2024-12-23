import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { REGISTER, baseURL } from "../../../Api/Api";
import LoadingSubmit from "../../../components/Loading/Loading";
import  Cookie  from "cookie-universal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";

export default function Register(){
    //states
    const [form,setForm] = useState({
        name:"",
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
        //loading يشتغل وقت ارسل بيانات
        setLoading(true);
        try{
            const res =await axios.post(`${baseURL}/${REGISTER}`,form)
            //loading يوقف بعد مايأرسل البيانات
            setLoading(false);
            // console.log("success")
            const token = res.data.token;
            cookie.set("e-commerce",token);
            // window.location.pathname= "/users";
            navigate('/dashboard/users' , {replace:true});
        } catch(err){
            console.log(err)
            setLoading(false);
            if(err.response.status === 422){
                setErr("Email is already been taken");
            } else {
                setErr("Enternal server err")
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
                <form className="form" onSubmit={handleSubmit}>
                    <div className="custom-form">
                        <h1 className="mb-3" >Register Now</h1>
                            <Form.Group className="form-custom">
                                <Form.Control ref={focus} type="text" placeholder="Enter Your Name.." name="name" value={form.name} onChange={handleChange} required />
                                <Form.Label className="llb" htmlFor="name">Name:</Form.Label>
                            </Form.Group>

                            <Form.Group className="form-custom" >
                                <Form.Control type="email" placeholder="Enter Your Email.." name="email" value={form.email} onChange={handleChange} required />
                                <Form.Label htmlFor="email">Email:</Form.Label>
                            </Form.Group>
                        
                            <Form.Group className="form-custom" controlId="exampleForm.ControlInput2">
                                <Form.Control type="password" placeholder="Enter Your Password.." name="password" value={form.password} onChange={handleChange} required minLength={"6"}  />
                                <Form.Label htmlFor="password"> Password:</Form.Label>
                            </Form.Group>
                        <button className="btn btn-primary text-white">Register</button>

                        <div className="google-btn">
                                <a href="http://127.0.0.1:8000/login-google">
                                    <div className="google-icon-wrapper">
                                        <img
                                        className="google-icon"
                                        src="https://cdn.imgbin.com/23/7/2/imgbin-google-logo-google-search-icon-google-google-logo-hEJMjnfCV4MA1gDtjaWTv5kc1.jpg"
                                        alt="sign in with google" 
                                        />
                                    </div>
                                    <p className="btn-text">
                                        <b>Register with google</b>
                                    </p>
                                </a>
                            </div>

                        {err !== "" && <span className="error">{err}</span>}
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}