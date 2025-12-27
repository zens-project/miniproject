'use client';

import { motion } from 'motion/react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@workspace/ui';
import { ProductFilters, ProductSortBy, PRODUCT_CATEGORIES } from '@/lib/types/products';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  isLoading?: boolean;
}

export default function ProductFiltersComponent({ 
  filters, 
  onFiltersChange, 
  isLoading = false 
}: ProductFiltersProps) {

  const handleSearchChange = (search: string) => {
    onFiltersChange({ search });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category as any });
  };

  const handleAvailabilityChange = (availability: string) => {
    onFiltersChange({ availability: availability as any });
  };

  const handleSortChange = (sortBy: ProductSortBy) => {
    onFiltersChange({ sortBy });
  };

  const toggleSortOrder = () => {
    onFiltersChange({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      availability: 'all',
      sortBy: ProductSortBy.NAME,
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.availability !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <h2 className="text-xl font-semibold text-white">
          Bộ lọc sản phẩm
        </h2>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            disabled={isLoading}
            className="ml-auto bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 text-sm"
            size="sm"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            <Search className="inline h-4 w-4 mr-2" />
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tên hoặc mô tả sản phẩm..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            <Filter className="inline h-4 w-4 mr-2" />
            Danh mục
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all"
          >
            <option value="" className="bg-gray-800 text-white">Tất cả danh mục</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value} className="bg-gray-800 text-white">
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Trạng thái
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all"
          >
            <option value="all" className="bg-gray-800 text-white">Tất cả</option>
            <option value="available" className="bg-gray-800 text-white">Có sẵn</option>
            <option value="unavailable" className="bg-gray-800 text-white">Hết hàng</option>
          </select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Sắp xếp
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as ProductSortBy)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all"
            >
              <option value={ProductSortBy.NAME} className="bg-gray-800 text-white">Tên</option>
              <option value={ProductSortBy.PRICE} className="bg-gray-800 text-white">Giá</option>
              <option value={ProductSortBy.CATEGORY} className="bg-gray-800 text-white">Danh mục</option>
              <option value={ProductSortBy.CREATED_AT} className="bg-gray-800 text-white">Ngày tạo</option>
            </select>
            <Button
              onClick={toggleSortOrder}
              disabled={isLoading}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 p-3"
              size="sm"
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-sm">
                Tìm: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-sm">
                {PRODUCT_CATEGORIES.find(cat => cat.value === filters.category)?.label}
              </span>
            )}
            {filters.availability !== 'all' && (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-200 border border-green-400/30 text-sm">
                {filters.availability === 'available' ? 'Có sẵn' : 'Hết hàng'}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
