import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './layouts/Dashboard'
// import Vite from "./Vite"
import Users from "./pages/Users"
import Food from './pages/Food'
import Transport from './pages/Transport'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* <Route index element={<Vite />} /> */}
          <Route path="/users" element={<Users />} />
          <Route path="/food" element={<Food />} />
          <Route path="/transport" element={<Transport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
