'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@workspace/ui';
import { DateRange } from '@/lib/types/statistics';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  isLoading?: boolean;
}

export default function DateRangePicker({ dateRange, onChange, isLoading }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(
    dateRange.start.split('T')[0]
  );
  const [tempEndDate, setTempEndDate] = useState(
    dateRange.end.split('T')[0]
  );

  const presets = [
    {
      label: '7 ngày qua',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      }
    },
    {
      label: '30 ngày qua',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { start, end };
      }
    },
    {
      label: 'Tháng này',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date();
        return { start, end };
      }
    },
    {
      label: 'Tháng trước',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start, end };
      }
    }
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const { start, end } = preset.getValue();
    onChange({ start: start.toISOString(), end: end.toISOString() });
    setTempStartDate(start.toISOString().split('T')[0]);
    setTempEndDate(end.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleApply = () => {
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);
    onChange({ start: start.toISOString(), end: end.toISOString() });
    setIsOpen(false);
  };

  const formatDateRange = () => {
    return `${new Date(dateRange.start).toLocaleDateString('vi-VN')} - ${new Date(dateRange.end).toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDateRange()}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-0 mt-2 z-50 min-w-[320px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="text-sm bg-white/5 border-white/10 text-white hover:bg-white/20"
                  size="sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  min={tempStartDate}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  size="sm"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  size="sm"
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
