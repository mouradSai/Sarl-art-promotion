import styles from "./styles.module.css";
import Header from 	"./Header"


const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>fakebook</h1>
				<button className={styles.white_btn} onClick={handleLogout}> logout</button>
			</nav>

			<div className="grid-container">


			</div>


		</div>

	);
};

export default Main;