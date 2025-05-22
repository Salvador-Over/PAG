import './App.css';
import { Route, Routes } from 'react-router-dom';
import CrearCuenta from './Components/cuentaUsuario/Crear_Cuenta';
import Iniciar from './Components/iniciarSesion/IniciarSesion';
import Perfil from './Components/PerfilUsu/PerfilUsu';
import EditarCuenta from './Components/EditarCuenta/EditarCuenta';
import Administración from './Components/administracion/menuAdministrativo';
import Producto from './Components/administracion/productos/productos';
import GestionUsu from './Components/administracion/GestionUsu/GestionUsu';
import InsertarProducto from './Components/administracion/productos/insertarProducto';
import MostrarProd from './Components/MostrarProd/MostrarProd';
import NotFound from './Components/PaginaError/PaginaError';
import Home from './Components/Home/Home'; // Importa el nuevo componente Home
import DetallesProd from './Components/DetallesProd/DetallesProd';
import Carrito from './Components/Carrito/Carrito';



function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/IniciarSesion" element={<Iniciar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/EditarCuenta" element={<EditarCuenta />} />
        <Route path="/Administrativo" element={<Administración />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/gestion-usuarios" element={<GestionUsu />} />
        <Route path="/insertar-producto" element={<InsertarProducto />} />
        <Route path="/MostrarProd" element={<MostrarProd />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/detalles/:id" element={<DetallesProd />} /> {/* Ruta con parámetro dinámico */}
        <Route path="/carrito" element={<Carrito />} /> {/* Ruta con parámetro dinámico */}


      </Routes>
    </div>
  );
}

export default App;