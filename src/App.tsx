import { BrowserRouter, Routes, Route } from "react-router-dom"
import Vite from "./Vite"
import Users from "./pages/Users"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Vite />} >
        </Route>
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
