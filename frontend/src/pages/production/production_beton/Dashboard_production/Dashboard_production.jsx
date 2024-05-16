import React, { useState } from 'react';
import { BsBox2Fill, BsPersonFill, BsPeopleFill, BsCashStack, BsFileBarGraphFill } from 'react-icons/bs';
import { FaMoneyBillTransfer, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatsTable from './sharts_production/shart_prod_vente'; // Import the StatsTable component
import SalesLineChart from './sharts_graph/SalesLineChart'; 
import Sidebar from '../../production_beton/SidebarProduction';
import Header from '../../../../components/Main/Header';
import CustomAlert from '../../../../components/costumeAlert/costumeAlert';
import './sharts_production/StatsCard.css';
import './sharts_graph/SalesLineChart.css';

function Home() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <main className='main-container'>
                <div className='main-cards'>    
                    {/* Ajout du tableau de statistiques */}
                    <StatsTable />
                </div>
                <div className='graph'>    
                    {/* Ajout du tableau de statistiques */}
                    <SalesLineChart />
                </div>
            </main>
        </div>
    );
}

export default Home;
