import React from 'react';
import { BsSearch, BsJustify } from 'react-icons/bs';
import { RiLogoutBoxFill } from 'react-icons/ri';

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

function Header({ OpenSidebar }) {
  const handleCommandeClick = () => {
    // Rediriger vers la page Catégorie
    window.location.href = '/historique_commande';
  };


  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon-header' onClick={OpenSidebar} />
      </div>

      <div className='header-right'>
        <button className={"white_btn"} onClick={handleCommandeClick}>
          <span>Historique </span>
        </button>

      
      </div>

      <button className={"white_btn_logout"} onClick={handleLogout}>
          <RiLogoutBoxFill className='icon-head' />
          <span>Déconnexion</span>
        </button>

    </header>
  );
}

export default Header;
