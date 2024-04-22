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
        <Link to="/">
            <BsFillArchiveFill className='icon'/> Dashbord
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/provider">
            <BsPeopleFill className='icon'/> Providers
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/customer">
            <BsPeopleFill className='icon'/> costumers
          </Link>
        </li>
        <li className='sidebar-list-item'>
        <Link to="/product">
            <BsFillGrid3X3GapFill className='icon'/> products
          </Link>
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
