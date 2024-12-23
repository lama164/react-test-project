import { useEffect, useState } from "react"
import { USER, USERS } from "../../../Api/Api" 
import { Axios } from "../../../Api/axios";
import { Link } from "react-router-dom";
import TableShow from "../../../components/Dashboard/Table";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(false);
    //pagination
    const [page, setPage] = useState(1); 
    const [limit,setLimit] = useState(3);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    //Get current user
    useEffect(() => {
        Axios.get(`${USER}`)
        .then((res) => setCurrentUser(res.data))
    },[]);

    //Get all user
    useEffect(() => {
        setLoading(true);
        Axios.get(`/${USERS}?page=${page}&limit=${limit}`)
        .then((data) => { 
            setUsers(data.data.data)
            setTotal(data.data.total)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    },[page, limit]);

    //table
    const header = [
        {
            key: "name",
            name: "Username",
        },
        {
            key: "email",
            name: "Email",
        },
        {
            key: "role",
            name: "Role",
        },
        {
            key: "created_at",
            name: "Created",
        },
        {
            key: "updated_at",
            name: "Last Login",
        },
    ];

    //handle delete
    async function handleDelete(id){
        try{
            const res = await Axios.delete(`${USER}/${id}`);
            setUsers((prev) => prev.filter((item) => item.id !== id ))
            console.log(res)
        } catch(err){
            console.log(err)
        }
    }
    
    return(
        <div className="bg-white w-100  px-4 py-3 rounded shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
                <h1>Users Page</h1>
                <Link  className="btn btn-primary" to="/dashboard/user/add">Add User</Link>
            </div>
            
        <TableShow searchLink={USER} search="name" total={total} loading={loading}  setLimit={setLimit} setPage={setPage} page={page} limit={limit} header={header} data={users} delete={handleDelete} currentUser={currentUser} />
        </div>
    ) 
}

