import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import { Link, useNavigate } from "react-router-dom";




function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <div  className='icon_header'/> Sarl Art Promotion
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to = "">
                    <BsGrid1X2Fill className='icon'/> Accueil
                </Link >
            </li>
            <li className='sidebar-list-item'>
                    <Link to = "./Products">
                        <BsFillArchiveFill className='icon' /> Produits
                    </Link >
                </li>
            <li className='sidebar-list-item'>
                <Link to = "./Providers">
                    <BsFillGrid3X3GapFill className='icon'/> Fournisseurs
                </Link >
            </li>
            <li className='sidebar-list-item'>
                <Link to = "./Customers">
                    <BsPeopleFill className='icon'/> Clients
                </Link > 
            </li>
            <li className='sidebar-list-item'>
                <Link to = "">
                    <BsListCheck className='icon'/> Inventaires
                </Link >
            </li>
            <li className='sidebar-list-item'>
                <Link to = "">
                    <BsMenuButtonWideFill className='icon'/> Raports
                </Link >
            </li>

        </ul>
    </aside>
  )
}


export default Sidebar