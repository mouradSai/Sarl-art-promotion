import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Products from "./components/Products";
import Providers from "./components/Providers";
import Customers from "./components/Customers";



function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/Customers" exact element={<Customers />} />
			<Route path="/Providers" exact element={<Providers />} />
			<Route path="/Products" exact element={<Products />} />
		</Routes>
	);
}

export default App;