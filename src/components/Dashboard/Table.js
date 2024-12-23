import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import PaginatedItems from "./Pagination/Pagination";
import { useEffect, useState } from "react";
import { Axios } from "../../Api/axios";
import TransformDate from "../../helpers/TransformDate";


export default function TableShow(props){
    //اذا ماكان موجود بكل الصفحات
    const currentUser = props.currentUser || {
        email: "",
    }

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [date, setDate] = useState("");

    const filteredDataByDate = props.data.filter((item) => TransformDate(item.created_at) === date)

    const filterSearchByDate = filteredData.filter(item => TransformDate(item.created_at) === date)

    const showWhichData = 
        date.length !== 0 
        ? search.length > 0 
            ? filterSearchByDate 
            : filteredDataByDate
        : search.length > 0
        ? filteredData
        :props.data;
    
    // //pagination from front
    // const start =( props.page - 1)* props.limit;
    // const end = Number(start) + Number(props.limit);
    // const final = props.data.slice(start, end)
    
    // //search from front
    // const filterData = props.data.filter((item) => item[props.search].toLowerCase().includes(search.toLowerCase()));
    // function handleSearch(e){
    //     setSearch(e.target.value);
    // }

    
    async function getSearchedData(){
        try{
            const res = await Axios.post(`${props.searchLink}/search?title=${search}`);
            console.log(res)
            setFilteredData(res.data)
        } catch(err){
            console.log(err)
        } finally {
            setSearchLoading(false);
        }
    }

    useEffect(()=> {
        const debounce = setTimeout(() => {
            search.length > 0 ? getSearchedData() : setSearchLoading(false);
        }, 500);

        return () => clearTimeout(debounce);
    }, [search])

    //header show
    const headerShow = props.header.map((item) => <th>{item.name}</th>)

    //body show
    const dataShow = showWhichData.map((item, key) => (
    <tr key={key}>
        <td>{item.id - 1}</td>
        
        {props.header.map((item2, key2) =>
        ( <td key={key2}>
            { item2.key === "image" ? (
                <img width={"50px"} src={item[item2.key]} alt=""/> 
            ): item2.key === "images" ? (
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                {item[item2.key].map((img) => (
                    <img width={"50px"} src={img.image} alt="" /> 
                ))}
                </div>
            ) : item2.key === "created_at" || item2.key === "updated_at" ? (
                TransformDate(item[item2.key])
            )
        : item[item2.key] === "1995" 
        ? "admin" 
        : item[item2.key] === "2001" 
        ? "User" 
        : item[item2.key] === "1996" 
        ? "Writer"
        : item[item2.key] === "1999"
        ? "Product Manager"
        : item[item2.key]}
        
        {currentUser && item[item2.key] === currentUser.name && "(you)"}
        </td>
        )
    )}

        <td>
            <div className="d-flex align-items-center gap-2">
                <Link to={`${item.id}`}>
                    <FontAwesomeIcon fontSize={"19px"} icon={faPenToSquare} />
                </Link>
                {currentUser.email !== item.email && 
                    <FontAwesomeIcon 
                    onClick={() => props.delete(item.id)}
                    fontSize={"19px"} 
                    cursor={"pointer" } 
                    color="red"
                    icon={faTrash}
                    />
                }
            </div>
        </td>
        
    </tr>)
    )

    //return data
    return(
        <>
        <div className="col-3">
            <Form.Control 
                type="search"
                aria-label="input example"
                className="my-2"
                placeholder="search"
                onChange={(e) => {
                    setSearch(e.target.value)
                    setSearchLoading(true)
                    }
                }
            />
            </div>
            <div className="col-5">
                <Form.Control 
                    type="date"
                    aria-label="input example"
                    className="my-2"
                    placeholder="search"
                    onChange={(e) => {
                        setDate(e.target.value)
                        // setSearchLoading(true)
                        }
                    }
                />
            </div>
            <Table className="table-shadow rounded overflow-hidden text-white " striped bordered hover>
                <thead className="px-2">
                    <tr>
                        <th className="f-cairo">Id</th>
                        {headerShow}
                        <th className="f-cairo">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.loading ? (
                    <tr className="text-center">
                        <td colSpan={12} > Loading...</td>
                    </tr>
                    ) : searchLoading ? (
                        <tr className="text-center">
                        <td colSpan={12} > Searching...</td>
                    </tr>
                    ) : (
                        dataShow
                    )}
                </tbody>
            </Table>
            <div className="d-flex align-items-center justify-content-end flex-wrap"> 
                <div className="col-1">
                    <Form.Select onChange={(e) => {props.setLimit(e.target.value)}} aria-label="Default select example">
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </Form.Select>
                </div>
                <PaginatedItems total={props.total} setPage={props.setPage} itemsPerPage={props.limit}  data={props.data}/>
            </div>
        </>
    );
}