import React, { useState, useEffect } from 'react';
import { BsSearch, BsJustify, BsArrowBarLeft, BsPersonCircle, BsCaretDownFill } from 'react-icons/bs';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../logout/logout'; 

function Header({ OpenSidebar }) {
  const navigate = useNavigate(); 
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
        <BsJustify className='icon-header' onClick={OpenSidebar} />
      </div>

      <Link to="/"> 
            <button className={"white_btn_logout"}>
              <BsArrowBarLeft className='icon-head logaac'/> Accueil
            </button>
      </Link>


      <div className='header-right'>

        <button className={"white_btn_logout"} onClick={handleProductClick}>
          <span>Produits</span>
        </button>

        <button className={"white_btn_logout"} onClick={handleWarehouseClick}>
          <span>Entrepôts</span>
        </button>

      </div>

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
