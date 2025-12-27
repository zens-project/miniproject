'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Expense, ExpenseCategory } from '@/lib/types/statistics';

type ExpensePieChartProps = {
  expenses: Expense[];
  height?: number;
};

function formatCurrencyVND(n: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact'
  }).format(Math.round(n));
}

function getCategoryLabel(category: string): string {
  const mappings: Record<string, string> = {
    [ExpenseCategory.INGREDIENTS]: 'Nguyên liệu',
    [ExpenseCategory.RENT]: 'Thuê mặt bằng', 
    [ExpenseCategory.UTILITIES]: 'Điện nước',
    [ExpenseCategory.SALARY]: 'Lương',
    [ExpenseCategory.MARKETING]: 'Marketing',
    [ExpenseCategory.OTHER]: 'Khác',
    'Nguyên liệu': 'Nguyên liệu',
    'Thuê mặt bằng': 'Thuê mặt bằng',
    'Điện nước': 'Điện nước',
    'Lương nhân viên': 'Lương',
    'Marketing': 'Marketing',
    'Khác': 'Khác'
  };
  
  return mappings[category] || category || 'Không xác định';
}

const categoryColors = [
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#6B7280', // Gray
];

export default function ExpensePieChart({ expenses, height = 320 }: ExpensePieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !expenses.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const labels = Object.keys(categoryTotals).map(cat => getCategoryLabel(cat));
    const data = Object.values(categoryTotals);
    const total = data.reduce((sum, value) => sum + value, 0);

    const chartConfig = {
      type: 'doughnut' as const,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: categoryColors,
            borderColor: 'rgba(255, 255, 255, 0.8)',
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom' as const,
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 12,
                weight: '500'
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              generateLabels: (chart: any) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label: string, i: number) => {
                    const value = data.datasets[0].data[i];
                    const percentage = ((value / total) * 100).toFixed(1);
                    return {
                      text: `${label}: ${percentage}%`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor,
                      lineWidth: data.datasets[0].borderWidth,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            displayColors: true,
            padding: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FCD34D',
            bodyColor: '#ffffff',
            borderColor: 'rgba(252, 211, 77, 0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13,
              weight: '500'
            },
            callbacks: {
              title: (items: any) => {
                if (!items.length) return '';
                return items[0].label;
              },
              label: (item: any) => {
                const value = formatCurrencyVND(item.parsed);
                const percentage = ((item.parsed / total) * 100).toFixed(1);
                return `Số tiền: ${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
        },
        hover: {
          animationDuration: 200,
        },
      },
    };

    const chart = new Chart(canvasRef.current, chartConfig as any);
    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [expenses]);

  if (!expenses.length) {
    return (
      <div 
        style={{ height }}
        className="relative w-full rounded-xl bg-gradient-to-br from-amber-900/20 via-stone-900/10 to-neutral-900/20 backdrop-blur-sm border border-white/10 p-4 flex items-center justify-center"
      >
        <div className="text-center text-white/60">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-lg font-medium">Chưa có dữ liệu chi tiêu</p>
          <p className="text-sm">Thêm chi tiêu để xem biểu đồ</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height }}
      className="relative w-full rounded-xl bg-gradient-to-br from-amber-900/20 via-stone-900/10 to-neutral-900/20 backdrop-blur-sm border border-white/10 p-4"
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    </div>
  );
}
