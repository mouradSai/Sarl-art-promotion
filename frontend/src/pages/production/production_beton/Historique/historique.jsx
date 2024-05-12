import React from 'react';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import { Link } from 'react-router-dom';
import bon from '../../../../assets/bon.jpg';
import achat from '../../../../assets/achat.jpg';
import vente from '../../../../assets/vente.jpg';
import creditA from '../../../../assets/creditA.jpg';
import creditV from '../../../../assets/creditV.jpg';

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
                <h1 className="title-all">Historiques</h1>

                <div className="dashboard-grid">
                   



                   <Link to="/historique_beton" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                                <img src={achat} />
                            <h2>Historique des production</h2>
                            <p>Ici, vous pouvez consulter l'historique des Production</p>
                        </div>
                    </Link>

                    <Link to="/historique_bon" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={bon} />
                            <h2>Historique des Bon commandes </h2>
                            <p>Ici, vous pouvez consulter l'historique de vos Bon de commandes passés</p>
                        </div>
                    </Link>

                    <Link to="/historique_production_vente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={vente} />
                            <h2>Historique des commandes de vente de beton </h2>
                            <p>Ici, vous pouvez consulter l'historique de vos ventes passés</p>
                        </div>
                    </Link>
                    <Link to="/historique_credit_vente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={vente} />
                            <h2>Historique des credit de vente de beton </h2>
                            <p>Ici, vous pouvez consulter l'historique de vos credit de ventes passés</p>
                        </div>
                    </Link>

                  

                </div>
            </div>
        </div>
    );
}

export default App;
