import {React ,useState} from 'react'; 
import Sidebar from '../Main/Sidebar';
import Header from 	"../Main/Header"


function index() {



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
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
      {/* Ajoute ici le contenu  */}
    </div>

  )
}

export default index