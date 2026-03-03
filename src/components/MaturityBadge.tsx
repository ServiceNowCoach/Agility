import { getMaturityColor } from '@/utils/scoring'
import type { MaturityLevel } from '@/types'

interface Props {
  label: MaturityLevel
  size?: 'sm' | 'md'
}

export default function MaturityBadge({ label, size = 'md' }: Props) {
  const color = getMaturityColor(label)
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${color} ${padding}`}>
      {label}
    </span>
  )
}
