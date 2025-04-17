import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import ListPage from '../components/ListPage';
import { toast } from 'react-hot-toast';

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/usuario', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      setUsuarios(data.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUsuario = () => {
    toast.error('Función en desarrollo');
  };

  const handleEditUsuario = (id) => {
    toast.error('Función en desarrollo');
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/usuario/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar usuario');
        }

        toast.success('Usuario eliminado correctamente');
        fetchUsuarios();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message);
      }
    }
  };

  const filterOptions = [
    { value: 'todos', label: 'Todos los usuarios' },
    { value: 'activos', label: 'Usuarios activos' },
    { value: 'inactivos', label: 'Usuarios inactivos' }
  ];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usuario.telefono && usuario.telefono.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedFilter === 'todos') return matchesSearch;
    return matchesSearch && usuario.estado === selectedFilter;
  });

  const renderUsuario = (usuario) => (
    <div key={usuario._id} className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20 hover:border-pink-500/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <FaUser className="text-pink-500" />
            <h2 className="text-xl font-bold text-white">{usuario.nombre}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-400" />
              <span>{usuario.email}</span>
            </div>
            {usuario.telefono && (
              <div className="flex items-center space-x-2">
                <FaPhone className="text-gray-400" />
                <span>{usuario.telefono}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUsuario(usuario._id)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-300"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteUsuario(usuario._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all duration-300"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ListPage
      title="Usuarios"
      items={filteredUsuarios}
      onAdd={handleAddUsuario}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      loading={loading}
      error={error}
      renderItem={renderUsuario}
      addButtonText="Agregar Usuario"
    />
  );
};

export default Usuarios;
