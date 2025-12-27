'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Revenue, Expense } from '@/lib/types/statistics';

type RevenueChartData = { date: string; revenue: number; expense: number };

type RevenueChartProps = {
  revenues: Revenue[];
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

const crosshairPlugin = {
  id: 'crosshairLine',
  afterDatasetsDraw(chart: Chart) {
    const tooltip = chart.tooltip;
    if (!tooltip || !tooltip.getActiveElements().length) return;
    const { ctx, chartArea, scales } = chart;
    const active = tooltip.getActiveElements()[0];
    const x = scales?.x?.getPixelForValue(active?.index ?? 0) ?? 0;
    ctx.save();
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

Chart.register(crosshairPlugin);

export default function RevenueChart({ revenues, expenses, height = 320 }: RevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || (!revenues.length && !expenses.length)) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Group data by date
    const dateMap = new Map<string, { revenue: number; expense: number }>();
    
    revenues.forEach(rev => {
      const dateKey = new Date((rev as any).createdAt || (rev as any).date).toLocaleDateString('vi-VN');
      const existing = dateMap.get(dateKey) || { revenue: 0, expense: 0 };
      const amount = (rev as any).total || (rev as any).amount;
      dateMap.set(dateKey, { ...existing, revenue: existing.revenue + amount });
    });

    expenses.forEach(exp => {
      const dateKey = new Date(exp.date).toLocaleDateString('vi-VN');
      const existing = dateMap.get(dateKey) || { revenue: 0, expense: 0 };
      dateMap.set(dateKey, { ...existing, expense: existing.expense + exp.amount });
    });

    // Convert to chart data
    const chartData: RevenueChartData[] = Array.from(dateMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = chartData.map(d => d.date);
    const revenueValues = chartData.map(d => d.revenue);
    const expenseValues = chartData.map(d => d.expense);

    const chartConfig = {
      type: 'line' as const,
      data: {
        labels,
        datasets: [
          {
            label: 'Doanh thu',
            data: revenueValues,
            borderColor: '#10B981',
            borderWidth: 3,
            pointRadius: 6,
            pointHitRadius: 12,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            fill: true,
            tension: 0.35,
            backgroundColor: (context: any) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return 'rgba(16, 185, 129, 0.05)';
              }
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom,
              );
              gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
              gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
              return gradient;
            },
          },
          {
            label: 'Chi phí',
            data: expenseValues,
            borderColor: '#EF4444',
            borderWidth: 3,
            pointRadius: 6,
            pointHitRadius: 12,
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            fill: true,
            tension: 0.35,
            backgroundColor: (context: any) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return 'rgba(239, 68, 68, 0.05)';
              }
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom,
              );
              gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
              gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x',
        },
        layout: {
          padding: { left: 8, right: 8, top: 8, bottom: 8 },
        },
        scales: {
          x: {
            grid: { 
              display: false,
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              maxRotation: 0,
              autoSkip: true,
              font: {
                size: 12,
                weight: '500'
              }
            },
          },
          y: {
            beginAtZero: true,
            border: { width: 0 },
            grid: { 
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              callback: (v: any) => formatCurrencyVND(v as number),
              font: {
                size: 11,
                weight: '500'
              }
            },
          },
        },
        plugins: {
          legend: { 
            display: true,
            position: 'top' as const,
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 13,
                weight: '600'
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
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
                const i = items?.[0]?.dataIndex ?? 0;
                return `Ngày: ${labels[i]}`;
              },
              label: (item: any) => {
                const label = item.dataset.label;
                const value = formatCurrencyVND(item?.parsed?.y ?? 0);
                return `${label}: ${value}`;
              },
            },
          },
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
  }, [revenues, expenses]);

  return (
    <div
      style={{ height }}
      className="relative w-full rounded-xl bg-gradient-to-br from-amber-900/20 via-stone-900/10 to-neutral-900/20 backdrop-blur-sm border border-white/10 p-4"
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    </div>
  );
}
