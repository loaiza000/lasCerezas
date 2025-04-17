import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaClock, FaUser, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('todos');
  const [nuevoPago, setNuevoPago] = useState({
    monto: '',
    metodo: 'efectivo',
    turnoId: '',
    descripcion: ''
  });

  // Verificar autenticación al inicio
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  // Cargar pagos y turnos
  useEffect(() => {
    fetchPagos();
    fetchTurnos();
  }, []);

  // Función para obtener pagos
  const fetchPagos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/pago', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPagos(data.data || []);
      } else {
        setPagos([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener turnos
  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/turno', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTurnos(data.data || []);
      } else {
        setTurnos([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setTurnos([]);
    }
  };

  // Función para manejar la selección de turno
  const handleTurnoSelect = (turnoId) => {
    setNuevoPago(prev => ({ ...prev, turnoId }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoPago)
      });
      if (response.ok) {
        toast.success('Pago registrado exitosamente');
        setShowModal(false);
        fetchPagos();
        setNuevoPago({
          monto: '',
          metodo: 'efectivo',
          turnoId: '',
          descripcion: ''
        });
      } else {
        toast.error('Error al registrar el pago');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  // Función para filtrar pagos
  const filtrarPagos = () => {
    return pagos.filter(pago => {
      const cumpleBusqueda = 
        pago.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.turno?.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.monto?.toString().includes(searchTerm);
      
      const cumpleFiltroMetodo = filtroMetodo === 'todos' || pago.metodo === filtroMetodo;
      
      return cumpleBusqueda && cumpleFiltroMetodo;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pagos</h1>
      
      {/* Filtros y búsqueda */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 mr-2">
            Filtro por método:
          </label>
          <select
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="todos">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar pagos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaPlus /> Nuevo Pago
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turno
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtrarPagos().map((pago) => (
              <tr key={pago._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${pago.monto.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {pago.metodo === 'efectivo' && <FaMoneyBillWave className="text-green-500" />}
                    {pago.metodo === 'tarjeta' && <FaCreditCard className="text-blue-500" />}
                    {pago.metodo === 'transferencia' && <FaExchangeAlt className="text-purple-500" />}
                    {pago.metodo.charAt(0).toUpperCase() + pago.metodo.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4">{pago.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pago.turno && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      {new Date(pago.turno.fecha).toLocaleDateString()}
                      <FaUser className="text-gray-400 ml-2" />
                      {pago.turno.cliente.nombre}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de nuevo pago */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nuevo Pago</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  value={nuevoPago.monto}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, monto: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <select
                  value={nuevoPago.metodo}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, metodo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turno
                </label>
                <select
                  value={nuevoPago.turnoId}
                  onChange={(e) => handleTurnoSelect(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccione un turno</option>
                  {turnos.map((turno) => (
                    <option key={turno._id} value={turno._id}>
                      {new Date(turno.fecha).toLocaleDateString()} - {turno.cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={nuevoPago.descripcion}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, descripcion: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <FaMoneyBillWave className="text-gray-400" />
              <span className="text-xl font-semibold text-green-400">{formatMonto(pago.monto)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400" />
              <span>{formatFecha(pago.turno.fecha)}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMetodoPagoColor(pago.metodo)}`}>
              {pago.metodo.charAt(0).toUpperCase() + pago.metodo.slice(1)}
            </span>
            {pago.descripcion && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-300">
                {pago.descripcion}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleEditPago(pago._id)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-300"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeletePago(pago._id)}
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
      title="Pagos"
      items={filteredPagos}
      onAdd={handleAddPago}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterOptions={filterOptions}
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      loading={loading}
      error={error}
      renderItem={renderPago}
      addButtonText="Registrar Pago"
    />
  );
};

export default Pagos;
