import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Axios } from "../../../Api/axios";
import { Cat } from "../../../Api/Api";
import Loading from "../../../components/Loading/Loading"
import { useNavigate, useParams } from "react-router";

export default function Category(){
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    //save ماتشتغل ليجوا البيانات من الباك
    const [disable, setDisable] = useState(true);

    const [loading, setLoading] = useState(false);

    const nav =useNavigate();
    //id
    // const id = Number(window.location.pathname.replace("/dashboard/categories/","")); ===
    //id بتكون object لهيك حطينا {}
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        Axios.get(`${Cat}/${id}`).then((data) => {
            setTitle(data.data.title);
            setLoading(false);
        })
        .then(() => setDisable(false))
        .catch(() => nav('/dashboard/categories/page/404',{replace:true}));
    },[]);

    async function HandleSubmit(e){
        setLoading(true);
        e.preventDefault();

        const form = new FormData();
        form.append("title", title);
        form.append("image", image);

        try{
            const res = await Axios.post(`${Cat}/edit/${id}`,form);
            window.location.pathname="/dashboard/categories";
        } catch(err){
            setLoading(false)
            console.log(err)
        }
        
    }
    
    return (
        <>
        {loading && <Loading />}
        <Form className="bg-white w-100 mx-2 p-3" onSubmit={HandleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Title.." value={title} onChange={(e) => setTitle(e.target.value)} required/>
            </Form.Group>
        
            <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>  
                <Form.Control type="file" onChange={(e) => setImage(e.target.files.item(0))} required/>
            </Form.Group>

            <button disabled={disable} className="btn btn-primary">Save</button>
        </Form>
        </>
    );
}