import { Route, Routes, Navigate } from "react-router-dom";

//components imports 
import Index from "./components/Main/index";
import Signup from "./components/Signup";
import Login from "./components/Login";


//pages imports 
import Product from "./pages/Products/product";
import Customer from"./pages/customers/customer";
import Provider from "./pages/provider/provider";
import Buy from "./pages/buy/buy";
import Historiqueachat from "./pages/Historique/historiqueachat";




function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Index/>} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/provider" element={<Provider />}/>
			<Route path="/customer" element={<Customer />}/>
			<Route path="/product" element={<Product />}/>
			<Route path="/buy" element={<Buy />}/>
			<Route path="/historiqueachat" element={<Historiqueachat />}/>



		</Routes>
	);
}

export default App;