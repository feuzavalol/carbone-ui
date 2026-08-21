import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import Dashboard from './layouts/Dashboard'
import Home from './pages/Home'
// import Vite from "./Vite"
import Users from "./pages/Users"
import Food from './pages/Food'
import Transport from './pages/Transport'
import Liste from './pages/Liste'
import Overview from './pages/OverviewListe'
import { OverviewFood, OverviewTransport, OverviewGoods } from './pages/OverviewCategory'
import OverviewFoodCategory from "./pages/OverviewFoodCategory"
import { LoginPage } from "./pages/Login"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            {/* <Route index element={<Vite />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/liste/food" element={<OverviewFood />} />
            <Route path="/liste/food/data" element={<OverviewFoodCategory />} />
            <Route path="/liste/food/data/moment" element={<Food />} />
            {/* <Route path="/liste/food/summary" element={<SummaryFood />} /> */}
            <Route path="/liste/transport" element={<OverviewTransport />} />
            <Route path="/liste/transport/data" element={<Transport />} />
            <Route path="/liste/goods" element={<OverviewGoods />} />
            {/* <Route path="/liste/goods/data" element={<Goods />} />
            <Route path="/liste/goods/summary" element={<SummaryGoods />} /> */}
            <Route path="/listes" element={<Overview />} />
            <Route path="/liste" element={<Liste />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
