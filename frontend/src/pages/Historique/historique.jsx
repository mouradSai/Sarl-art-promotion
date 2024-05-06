import React from 'react';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import { Link } from 'react-router-dom';
import bon from '../../assets/bon.jpg';
import achat from '../../assets/achat.jpg';
import vente from '../../assets/vente.jpg';

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
                   



                   <Link to="/historique_commande" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                                <img src={achat} />
                            <h2>Historique des commandes</h2>
                            <p>Ici, vous pouvez consulter l'historique des bons de commande</p>
                        </div>
                    </Link>

                    <Link to="/historique_commande_achat" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={bon} />
                            <h2>Historique des commandes d'achat</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos achats passés</p>
                        </div>
                    </Link>

                    <Link to="/historique_commande_vente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={vente} />
                            <h2>Historique des commandes de vente</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos ventes passés</p>
                        </div>
                    </Link>

                    <Link to="/historique_creditachat" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={vente} />
                            <h2>Historique des credit achat</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos credit achat</p>
                        </div>
                    </Link>
                    <Link to="/historique_creditvente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={vente} />
                            <h2>Historique des credit vente</h2>
                            <p>Ici, vous pouvez consulter l'historique de vos credit vente</p>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default App;
