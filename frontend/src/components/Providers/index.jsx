import React from 'react'

function index() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const [selectedContent, setSelectedContent] = useState("home"); // État pour stocker le contenu sélectionné

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
                <h1>Page Fournisseurs</h1>
            </div>
        </div>

  )
}

export default index