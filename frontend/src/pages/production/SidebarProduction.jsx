import {React  }from 'react';
import logowhite from '../../assets/logo-white.png';
import { Link } from 'react-router-dom';

// Importation des icones react
import {BsFillArchiveFill, BsPersonCircle, MdSpaceDashboard,BsCardList, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbBuildingFactory } from "react-icons/tb";



  
function SidebarProduction({ openSidebarToggle, OpenSidebar }) {

  const userRole = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur depuis le localStorage

  // Vérifier si l'utilisateur a le rôle d'administrateur
  const isSuperadmin = userRole === 'superadmin'  ;
  //const isUser = userRole === 'superadmin' || userRole === 'admin';
  return (
    <aside id="sidebarProd" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
          <div className='sidebar-brand'>

              <Link to="/">
              <img src={logowhite} alt='Logo' className='sidebar-logo' />
              </Link>

              <div className="sidebar-name">Sarl Art Groupe</div>

          </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>

      <Link to="/production_beton" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <TbBuildingFactory  className='icon'/> Production
        </li>
      </Link>
       
       
        
      </ul>
    </aside>
  )
}

export default SidebarProduction;