import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import type { CategoryScore } from '@/types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Props {
  scores: CategoryScore[]
  label?: string
}

export default function RadarChart({ scores, label = 'Maturity Score' }: Props) {
  const data = {
    labels: scores.map((s) => s.category),
    datasets: [
      {
        label,
        data: scores.map((s) => s.percent),
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 },
          color: '#94a3b8',
          backdropColor: 'transparent',
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.3)' },
        pointLabels: {
          font: { size: 12, weight: 'bold' as const },
          color: '#475569',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { formattedValue: string }) => ` ${ctx.formattedValue}%`,
        },
      },
    },
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  )
}
