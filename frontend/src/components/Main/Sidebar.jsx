import {React  }from 'react';
import {BsFillArchiveFill,MdSpaceDashboard,BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
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
      <li className='sidebar-list-item'>
        <Link to="/">
            <BsFillGrid1X2Fill className='icon'/> Dashbord
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <a href="/buy">
            <BsCashStack className='icon'/> Achats
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/sell">
            <FaMoneyBillTransfer className='icon'/> Ventes
          </a>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/provider">
            <BsPersonFill className='icon'/> Fournisseurs
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/customer">
            <BsPeopleFill className='icon'/> Clients
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/product">
            <BsBox2Fill className='icon'/> Produits
          </Link>
        </li>
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
