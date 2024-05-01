import { Route, Routes, Navigate } from "react-router-dom";

//components imports 
import Stock from "./components/Main/index";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Landpage from "./components/landpage/Home";




//pages imports 
import Product from "./pages/Products/product";
import Customer from"./pages/customers/customer";
import Provider from "./pages/provider/provider";
import Buy from "./pages/buy/buy";
import Sell from "./pages/sell/sell"
import Historiqueachat from "./pages/Historique/historiqueAchat/historiqueachat";
import Historiquevente from "./pages/Historique/historiquevente/historiquevente";
import Historique from "./pages/Historique/historique"
import Categorie from "./pages/categorie/categorie";
import Entrepot from "./pages/entrepots/entrepot";
import Orderpage from "./pages/orderPage/orderpage";
import Orderbuypage from "./pages/orderbuyPage/orderbuypage";
import Users from "./pages/users/users";


function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Landpage/>} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/provider" element={<Provider />}/>
			<Route path="/customer" element={<Customer />}/>
			<Route path="/product" element={<Product />}/>
			<Route path="/buy" element={<Buy />}/>
			<Route path="/sell" element={<Sell />}/>
			<Route path="/historiqueachat" element={<Historiqueachat />}/>
			<Route path="/historiquevente" element={<Historiquevente />}/>
			<Route path="/historique" element={<Historique />}/>
			<Route path="/categorie" element={<Categorie />}/>
			<Route path="/entrepot" element={<Entrepot />}/>
			<Route path="/orderpage" element={<Orderpage />}/>
			<Route path="/orderbuypage" element={<Orderbuypage />}/>
			<Route path="/stock" element={<Stock />}/>
			<Route path="/users" element={<Users />}/>

	




		</Routes>
	);
}

export default App;