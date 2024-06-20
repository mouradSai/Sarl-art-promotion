import React, { useState, useEffect } from 'react';
import { BsSearch, BsJustify, BsArrowBarLeft, BsPersonCircle, BsCaretDownFill } from 'react-icons/bs';
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../logout/logout'; // Assurez-vous que le chemin d'importation est correct

function Header({ OpenSidebar }) {
  const navigate = useNavigate(); // Utilisez `useNavigate` à l'intérieur du composant
  const [userName, setUserName] = useState('');
  const [Role, setRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Récupérer le nom de l'utilisateur depuis le localStorage
    const storedUserName = localStorage.getItem('firstName');
    const storedRole = localStorage.getItem('role');
    // Mettre à jour l'état avec le nom de l'utilisateur
    setUserName(storedUserName);
    setRole(storedRole);
  }, []); 

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileAction = (action) => {
    if (action === "Déconnexion") {
      handleLogout();
    }
  };

  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon-header' onClick={OpenSidebar}/>
      </div>

      <Link to="/"> 
        <button className={"white_btn_logout"}>
          <BsArrowBarLeft className='icon-head logaac'/> Accueil
        </button>
      </Link>

      <div className='header-right'> </div>

      <div className="profile-dropdown">
        <div className="profile-info" onClick={toggleDropdown}>
          <BsPersonCircle className='icon-head'/>
          <span className='leftione'>{userName}</span>
          <span className='lefti'>{Role}</span>
          <BsCaretDownFill className='icon-head'/>
        </div>
        {dropdownOpen && (
          <div className="dropdown-content">
            <button onClick={() => handleProfileAction("Déconnexion")}>
              <RiLogoutBoxFill className='icon-head'/> Déconnexion
            </button>
          </div>
        )}
      </div>

    </header>
  );
}

export default Header;
