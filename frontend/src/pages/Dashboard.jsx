import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-gray-100 mr-4">
        <Icon className={`w-6 h-6 ${color.replace('border-l-4', 'text')}`} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usuarios: 0,
    turnos: 0,
    pagos: 0,
    turnosPendientes: 0,
    turnosCompletados: 0,
    ingresosMensuales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      const [usuariosRes, turnosRes, pagosRes] = await Promise.all([
        fetch('http://localhost:3000/usuario', { headers }),
        fetch('http://localhost:3000/turno', { headers }),
        fetch('http://localhost:3000/pago', { headers })
      ]);

      if (!usuariosRes.ok || !turnosRes.ok || !pagosRes.ok) {
        throw new Error('Error al obtener datos del servidor');
      }

      const [usuariosData, turnosData, pagosData] = await Promise.all([
        usuariosRes.json(),
        turnosRes.json(),
        pagosRes.json()
      ]);

      const turnosCompletados = (turnosData.data || []).filter(turno => turno.estado === 'completado').length;
      const turnosPendientes = (turnosData.data || []).filter(turno => turno.estado === 'pendiente').length;
      const ingresosMensuales = (pagosData.data || []).reduce((total, pago) => total + (Number(pago.monto) || 0), 0);

      setStats({
        usuarios: (usuariosData.data || []).length,
        turnos: (turnosData.data || []).length,
        pagos: (pagosData.data || []).length,
        turnosPendientes,
        turnosCompletados,
        ingresosMensuales
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-100 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: FaUsers,
      title: 'Total Usuarios',
      value: stats.usuarios,
      color: 'border-blue-500'
    },
    {
      icon: FaCalendarAlt,
      title: 'Total Turnos',
      value: stats.turnos,
      color: 'border-green-500'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Total Pagos',
      value: stats.pagos,
      color: 'border-purple-500'
    },
    {
      icon: FaChartLine,
      title: 'Ingresos Mensuales',
      value: `$${stats.ingresosMensuales.toLocaleString()}`,
      color: 'border-yellow-500'
    },
    {
      icon: FaCheckCircle,
      title: 'Turnos Completados',
      value: stats.turnosCompletados,
      color: 'border-teal-500'
    },
    {
      icon: FaClock,
      title: 'Turnos Pendientes',
      value: stats.turnosPendientes,
      color: 'border-red-500'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
