import React, { useState } from 'react'; // Importez useState de React
import "./App.css";
import Header from 	"./Header"
import Sidebar from "./Sidebar";
import Home from "./Home";

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    return (
        <div className={"main_container"}>
            <nav className={"navbar"}>
                <h1>fakebookabc</h1>
                <button className={"white_btn"} onClick={handleLogout}> logout</button>
            </nav>

            <div className="grid-container">
                <Header OpenSidebar={OpenSidebar}/>
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
                <Home />
            </div>
        </div>
    );
};

export default Main;
