import {React  }from 'react';
import logowhite from '../../../assets/logo-white.png';
import { Link } from 'react-router-dom';

// Importation des icones react
import {BsFillArchiveFill, BsPersonCircle, MdSpaceDashboard,BsCardList, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbBuildingFactory } from "react-icons/tb";
import { RiCalendarScheduleLine } from "react-icons/ri";

import { TbZoomMoney } from "react-icons/tb";
import { BsReceiptCutoff } from "react-icons/bs";


  
function SidebarProduction({ openSidebarToggle, OpenSidebar }) {

  const userRole = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur depuis le localStorage

  // Vérifier si l'utilisateur a le rôle d'administrateur
  const isSuperadmin = userRole === 'superadmin' || userRole === 'admin'  ;
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
          <div className='sidebar-brand'>

              <Link to="/">
              <img src={logowhite} alt='Logo' className='sidebar-logo' />
              </Link>

              <div className="sidebar-name">Sarl Art Promotion</div>

          </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>

      {isSuperadmin && (
      <Link to="/Dashboard_production" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsFillGrid1X2Fill  className='icon'/> Tableau de bord
        </li>
      </Link>)}

      <Link to="/planning" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <RiCalendarScheduleLine  className='icon'/> Planning
        </li>
      </Link>
      <Link to="/production_beton" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <TbBuildingFactory  className='icon'/> Production
        </li>
      </Link>
     
      
      {isSuperadmin && (
      <Link to="/production_vente" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsCashStack  className='icon'/> Vente
        </li>
      </Link>)}
      {isSuperadmin && (
      <Link to="/bon_production_beton" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsCardList  className='icon'/> Bon de production
        </li>
      </Link>)}
      <Link to="/formula" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsReceiptCutoff  className='icon'/> Formules
        </li>
      </Link>
      <Link to="/Stock_finie" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsBox2Fill  className='icon'/> Stock fini
        </li>
      </Link>
      {isSuperadmin && (
      <Link to="/credit_production_vente" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <TbZoomMoney  className='icon'/> Crédit de vente
        </li>
      </Link>)}
    

      <Link to="/historique_production" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsFileBarGraphFill  className='icon'/> Historique
        </li>
      </Link>
       
       
        
      </ul>
    </aside>
  )
}

export default SidebarProduction;
