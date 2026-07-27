import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './layouts/Dashboard'
// import Vite from "./Vite"
import Users from "./pages/Users"
import Food from './pages/Food'
import Transport from './pages/Transport'
import Liste from './pages/Liste'
import Overview from './pages/OverviewListe'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* <Route index element={<Vite />} /> */}
          <Route path="/users" element={<Users />} />
          <Route path="/liste/food" element={<Food />} />
          <Route path="/list/transport" element={<Transport />} />
          <Route path="/listes" element={<Overview />} />
          <Route path="/liste" element={<Liste />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
