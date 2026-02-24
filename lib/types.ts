export type Role = 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen'

export type OrderStatus = 'in-progress' | 'ready' | 'waiting-payment' | 'completed' | 'cancelled'

export type OrderType = 'dine-in' | 'take-away' | 'grab' | 'gofood'

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning'

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export type PaymentMethod = 'cash' | 'qris' | 'debit' | 'transfer' | 'mixed'

export type ItemStatus = 'pending' | 'cooking' | 'ready'

export type DiscountType = 'percentage' | 'nominal'

export interface Employee {
  id: string
  name: string
  role: Role
  email: string
  phone: string
  pin: string
  avatar?: string
  shiftTime?: string
  status: 'active' | 'inactive'
  lastLogin?: Date
}

export interface MenuItem {
  id: string
  code: string
  name: string
  category: string
  price: number
  costPrice: number
  image?: string
  description?: string
  stock: number
  unit: string
  status: 'active' | 'inactive'
}

export interface Category {
  id: string
  name: string
  description?: string
  itemCount: number
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
  status: ItemStatus
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customerName: string
  tableId?: string
  tableNumber?: string
  orderType: OrderType
  items: OrderItem[]
  subtotal: number
  discount: number
  discountType?: DiscountType
  tax: number
  serviceCharge: number
  total: number
  status: OrderStatus
  progress: number
  createdAt: Date
  updatedAt: Date
  cashierId: string
  notes?: string
  paymentMethod?: PaymentMethod
  paidAt?: Date
}

export interface Table {
  id: string
  number: string
  section: string
  capacity: number
  status: TableStatus
  currentOrderId?: string
  currentOrder?: Order
}

export interface Reservation {
  id: string
  customerName: string
  phone: string
  date: Date
  time: string
  partySize: number
  tableId?: string
  tableNumber?: string
  status: ReservationStatus
  notes?: string
  createdAt: Date
}

export interface Shift {
  id: string
  cashierId: string
  cashierName: string
  openTime: Date
  closeTime?: Date
  openingCash: number
  closingCash?: number
  expectedCash: number
  totalSales: number
  totalCash: number
  totalNonCash: number
  totalTransactions: number
  difference?: number
  status: 'open' | 'closed'
}

export interface Transaction {
  id: string
  orderNumber: string
  date: Date
  cashierId: string
  cashierName: string
  customerName: string
  tableNumber?: string
  orderType: OrderType
  itemsCount: number
  subtotal: number
  discount: number
  tax: number
  serviceCharge: number
  total: number
  paymentMethod: PaymentMethod
  status: 'completed' | 'refunded'
}

export interface Discount {
  id: string
  name: string
  code?: string
  type: DiscountType
  value: number
  minOrderAmount?: number
  validFrom: Date
  validTo: Date
  usageLimit?: number
  usageCount: number
  applicableTo: 'all' | 'category' | 'item'
  applicableItems?: string[]
  status: 'active' | 'inactive'
}

export interface Stock {
  id: string
  name: string
  unit: string
  currentStock: number
  minStock: number
  lastRestocked?: Date
}

export interface DashboardStats {
  totalEarning: number
  inProgress: number
  readyToServe: number
  waitingPayment: number
  totalOrders: number
  averageOrderValue: number
}

export interface Payment {
  orderId: string
  method: PaymentMethod
  amount: number
  cashReceived?: number
  change?: number
  reference?: string
  splitPayments?: {
    method: PaymentMethod
    amount: number
  }[]
}
