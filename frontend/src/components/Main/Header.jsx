import React from 'react'
import 
 { BsSearch, BsJustify}
 from 'react-icons/bs';
 import { CiLogout } from "react-icons/ci";
 const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <BsSearch  className='icon'/>
        </div>
        <div className='header-right'>

            
            <button className={"white_btn"} onClick={handleLogout}> <CiLogout className='icon'/>logout</button>

        </div>
    </header>
  )
}

export default Header