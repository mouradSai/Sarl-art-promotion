import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Provider from "./components/provider/provider";
import Customer from"./components/customers/customer";
import Product from "./components/Products/product";
import Buy from "./components/buy/buy";
import Historiqueachat from "./components/Historique/historiqueachat";




function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main/>} />}
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