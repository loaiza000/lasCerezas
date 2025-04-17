import React from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const ListPage = ({
  title,
  items,
  onAdd,
  searchTerm,
  onSearchChange,
  filterOptions,
  selectedFilter,
  onFilterChange,
  loading,
  error,
  renderItem,
  addButtonText = 'Agregar Nuevo'
}) => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">{title}</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full md:w-64"
            />
          </div>

          {/* Filtro */}
          {filterOptions && (
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full md:w-48"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botón Agregar */}
          <button
            onClick={onAdd}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg hover:from-pink-600 hover:to-red-700 transition-all duration-300"
          >
            <FaPlus className="mr-2" />
            {addButtonText}
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-100 p-4 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Lista de items */}
      {!loading && !error && (
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No hay elementos para mostrar
            </div>
          ) : (
            items.map((item, index) => renderItem(item, index))
          )}
        </div>
      )}
    </div>
  );
};

export default ListPage;
