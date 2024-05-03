import React from 'react';
import { BsSearch, BsJustify } from 'react-icons/bs';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { logout } from '../logout/logout'; // Assurez-vous que le chemin d'importation est correct
import { useNavigate } from 'react-router-dom';


function Header({ OpenSidebar }) {
  const navigate = useNavigate(); // Utilisez `useNavigate` à l'intérieur du composant

  const handleLogout = async () => {
    await logout();  // Attend que la promesse de logout soit résolue
    navigate('/login');  // Ensuite redirige vers la page de connexion
  };
  const handleCategoryClick = () => {
    // Rediriger vers la page Catégorie
    window.location.href = '/categorie';
  };

  const handleWarehouseClick = () => {
    // Rediriger vers la page Entrepôt
    window.location.href = '/entrepot';
  };

  const handleProductClick = () => {
    // Rediriger vers la page Entrepôt
    window.location.href = '/product';
  };

  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon-header' onClick={OpenSidebar} />
      </div>

      <div className='header-right'>
        <button className={"white_btn"} onClick={handleProductClick}>
          <span>Produits</span>
        </button>

        <button className={"white_btn"} onClick={handleCategoryClick}>
          <span>Catégorie</span>
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
