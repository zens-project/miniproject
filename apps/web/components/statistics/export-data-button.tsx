'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Button } from '@workspace/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { exportStatisticsData } from '@/store/slices/statistics.slice';
import { toast } from 'sonner';

export default function ExportDataButton() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.statistics);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      await dispatch(exportStatisticsData(format)).unwrap();
      toast.success(`Xuất dữ liệu ${format.toUpperCase()} thành công!`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <Download className="mr-2 h-4 w-4" />
        Xuất dữ liệu
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full right-0 mt-2 z-50 min-w-[200px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="p-2">
            <div className="text-sm font-medium text-white/80 px-3 py-2 mb-1">
              Chọn định dạng
            </div>
            
            <Button
              onClick={() => handleExport('csv')}
              disabled={isLoading}
              className="w-full justify-start text-left bg-transparent hover:bg-white/10 text-white border-0"
              size="sm"
            >
              <FileSpreadsheet className="mr-3 h-4 w-4 text-green-400" />
              <div>
                <div className="font-medium">Xuất CSV</div>
                <div className="text-xs text-white/60">Dữ liệu bảng tính</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleExport('pdf')}
              disabled={isLoading}
              className="w-full justify-start text-left bg-transparent hover:bg-white/10 text-white border-0"
              size="sm"
            >
              <FileText className="mr-3 h-4 w-4 text-red-400" />
              <div>
                <div className="font-medium">Xuất PDF</div>
                <div className="text-xs text-white/60">Báo cáo chi tiết</div>
              </div>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
