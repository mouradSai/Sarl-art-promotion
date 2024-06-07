import {React  }from 'react';
import logowhite from '../../assets/logo-white.png';
import { Link } from 'react-router-dom';

// Importation des icones react
import {BsFillArchiveFill, BsPersonCircle, MdSpaceDashboard,BsCardList, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbZoomMoney } from "react-icons/tb";
import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { RxPerson } from "react-icons/rx";



  
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

        
    

      <Link to="/livraison" className="sidebar-link"> 
      <li className='sidebar-list-item'>
            <BsFillGrid1X2Fill className='icon'/> Tableau de Bord
        </li>
      </Link>
      <Link to="/Livraison" className="sidebar-link">
        <li className='sidebar-list-item'>
            <  AiOutlineDeliveredProcedure
 className='icon'/>Livraison 
        </li>
        </Link>

      
      <Link to="/camions" className="sidebar-link">
        <li className='sidebar-list-item'>
            < TbTruckDelivery className='icon'/>camion 
        </li>
        </Link>
        <Link to="/chauffeurs" className="sidebar-link">
        <li className='sidebar-list-item'>
            < RxPerson className='icon'/>Chauffeur 
        </li>
        </Link>
        <Link to="/historique_livraison" className="sidebar-link">
        <li className='sidebar-list-item'>
            < BsFileBarGraphFill className='icon'/>Historique 
        </li>
        </Link>


      
       
       
        
      </ul>
    </aside>
  )
}

export default Sidebar;
