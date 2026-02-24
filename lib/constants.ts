export const COLORS = {
  primary: '#3B82F6',
  success: '#22C55E',
  warning: '#F97316',
  danger: '#EF4444',
  purple: '#8B5CF6',
  background: '#F8FAFC',
  card: '#FFFFFF',
}

export const TAX_RATE = 0.11 // 11% PPN
export const SERVICE_CHARGE_RATE = 0.05 // 5% service charge

export const ORDER_STATUS_COLORS = {
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'ready': 'bg-green-100 text-green-800',
  'waiting-payment': 'bg-blue-100 text-blue-800',
  'completed': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800',
}

export const TABLE_STATUS_COLORS = {
  'available': 'bg-green-100 text-green-800 border-green-300',
  'occupied': 'bg-red-100 text-red-800 border-red-300',
  'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'cleaning': 'bg-gray-100 text-gray-800 border-gray-300',
}

export const RESERVATION_STATUS_COLORS = {
  'confirmed': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'cancelled': 'bg-red-100 text-red-800',
  'completed': 'bg-gray-100 text-gray-800',
}

export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'order', 'table', 'reservation', 'kitchen', 'history', 'reports', 'inventory', 'shift', 'discount', 'users', 'settings'],
  manager: ['dashboard', 'order', 'table', 'reservation', 'kitchen', 'history', 'reports', 'discount', 'shift'],
  cashier: ['dashboard', 'order', 'table', 'kitchen', 'shift'],
  waiter: ['dashboard', 'order', 'table', 'kitchen'],
  kitchen: ['kitchen'],
}

export const MENU_CATEGORIES = ['All', 'Food', 'Beverage', 'Additional']

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'qris', label: 'QRIS' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'mixed', label: 'Mixed Payment' },
]
