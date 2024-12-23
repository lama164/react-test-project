import { useEffect, useState } from "react";
import { Axios } from "../../../Api/axios";
import { Cat, CAT } from "../../../Api/Api";
import TableShow from "../../../components/Dashboard/Table";
import { Link } from "react-router-dom";

export default function Categories() {
        
    const [categories, setCategories] = useState([]);
    //pagination
    const [page, setPage] = useState(1); 
    const [limit,setLimit] = useState(3);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    //Get all categories
    useEffect(() => {
        setLoading(true);
        Axios.get(`/${CAT}?limit=${limit}&page=${page}`)
        .then((data) => { 
            setCategories(data.data.data)
            setTotal(data.data.total)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    },[limit, page]);
    
    const header = [
        {
            key: "title",
            name: "Title",
        },
        {
            key: "image",
            name: "Image",
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
            const res = await Axios.delete(`${Cat}/${id}`);
            setCategories((prev) => prev.filter((item) => item.id !== id ))
            console.log(res)
        } catch(err){
            console.log(err)
        }
    }
    
        return(
            <div className=" bg-white px-4 py-3 w-100 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <h1>Categories Page</h1>
                    <Link className="btn btn-primary" to="/dashboard/category/add">Add Category</Link>
                </div>
                
            <TableShow searchLink={Cat} search="title" total={total} loading={loading} setLimit={setLimit} setPage={setPage} page={page}  limit={limit} header={header} data={categories} delete={handleDelete} />
            {/* <PaginatedItems setPage={setPage} itemsPerPage={5}  data={categories}/> */}
            </div>
        ) 
    }
    
