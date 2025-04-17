import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaClock, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import ListPage from '../components/ListPage';
import { toast } from 'react-hot-toast';

const Turnos = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/turno', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener turnos');
      }

      const data = await response.json();
      setTurnos(data.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTurno = () => {
    toast.error('Función en desarrollo');
  };

  const handleEditTurno = (id) => {
    toast.error('Función en desarrollo');
  };

  const handleDeleteTurno = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este turno?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/turno/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar turno');
        }

        toast.success('Turno eliminado correctamente');
        fetchTurnos();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message);
      }
    }
  };

  const filterOptions = [
    { value: 'todos', label: 'Todos los turnos' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'completado', label: 'Completados' },
    { value: 'cancelado', label: 'Cancelados' }
  ];

  const filteredTurnos = turnos.filter(turno => {
    const matchesSearch = 
      turno.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turno.servicio?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'todos') return matchesSearch;
    return matchesSearch && turno.estado === selectedFilter;
  });

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'completado':
        return 'bg-green-500/20 text-green-300';
      case 'cancelado':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const renderTurno = (turno) => (
    <div key={turno._id} className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20 hover:border-pink-500/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <FaUser className="text-pink-500" />
            <h2 className="text-xl font-bold text-white">{turno.cliente}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400" />
              <span>{formatFecha(turno.fecha)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400" />
              <span>{turno.servicio}</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(turno.estado)}`}>
              {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleEditTurno(turno._id)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-300"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteTurno(turno._id)}
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
      title="Turnos"
      items={filteredTurnos}
      onAdd={handleAddTurno}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      loading={loading}
      error={error}
      renderItem={renderTurno}
      addButtonText="Agendar Turno"
    />
  );
};

export default Turnos;

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = filtroEstado === 'todos' ? '/turno' : `/turno/estado/${filtroEstado}`;
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.ok) {
        setTurnos(data.data);
      } else {
        toast.error(data.message || 'Error al cargar los turnos');
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticación
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/turno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoTurno)
      });

      if (response.ok) {
        toast.success('Turno creado exitosamente');
        setShowModal(false);
        fetchTurnos();
        setNuevoTurno({ fecha: '', hora: '', estado: 'pendiente' });
      } else {
        toast.error('Error al crear el turno');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este turno?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/turno/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Turno eliminado exitosamente');
          fetchTurnos();
        } else {
          toast.error('Error al eliminar el turno');
        }
      } catch (error) {
        toast.error('Error al conectar con el servidor');
      }
    }
  };

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/turno/${turnoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const data = await response.json();
      if (data.ok) {
        toast.success('Estado del turno actualizado');
        fetchTurnos();
      } else {
        toast.error(data.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Gestión de Turnos</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Gestión de Turnos</h1>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Turnos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#9B2242] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#7D1B35] transition-colors"
        >
          <FaPlus className="mr-2" /> Nuevo Turno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar turnos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2242]"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              fetchTurnos();
            }}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2242]"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {turnos
                  .filter(turno => 
                    turno.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    turno.hora.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    turno.estado.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((turno) => (
                  <tr key={turno._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(turno.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${turno.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                          turno.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        <span className="flex items-center">
                          {turno.estado === 'completado' ? <FaCheck className="mr-1" /> :
                           turno.estado === 'pendiente' ? <FaSpinner className="mr-1" /> :
                           <FaTimes className="mr-1" />}
                          {turno.estado}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {turno.estado === 'pendiente' && (
                          <button
                            onClick={() => handleUpdateEstado(turno._id, 'completado')}
                            className="text-green-600 hover:text-green-900"
                            title="Marcar como completado"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(turno._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar turno"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <FaClock className="mr-2 text-purple-600" /> Nuevo Turno
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevoTurno.fecha}
                  onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2242]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevoTurno.hora}
                  onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2242]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400" />
              <span>{formatFecha(turno.fecha)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400" />
              <span>{turno.servicio}</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(turno.estado)}`}>
              {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleEditTurno(turno._id)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-300"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteTurno(turno._id)}
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
      title="Turnos"
      items={filteredTurnos}
      onAdd={handleAddTurno}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      loading={loading}
      error={error}
      renderItem={renderTurno}
      addButtonText="Agendar Turno"
    />
  );
};

export default Turnos;
