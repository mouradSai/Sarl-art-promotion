import {useState} from "react";
import styles from "./styles.module.css";
import Header from 	"./Header"
import Home from 	"./Home"
import Sidebar from  "./Sidebar"


const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>fakebook</h1>
				<button className={styles.white_btn} onClick={handleLogout}> Logout</button>
			</nav>

			<div className="grid-container">
				<Header/>
				<Sidebar/>
				<Home/>

			</div>


		</div>

	);
};

export default Main;