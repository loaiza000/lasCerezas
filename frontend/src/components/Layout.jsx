import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaMoneyBillWave, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar autenticación
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header con navegación */}
      <header className="bg-white/10 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img className="h-8 w-auto" src="/logo.png" alt="Las Cerezas" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                Las Cerezas
              </span>
            </Link>

            {/* Navegación */}
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 rounded">
                <FaHome className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/usuarios" className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 rounded">
                <FaUsers className="w-4 h-4 mr-2" />
                Usuarios
              </Link>
              <Link to="/turnos" className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 rounded">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                Turnos
              </Link>
              <Link to="/pagos" className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 rounded">
                <FaMoneyBillWave className="w-4 h-4 mr-2" />
                Pagos
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    localStorage.removeItem('token');
                    toast.success('Sesión cerrada correctamente');
                    window.location.href = '/login';
                  }
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-300 rounded"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
