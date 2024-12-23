import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Axios } from "../../../Api/axios";
import { USER } from "../../../Api/Api";
import Loading from "../../../components/Loading/Loading"

export default function AddUser(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");

    const [password, setPassword] = useState("");

    async function HandleSubmit(e){
        setLoading(true);
        e.preventDefault();
        try{
            const res = await Axios.post(`${USER}/add`,{
                name: name,
                email:email,
                password: password,
                role: role,
        });
            window.location.pathname="/dashboard/users";
        } catch(err){
            setLoading(false)
            console.log(err)
        }
        
    }
    
    //useRef (focus)
    const focus = useRef("");
    useEffect(() => {
        focus.current.focus();
    },[]);
    
    return (
        <>
        {loading && <Loading />}
        <Form className="bg-white w-100 mx-2 p-3" onSubmit={HandleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>User Name</Form.Label>
                <Form.Control ref={focus} type="text" placeholder="Name.." value={name} onChange={(e) => setName(e.target.value)} required/>
            </Form.Group>
        
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="name@example.come" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="password ..." value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)} >
                    <option disabled value="">Select Role</option>
                    <option value="1995">Admin</option>
                    <option value="2001">User</option>
                    <option value="1996">Writer</option>
                    <option value="1999">Product Manger</option>
                </Form.Select>
            </Form.Group>
            <button disabled={name.length > 1 && email.length > 1 && password.length > 6 && role !== ""  ? false : true}  className="btn btn-primary">Save</button>
        </Form>
        </>
    );
}