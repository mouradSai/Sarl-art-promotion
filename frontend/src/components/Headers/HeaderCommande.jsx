import React from 'react';
import { BsSearch, BsJustify, BsArrowBarLeft } from 'react-icons/bs';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { logout } from '../logout/logout'; // Assurez-vous que le chemin d'importation est correct
import { useNavigate, Link } from 'react-router-dom';


function Header({ OpenSidebar }) {
  const navigate = useNavigate(); // Utilisez `useNavigate` à l'intérieur du composant

  const handleLogout = async () => {
    await logout();  // Attend que la promesse de logout soit résolue
    navigate('/login');  // Ensuite redirige vers la page de connexion
  };
  const handleCommandeClick = () => {
    // Rediriger vers la page Catégorie
    window.location.href = '/historique';
  };


  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon-header' onClick={OpenSidebar} />
      </div>

      <Link to="/"> 
            <button className={"white_btn_logout"}>
              <BsArrowBarLeft className='icon-head'/> Accueil
            </button>
      </Link>

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
