import { Badge } from '@/components/ui/badge'
import { OrderStatus, TableStatus, ReservationStatus } from '@/lib/types'
import { ORDER_STATUS_COLORS, TABLE_STATUS_COLORS, RESERVATION_STATUS_COLORS } from '@/lib/constants'

interface StatusBadgeProps {
  status: OrderStatus | TableStatus | ReservationStatus
  type: 'order' | 'table' | 'reservation'
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getColorClass = () => {
    if (type === 'order') return ORDER_STATUS_COLORS[status as OrderStatus]
    if (type === 'table') return TABLE_STATUS_COLORS[status as TableStatus]
    return RESERVATION_STATUS_COLORS[status as ReservationStatus]
  }

  const getLabel = () => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <Badge className={getColorClass()}>
      {getLabel()}
    </Badge>
  )
}
