import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import Dashboard from './layouts/Dashboard'
import Home from './pages/Home'
// import Vite from "./Vite"
// import Users from "./pages/Users"
import Food from './pages/Food'
import Goods from "./pages/Goods"
import Transport from './pages/Transport'
import Liste from './pages/Liste'
import OverviewByYear from "./pages/overview/OverviewYear"
import Overview from './pages/overview/OverviewListe'
import { OverviewFood, OverviewTransport, OverviewGoods } from './pages/overview/OverviewCategory'
import OverviewFoodCategory from "./pages/overview/OverviewFoodCategory"
import { LoginPage } from "./pages/Login"
import { RegisterPage } from "./pages/Register"
import FoodSummary from "./pages/summary/FoodSummary"
import GoodSummary from "./pages/summary/GoodSummary"
import { OverviewDatabase } from "./pages/overview/OverviewDatabase"
import FoodDatabase from "./pages/database/FoodDatabase"
import FoodDetails from "./pages/database/FoodDetails"
import GoodDatabase from "./pages/database/GoodDatabase"
import GoodDetails from "./pages/database/GoodDetails"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            {/* <Route index element={<Vite />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/liste/food" element={<OverviewFood />} />
            <Route path="/liste/food/data" element={<OverviewFoodCategory />} />
            <Route path="/liste/food/data/moment" element={<Food />} />
            <Route path="/liste/food/summary" element={<FoodSummary />} />
            <Route path="/liste/transport" element={<OverviewTransport />} />
            <Route path="/liste/transport/data" element={<Transport />} />
            <Route path="/liste/goods" element={<OverviewGoods />} />
            <Route path="/liste/goods/data" element={<Goods />} />
            <Route path="/liste/goods/summary" element={<GoodSummary />} />
            <Route path="/listeByYear" element={<OverviewByYear />} />
            <Route path="/listes" element={<Overview />} />
            <Route path="/liste" element={<Liste />} />
            <Route path="/db" element={<OverviewDatabase />} />
            <Route path="/db/food" element={<FoodDatabase />} />
            <Route path="/db/food/details" element={<FoodDetails />} />
            <Route path="/db/food/create" element={<FoodDetails />} />
            <Route path="/db/goods" element={<GoodDatabase />} />
            <Route path="/db/goods/details" element={<GoodDetails />} />
            <Route path="/db/goods/create" element={<GoodDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
