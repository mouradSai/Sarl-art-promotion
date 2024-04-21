import {React ,useState} from 'react'; // Importez useState de React
import "./App.css";
import Header from 	"./Header"
import Sidebar from "./Sidebar";
import Home from './Home';





const Main = () => {
<<<<<<< HEAD
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

=======
 
>>>>>>> e954934cd1aa2d2141bb15fe232660ef51aa21e2

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle);
    };
<<<<<<< HEAD
    
    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Mettre à jour le contenu sélectionné
    };


=======
>>>>>>> e954934cd1aa2d2141bb15fe232660ef51aa21e2
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






