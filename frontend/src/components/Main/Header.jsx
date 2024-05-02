import {React} from 'react'
import { BsSearch, BsJustify} from 'react-icons/bs';
import { RiLogoutBoxFill } from "react-icons/ri";

 
 const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};


function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon-header' onClick={OpenSidebar}/>
        </div>

        <div className='header-right'></div>

      
        <button className={"white_btn_logout"} onClick={handleLogout} > <RiLogoutBoxFill className='icon-head'/>Déconnexion</button>

          
    </header>
  )
}

export default Header;