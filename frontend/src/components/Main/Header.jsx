import React from 'react';
import { BsSearch, BsJustify, BsArrowBarLeft } from 'react-icons/bs';
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../logout/logout'; // Assurez-vous que le chemin d'importation est correct

function Header({ OpenSidebar }) {
  const navigate = useNavigate(); // Utilisez `useNavigate` à l'intérieur du composant

  const handleLogout = async () => {
    await logout();  // Attend que la promesse de logout soit résolue
    navigate('/login');  // Ensuite redirige vers la page de connexion
  };

  return (


    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon-header' onClick={OpenSidebar}/>
        </div>


          <Link to="/"> 
            <button className={"white_btn_logout"}>
              <BsArrowBarLeft className='icon-head'/> Accueil
            </button>
          </Link>

        <div className='header-right'></div>

        <button className={"white_btn_logout"} onClick={handleLogout}>
          <RiLogoutBoxFill className='icon-head'/> Déconnexion
        </button>

    </header>
  );
}

export default Header;
