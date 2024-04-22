import {React  }from 'react';
import {BsCart3,BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
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
        <Link to="/provider">
            <BsFillArchiveFill className='icon'/> Fournisseurs
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/customer">
            <BsFillArchiveFill className='icon'/> Clients
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <a href="#categories">
            <BsFillGrid3X3GapFill className='icon'/> Categories
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="#customers">
            <BsPeopleFill className='icon'/> Customers
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="#inventory">
            <BsListCheck className='icon'/> Inventory
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="#reports">
            <BsMenuButtonWideFill className='icon'/> Reports
          </a>
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
