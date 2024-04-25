import React from 'react';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import { Link } from 'react-router-dom';

import "./historique.css"

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className="container">
                <h1 className="title-all">Historique </h1>

                <div className="dashboard-grid">
                    {/* Premier tableau cliquable */}
                    <Link to="/historiqueachat" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <h2>Historique d'Achat</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos achats passés.</p>
                        </div>
                    </Link>

                    {/* Deuxième tableau cliquable */}
                    <Link to="/historiquedevent" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique de vente */ }}>
                            <h2>Historique de Vente</h2>
                            <p>Consultez l'historique de vos ventes précédentes dans cet espace.</p>
                        </div>
                    </Link>
                   
                </div>
            </div>
        </div>
    );
}

export default App;
