'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Calendar, X, ArrowUpDown, Coffee, DollarSign, Building, Zap, Users, Megaphone, MoreHorizontal } from 'lucide-react';
import { Button } from '@workspace/ui';
import { ExpenseCategory, ExpenseFilters, ExpenseSortBy } from '@/lib/types/expenses';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: Partial<ExpenseFilters>) => void;
  isLoading?: boolean;
}

export default function ExpenseFiltersComponent({ filters, onFiltersChange, isLoading }: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { 
      value: '', 
      label: 'Tất cả danh mục',
      icon: <Filter className="h-4 w-4" />,
      color: 'text-gray-400'
    },
    { 
      value: ExpenseCategory.INGREDIENTS, 
      label: 'Nguyên liệu',
      icon: <Coffee className="h-4 w-4" />,
      color: 'text-amber-400'
    },
    { 
      value: ExpenseCategory.RENT, 
      label: 'Thuê mặt bằng',
      icon: <Building className="h-4 w-4" />,
      color: 'text-blue-400'
    },
    { 
      value: ExpenseCategory.UTILITIES, 
      label: 'Điện nước',
      icon: <Zap className="h-4 w-4" />,
      color: 'text-yellow-400'
    },
    { 
      value: ExpenseCategory.SALARY, 
      label: 'Lương nhân viên',
      icon: <Users className="h-4 w-4" />,
      color: 'text-green-400'
    },
    { 
      value: ExpenseCategory.MARKETING, 
      label: 'Marketing',
      icon: <Megaphone className="h-4 w-4" />,
      color: 'text-pink-400'
    },
    { 
      value: ExpenseCategory.OTHER, 
      label: 'Khác',
      icon: <MoreHorizontal className="h-4 w-4" />,
      color: 'text-purple-400'
    },
  ];

  const sortOptions = [
    { value: ExpenseSortBy.DATE, label: 'Ngày tạo' },
    { value: ExpenseSortBy.AMOUNT, label: 'Số tiền' },
    { value: ExpenseSortBy.CATEGORY, label: 'Danh mục' },
    { value: ExpenseSortBy.CREATED_AT, label: 'Thời gian tạo' },
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handleCategoryChange = (value: ExpenseCategory | '') => {
    onFiltersChange({ category: value });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFiltersChange({ 
      [field]: value ? new Date(value) : null 
    });
  };

  const handleSortChange = (sortBy: ExpenseSortBy) => {
    onFiltersChange({ sortBy });
  };

  const handleSortOrderToggle = () => {
    onFiltersChange({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      dateFrom: null,
      dateTo: null,
      sortBy: ExpenseSortBy.DATE,
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.dateFrom || filters.dateTo;

  const selectedCategoryOption = categoryOptions.find(opt => opt.value === filters.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/20 bg-white/10 p-4 md:p-6 shadow-xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          <h3 className="text-lg font-semibold text-white">Bộ lọc & Tìm kiếm</h3>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          size="sm"
        >
          <Filter className="mr-2 h-4 w-4" />
          {isExpanded ? 'Thu gọn' : 'Mở rộng'}
        </Button>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm mô tả..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
            {selectedCategoryOption?.icon}
          </div>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory | '')}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as ExpenseSortBy)}
            disabled={isLoading}
            className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <Button
            onClick={handleSortOrderToggle}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-3"
            size="sm"
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 border-t border-white/10 pt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Từ ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <input
                  type="date"
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Đến ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <input
                  type="date"
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('dateTo', e.target.value)}
                  min={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mt-4 pt-4 border-t border-white/10"
        >
          <Button
            onClick={clearFilters}
            disabled={isLoading}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm"
            size="sm"
          >
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        </motion.div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10"
        >
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Tìm kiếm: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-2 text-blue-300 hover:text-blue-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-200 border border-green-400/30">
              Danh mục: {selectedCategoryOption?.label}
              <button
                onClick={() => handleCategoryChange('')}
                className="ml-2 text-green-300 hover:text-green-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {(filters.dateFrom || filters.dateTo) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Thời gian: {filters.dateFrom?.toLocaleDateString('vi-VN') || '...'} - {filters.dateTo?.toLocaleDateString('vi-VN') || '...'}
              <button
                onClick={() => {
                  handleDateChange('dateFrom', '');
                  handleDateChange('dateTo', '');
                }}
                className="ml-2 text-purple-300 hover:text-purple-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
