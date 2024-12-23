import { useEffect, useState } from "react";
import { Axios } from "../../Api/axios";
import { Pro, PRO } from "../../Api/Api";
import TableShow from "../../components/Dashboard/Table";
import { Link } from "react-router-dom";

export default function Products() {
        
    const [products, setproducts] = useState([]);
    //pagination
    const [page, setPage] = useState(1); 
    const [limit,setLimit] = useState(3);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    //Get all categories
    useEffect(() => {
        setLoading(true);
        Axios.get(`/${PRO}?page=${page}&limit=${limit}`)
        .then((data) => {
            setproducts(data.data.data)
            setTotal(data.data.total)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    },[page, limit]);
    
    const header = [
        {
            key: "images",
            name: "images",
        },
        {
            key: "title",
            name: "Title"
        },
        {
            key: "description",
            name: "Description"
        },
        {
            key: "price",
            name: "Price"
        },
        {
            key: "rating",
            name: "Rating"
        },
        {
            key: "created_at",
            name: "Created",
        },
        {
            key: "updated_at",
            name: "Updated",
        },
        
    ];

    //handle delete
    async function handleDelete(id){
        try{
            const res = await Axios.delete(`${Pro}/${id}`);
            setproducts((prev) => prev.filter((item) => item.id !== id ))
            console.log(res)
        } catch(err){
            console.log(err)
        }
    }
    
        return(
            <div className="bg-white px-4 py-3 w-100 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <h1>Products Page</h1>
                    <Link className="btn btn-primary" to="/dashboard/category/add">Add Product</Link>
                </div>
                
            <TableShow searchLink={Pro} search="title" total={total} loading={loading} setLimit={setLimit} setPage={setPage} page={page} limit={limit} header={header} data={products} delete={handleDelete} />
            </div>
        ) 
    }
    
