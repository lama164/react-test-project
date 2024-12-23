import { Link } from "react-router-dom";
import "./404.css";

export default function Err404({role}) {
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="four_zero_four_bg">
                            <h1 className="text-center">404</h1>
                            <div className="img404">
                                <img src="https://th.bing.com/th/id/R.7da60b8c60a367108e55e942ced5daae?rik=3iATqvtljEj8bw&pid=ImgRaw&r=0"></img>
                            </div>
                        </div>
                        <div className="contant_box_404">
                            <h3 className="h2">Look like you're lost</h3>
                        
                            <Link to={"/"} className="link_404">
                                Go to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
     )
    }

