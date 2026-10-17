import { Routes, Route } from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import PaginaInicio from "./pages/PaginaInicio";
import PaginaTareas from "./pages/PaginaTareas";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/tareas" element={<PaginaTareas />} />
      </Routes>
    </>
  );
}

export default App;
