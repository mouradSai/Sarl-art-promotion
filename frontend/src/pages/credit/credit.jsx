import React from 'react';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import { Link } from 'react-router-dom';
import creditAchats from '../../assets/creditAchats.jpg';
import creditVentes from '../../assets/creditVentes.jpg';

// import "./historique.css"

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
                <h1 className="title-all">Crédits</h1>

                <div className="dashboard-grid">
                   
                   <Link to="/credit_vente" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                                <img src={creditVentes} />
                            <h2>Crédits des Ventes</h2>
                            <p>Ici, vous pouvez consulter les crédits liés aux clients lors des ventes</p>
                        </div>
                    </Link>

                    <Link to="/credit_achat" className="link-no-underline">
                        <div className="dashboard-item" onClick={() => { /* Redirection vers l'historique d'achat */ }}>
                            <img src={creditAchats} />
                            <h2>Crédits des Achats</h2>
                            <p>Ici, vous pouvez consulter les crédits liés aux fournisseurs lors des achats</p>
                        </div>
                    </Link>


                </div>
            </div>
        </div>
    );
}

export default App;
