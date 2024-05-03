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
{/*import Buy from "./pages/buy/buy";
import Sell from "./pages/sell/sell";
import Historiqueachat from "./pages/Historique/historiqueAchat/historiqueachat";
import Historiquevente from "./pages/Historique/historiquevente/historiquevente";*/}
import Historique from "./pages/Historique/historique"
import Categorie from "./pages/categorie/categorie";
import Entrepot from "./pages/entrepots/entrepot";
import Orderpage from "./pages/orderPage/orderpage";
import Orderbuypage from "./pages/orderbuyPage/orderbuypage";
import Users from "./pages/users/users";
import Ordersellpage from "./pages/ordersellPage/ordersellpage";

//Historique_commande
import Historique_commande from "./pages/Historique/historique_commande/historique_commande"; 
import Historique_commande_achat from "./pages/Historique/historique-commande_achat/historique_commande_achat";
import Historique_commande_vente from "./pages/Historique/historique_commande_vente/historique_commande_vente";


//protection de routes 
import ProtectedRoute from "./components/protection/ProtectedRoute";

function App() {
	
	const user = localStorage.getItem("token");

	return (
		<Routes>
		{/* Utilisation d'un ternaire pour déterminer si on affiche la page ou redirige vers login */}
		<Route path="/" element={user ? <ProtectedRoute><Landpage/></ProtectedRoute> : <Navigate replace to="/login" />} />
  
		{/* Routes qui nécessitent la protection */}
		<Route path="/provider" element={<ProtectedRoute><Provider /></ProtectedRoute>} />
		<Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
		<Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
		<Route path="/historique" element={<ProtectedRoute><Historique /></ProtectedRoute>} />
		<Route path="/categorie" element={<ProtectedRoute><Categorie /></ProtectedRoute>} />
		<Route path="/entrepot" element={<ProtectedRoute><Entrepot /></ProtectedRoute>} />
		<Route path="/orderpage" element={<ProtectedRoute><Orderpage /></ProtectedRoute>} />
		<Route path="/orderbuypage" element={<ProtectedRoute><Orderbuypage /></ProtectedRoute>} />
		<Route path="/ordersellpage" element={<ProtectedRoute><Ordersellpage /></ProtectedRoute>} />
		<Route path="/historique_commande" element={<ProtectedRoute><Historique_commande /></ProtectedRoute>} />
		<Route path="/historique_commande_achat" element={<ProtectedRoute><Historique_commande_achat /></ProtectedRoute>} />
		<Route path="/historique_commande_vente" element={<ProtectedRoute><Historique_commande_vente /></ProtectedRoute>} />
		<Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
		<Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
  
		{/* Routes sans protection */}
		<Route path="/signup" element={<Signup />} />
		<Route path="/login" element={<Login />} />
	  </Routes>
	);
}

export default App;