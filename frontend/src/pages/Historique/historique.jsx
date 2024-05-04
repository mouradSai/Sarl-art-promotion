import React from 'react';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import { Link } from 'react-router-dom';

import "./historique.css"

function App() {

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
                   


                    
                    <Link to="/historique_commande_achat" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <h2>Historique des commandes d'achat</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos achats passés.</p>
                        </div>
                    </Link>
                    <Link to="/historique_commande_vente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <h2>Historique des commandes de vente</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos ventes passés.</p>
                        </div>
                    </Link>
                    <Link to="/historique_commande" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <h2>Historique des commandes</h2>
                            <p>Ici, vous pouvez consulter l'historique de bon de commande.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default App;
