import {React  }from 'react';
import logowhite from '../../assets/logo-white.png';
import { Link } from 'react-router-dom';

// Importation des icones react
import {BsFillArchiveFill, BsPersonCircle, MdSpaceDashboard,BsCardList, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbZoomMoney } from "react-icons/tb";



  
function Sidebar({ openSidebarToggle, OpenSidebar }) {

  const userRole = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur depuis le localStorage

  // Vérifier si l'utilisateur a le rôle d'administrateur
  const isSuperadmin = userRole === 'superadmin'  ;
  //const isUser = userRole === 'superadmin' || userRole === 'admin';
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

        
    

      <Link to="/stock" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsFillGrid1X2Fill className='icon'/> Dashboard
        </li>
      </Link>
      
      {isSuperadmin && (
      <Link to="/users" className="sidebar-link"> 
      <li className='sidebar-list-item'>
          <BsPersonCircle className='icon'/> Utilisateurs
        </li>
      </Link>)}

      <Link to="/orderpage" className="sidebar-link">
        <li className='sidebar-list-item'>
            < BsCardList className='icon'/> Bon de commande 
        </li>
        </Link>

        <Link to="/orderbuypage" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsCashStack className='icon'/> Achat
        </li>
        </Link>

        <Link to="/ordersellpage" className="sidebar-link">
        <li className='sidebar-list-item'>
            <FaMoneyBillTransfer className='icon'/>  Vente 
        </li>
        </Link>

        <Link to="/provider" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsPersonFill className='icon'/> Fournisseurs
        </li>
        </Link>

        <Link to="/customer" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsPeopleFill className='icon'/> Clients
        </li>
        </Link>

        <Link to="/product" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsBox2Fill className='icon'/> Produits
        </li>
        </Link>
        <Link to="/credit" className="sidebar-link">
        <li className='sidebar-list-item'>
            <TbZoomMoney  className='icon'/> Crédits
        </li>
        </Link>

        <Link to="/historique" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsFileBarGraphFill  className='icon'/> Historiques
        </li>
        </Link>
       
       
        
      </ul>
    </aside>
  )
}

export default Sidebar;
