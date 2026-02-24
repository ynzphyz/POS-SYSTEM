'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2 } from 'lucide-react'
import { orders } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import { Employee } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function KitchenPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!currentEmployee) return null

  const activeOrders = orders.filter(o => o.status === 'in-progress' || o.status === 'ready')

  const getElapsedTime = (orderDate: Date) => {
    const diff = Math.floor((currentTime.getTime() - orderDate.getTime()) / 1000 / 60)
    return diff
  }

  const getUrgencyColor = (minutes: number) => {
    if (minutes > 20) return 'bg-red-100 border-red-300'
    if (minutes > 10) return 'bg-yellow-100 border-yellow-300'
    return 'bg-green-100 border-green-300'
  }

  const newOrders = activeOrders.filter(o => o.progress < 50)
  const cookingOrders = activeOrders.filter(o => o.progress >= 50 && o.status === 'in-progress')
  const readyOrders = activeOrders.filter(o => o.status === 'ready')

  const renderOrderCard = (order: typeof orders[0]) => {
    const elapsed = getElapsedTime(order.createdAt)
    
    return (
      <Card key={order.id} className={cn("border-2", getUrgencyColor(elapsed))}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
              <p className="text-sm text-gray-600">
                {order.tableNumber ? `Table ${order.tableNumber}` : 'Take Away'}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={order.orderType === 'dine-in' ? 'default' : 'secondary'}>
                {order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
              </Badge>
              <div className="flex items-center space-x-1 mt-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(order.createdAt)}</span>
              </div>
              <p className={cn(
                "text-sm font-semibold mt-1",
                elapsed > 20 ? "text-red-600" : elapsed > 10 ? "text-yellow-600" : "text-green-600"
              )}>
                {elapsed} min ago
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.status === 'ready'}
                    className="h-5 w-5 rounded border-gray-300"
                    readOnly
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.notes && <p className="text-xs text-gray-500">{item.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={
                    item.status === 'ready' ? 'success' :
                    item.status === 'cooking' ? 'warning' : 'secondary'
                  }>
                    {item.status}
                  </Badge>
                  <span className="text-lg font-semibold text-gray-900">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Mark as Ready
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Display</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentTime.toLocaleTimeString()}
            </Badge>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              🔔 {activeOrders.length} Active Orders
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">New Order</h2>
              <Badge variant="secondary">{newOrders.length}</Badge>
            </div>
            <div className="space-y-4">
              {newOrders.map(renderOrderCard)}
            </div>
          </div>

          {/* Cooking */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cooking</h2>
              <Badge variant="warning">{cookingOrders.length}</Badge>
            </div>
            <div className="space-y-4">
              {cookingOrders.map(renderOrderCard)}
            </div>
          </div>

          {/* Ready to Serve */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ready to Serve</h2>
              <Badge variant="success">{readyOrders.length}</Badge>
            </div>
            <div className="space-y-4">
              {readyOrders.map(renderOrderCard)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
