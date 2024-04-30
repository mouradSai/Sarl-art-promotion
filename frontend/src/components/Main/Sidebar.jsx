import {React  }from 'react';
import {BsFillArchiveFill,MdSpaceDashboard,BsCardList, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import logowhite from '../../assets/logo-white.png';
  
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
        <img src={logowhite} alt='Logo' className='sidebar-logo' />
          <div className="sidebar-name">Sarl Art Groupe</div>
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>

      <Link to="/" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsFillGrid1X2Fill className='icon'/> Dashbord
        </li>
      </Link>
      <Link to="/orderpage" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsCardList className='icon'/> Commande 
        </li>
        </Link>
      <Link to="/buy" className="sidebar-link"> 
        <li className='sidebar-list-item'>
            <BsCashStack className='icon'/> Achats
        </li>
      </Link>

      <Link to="/sell" className="sidebar-link"> 
        <li className='sidebar-list-item'>
            <FaMoneyBillTransfer className='icon'/> Ventes
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
        <Link to="/historique" className="sidebar-link">
        <li className='sidebar-list-item'>
            <BsFileBarGraphFill  className='icon'/> Historique
        </li>
        </Link>
       
       
        
      </ul>
    </aside>
  )
}

export default Sidebar;
