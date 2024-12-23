import { createContext, useEffect } from "react";
import { useState } from "react";
//قياس الشاشة
export const windowsize = createContext(null);

export default function WindowContext({children}){
    const [windowSize, setWindowSize]= useState(window.innerWidth);

    useEffect(() => {
        function setWindowWidth(){
            setWindowSize(window.innerWidth);
        }
        window.addEventListener("resize",setWindowWidth);

        //cleanUp function
        return() => {
            window.removeEventListener("resize", setWindowWidth);
        };
    },[]);
    
    return(
        <windowsize.Provider value={{windowSize, setWindowSize}}>
            {children}
        </windowsize.Provider>
    )
}