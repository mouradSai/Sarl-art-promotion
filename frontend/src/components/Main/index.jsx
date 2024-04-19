import {useState} from "react";
import styles from "./styles.module.css";
import Header from 	"./Header"
import Home from 	"./Home"
import Sidebar from  "./Sidebar"


// const Main = () => {
// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		window.location.reload();
// 	};

	function Main() {
		const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
	  
		const OpenSidebar = () => {
		  setOpenSidebarToggle(!openSidebarToggle)
		}

	return (
		// <div className={styles.main_container}>
		// 	<nav className={styles.navbar}>
		// 		<h1>fakebook</h1>
		// 		<button className={styles.white_btn} onClick={handleLogout}> Logout</button>
		// 	</nav>

			<div className="grid-container">
				<Header OpenSidebar={OpenSidebar}/>
				<Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
				<Home/>

			</div>


		// </div>

	);
};

export default Main;