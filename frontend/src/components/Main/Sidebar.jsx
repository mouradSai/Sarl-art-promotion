import {React  }from 'react';
import {BsCart3,BsFillArchiveFill, BsFillGrid3X3GapFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import blackLogo from '../../assets/art-black.png';
  
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
        <img src={blackLogo} alt='Logo' className='sidebar-logo' />
          <div className="sidebar-name">Sarl Art Groupe</div>
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>
      <li className='sidebar-list-item'>
        <Link to="/">
            <BsFillArchiveFill className='icon'/> Dashbord
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <a href="/buy">
            <BsMenuButtonWideFill className='icon'/> Achats
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/sell">
            <BsFillGrid3X3GapFill className='icon'/> Ventes
          </a>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/provider">
            <BsPeopleFill className='icon'/> Fournisseurs
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
        <li className='sidebar-list-item'>
        <Link to="/historiqueachat">
            <BsPeopleFill className='icon'/> Historique
          </Link>
        </li>
       
        <li className='sidebar-list-item'>
          <a href="#settings">
            <BsFillGearFill className='icon'/> Options
          </a>
        </li>
        
      </ul>
    </aside>
  )
}

export default Sidebar;
