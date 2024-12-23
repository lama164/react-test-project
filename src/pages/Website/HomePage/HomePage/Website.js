import { Outlet } from "react-router";
import NavBar from "../../../../components/Website/NavBar/NavBar";

export default function Website() {
    return(
        <>
        <NavBar />
        <Outlet />
        </>
    )
}