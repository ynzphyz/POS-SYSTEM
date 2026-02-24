'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Minus, X } from 'lucide-react'
import { menuItems, tables } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Employee, OrderItem, OrderType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { TAX_RATE, SERVICE_CHARGE_RATE } from '@/lib/constants'

export default function CreateOrderPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [selectedTable, setSelectedTable] = useState('')
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const categories = ['All', 'Food', 'Beverage', 'Additional']
  
  const filteredMenuItems = menuItems.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const addItem = (menuItem: typeof menuItems[0]) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id)
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItemId === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setOrderItems([...orderItems, {
        id: `oi-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        status: 'pending'
      }])
    }
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * TAX_RATE
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE
  const total = subtotal - discount + tax + serviceCharge

  const handlePlaceOrder = () => {
    if (!customerName || orderItems.length === 0) {
      alert('Please enter customer name and add items')
      return
    }
    if (orderType === 'dine-in' && !selectedTable) {
      alert('Please select a table')
      return
    }
    alert('Order placed successfully!')
    router.push('/order')
  }

  const availableTables = tables.filter(t => t.status === 'available')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                        activeCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredMenuItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm font-bold text-blue-600 mb-2">{formatCurrency(item.price)}</p>
                      <Badge variant={item.stock > 0 ? 'success' : 'destructive'} className="text-xs mb-2">
                        {item.stock > 0 ? `Stock: ${item.stock}` : 'Out of Stock'}
                      </Badge>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => addItem(item)}
                        disabled={item.stock === 0}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Customer Name</label>
                    <Input
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Order Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrderType('dine-in')}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          orderType === 'dine-in'
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        Dine In
                      </button>
                      <button
                        onClick={() => setOrderType('take-away')}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          orderType === 'take-away'
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        Take Away
                      </button>
                    </div>
                  </div>

                  {orderType === 'dine-in' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Select Table</label>
                      <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Choose table...</option>
                        {availableTables.map((table) => (
                          <option key={table.id} value={table.id}>
                            Table {table.number} (Capacity: {table.capacity})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orderItems.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No items added</p>
                    ) : (
                      orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-6 w-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-6 w-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-24 h-8 text-right"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (11%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service (5%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Grand Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={orderItems.length === 0 || !customerName}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
