import { useEffect, useRef, useState } from "react";
import { Button, Form, NavLink } from "react-bootstrap";
import { Axios } from "../../../Api/axios";
import { CAT, Cat, Pro } from "../../../Api/Api";
import Loading from "../../../components/Loading/Loading"
import { useNavigate, useParams } from "react-router";

export default function UpdateProduct(){
    const [form, setForm] = useState({
        category: "Select Category",
        title: "",
        description: "",
        price: "",
        discount: "",
        About: "",
        stock: 0,
    })
    const [images, setImages] = useState([]);
    const [imagesFromServer, setImagesFromServer] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idsFromServer, setIdsFromServer] = useState([]); 
    const { id } = useParams()
    const nav = useNavigate()
    //handleEdit
    async function HandleEdit(e){
        setLoading(true);
        e.preventDefault();
        try{
            for(let i=0; i<idsFromServer.length ; i++){
                await Axios.delete(`product-img/${idsFromServer[i]}`).then((data) => 
                    console.log(data));
            
            }
            await Axios.post(`${Pro}/edit/${id}`,form);
            nav('/dashboard/products')
        } catch(err){
            setLoading(false)
            console.log(err)
        }
        
    }

    //useRef
    const focus = useRef("");
    const openImage = useRef(null)
    const progress = useRef([]);
    const ids = useRef([]);

    //handle focus
    useEffect(() => {
        focus.current.focus();
    },[]);

    //openimage
    function handleOpenImage() {
        openImage.current.click();
    }

     //Get all categories
    useEffect(() => {
        Axios.get(`/${Pro}/${id}`)
        .then((data) =>{
            setForm(data.data[0])
            setImagesFromServer(data.data[0].images)
            console.log(data)
        })


        .catch((err) => console.log(err));
    },[]);

    //handlechange
    function handleChange(e) {
        setForm({...form , [e.target.name]: e.target.value});
    }


    //لما برجع برفع صور جديدة مابينعملن progress
    const j = useRef(-1);

    //handle image change
    async function HandleImagesChange(e){
        //عرض الصور بعد اختبارن
        setImages((prev) => [...prev, ...e.target.files])
        //إرسال الصور للباك
        const imagesAsFiles = e.target.files;
        const data = new FormData();
        for (let i = 0; i < imagesAsFiles.length; i++) {
            j.current++;
            data.append("image", imagesAsFiles[i]);
            data.append("product_id", id);
            try{
                const res = await Axios.post("/product-img/add", data,{
                    onUploadProgress: (ProgressEvent) => {
                        const {loaded, total} = ProgressEvent;
                        const percent = Math.floor((loaded * 100) / total);
                        if(percent % 10 === 0){
                            progress.current[j.current].style.width = `${percent}%`;
                            progress.current[j.current].setAttribute("percent", `${percent}%` )
                        }
                    }
                });
                ids.current[j.current] = res.data.id;
            }catch(err){
                console.log(err)
            }
        }
    }

    //handle delete image
    async function handleImageDelete(id, img){
        const findId = ids.current[id];
        try {
            await Axios.delete(`product-img/${findId}`);
            setImages((prev) => prev.filter((image) => image !== img));
            ids.current = ids.current.filter((i) => i !==findId);
            --j.current;
        } catch(err) {
            console.log(err)
        }
    }

    async function handleImageDeleteFromServer(id){
        setImagesFromServer((prev) => prev.filter((img) => img.id !== id));
        setIdsFromServer(prev => {return [...prev,id ]})
        
    }
    //Mapping
    const categoriesShow = categories.map((item,key) => (
        <option key={key} value={item.id}>
            {item.title}
        </option>
    ))
    const imagesFromServerShow = imagesFromServer.map((img,key) => (
        <div key={key} className="border p-2 col-2 position-relative">
            <div className="d-flex align-items-center justify-content-start gap-2">
                <img alt="" src={img.image} className="w-100"></img>
            </div>
            <div 
                style={{cursor: "pointer"}}
                className="position-absolute top-0 end-0 bg-danger rounded text-white">
                <p className="py-1 px-2 m-0" onClick={() => handleImageDeleteFromServer(img.id)}>
                    X
                </p>
            </div>
            
        </div>
        
    ))
    const imagesShow = images.map((img,key) => (
        <div className="border p-2 w-100">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-start gap-2 ">
                    <img alt="" src={URL.createObjectURL(img)} width="80px"></img>
                    <div>
                        <p className="mb-1">{img.name}</p>
                        <p>
                            {(img.size / 1024) < 900 
                            ? (img.size / 1024).toFixed(2) + "KB"
                            : (img.size / (1024 * 1024)).toFixed(2) + "MB"} 
                        </p>
                    </div>
                </div>
            <Button variant="danger" onClick={() => handleImageDelete(key, img)}>Delete</Button>
            </div>
            <div>
                <div className="custom-progress mt-3">
                    <span 
                        ref={(e) => (progress.current[key] = e)}
                        className="inner-progress"
                    >
                    </span>
                </div>
            </div>
        </div>
        
    ))

    return (
        <>
        {loading && <Loading />}
        <Form className="bg-white w-100 mx-2 p-3" onSubmit={HandleEdit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Category</Form.Label>
                <Form.Select ref={focus} placeholder="Category.." name="category" value={form.category} onChange={handleChange}>
                    <option disabled>Select Category</option>
                    {categoriesShow}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control  type="text" placeholder="Title.." name="title" value={form.title} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Description.." name="description" value={form.description} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" placeholder="Price.." name="price" value={form.price} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="discount">
                <Form.Label>Discount</Form.Label>
                <Form.Control type="text" placeholder="Discount.." name="discount" value={form.discount} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="about">
                <Form.Label>About</Form.Label>
                <Form.Control type="text" placeholder="About.." name="About" value={form.About} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="stock">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" placeholder="Stock.." name="stock" value={form.stock} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="images">
                <Form.Label>Images</Form.Label>
                <Form.Control ref={openImage} hidden multiple type="file" onChange={HandleImagesChange}/>
            </Form.Group>

            <div 
                onClick={handleOpenImage}
                className="d-flex align-items-center justify-content-center gap-2 py-3 rounded mb-2 w-100 flex-column"
                style={{border: "2px dashed #0086fe" , cursor: "pointer"}}
            >
                <img src={require("../../../Assets/images/Upload-PNG-HD-Image.png")}
                alt="Upload Here"
                width={"100px"}
                style={{ filter: "grayscale(1)"}}
                />
                <p className="fw-bold mb-0" style={{color: "#0086fe"}}>
                    Upload Images
                </p>
            </div>

            <div className="d-flex align-items-start flex-wrap gap-2" > 
                {imagesFromServerShow}
            </div>
            <div className="d-flex align-items-start flex-column gap-2" > 
                {imagesShow}
            </div>
        
            <button disabled={form.title.length > 1 ? false : true} className="btn btn-primary">Save</button>
        </Form>
        </>
    );
}