import {React ,useState} from 'react'; // Importez useState de React
import "./App.css";
import Header from 	"./Header"
import Sidebar from "./Sidebar";
import Home from './Home';





const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

 

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle);
    };
    
    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Mettre à jour le contenu sélectionné
    };


    return (
        <div className={"main_container"}>

            <div className="grid-container">
                <Header OpenSidebar={OpenSidebar}/>
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
                <Home/>
            </div>
        </div>
    );
};

export default Main;






