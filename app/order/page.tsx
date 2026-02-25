'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, CheckCircle, DollarSign } from 'lucide-react'
import { orders } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Employee, Order } from '@/lib/types'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'

export default function OrderPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'ready' | 'waiting-payment'>('all')

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const stats = {
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    ready: orders.filter(o => o.status === 'ready').length,
    waitingPayment: orders.filter(o => o.status === 'waiting-payment').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <Button onClick={() => router.push('/order/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('in-progress')}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('ready')}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ready to Serve</p>
                <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('waiting-payment')}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Waiting Payment</p>
                <p className="text-2xl font-bold text-blue-600">{stats.waitingPayment}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Orders
          </Button>
          <Button
            variant={filter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </Button>
          <Button
            variant={filter === 'ready' ? 'default' : 'outline'}
            onClick={() => setFilter('ready')}
          >
            Ready
          </Button>
          <Button
            variant={filter === 'waiting-payment' ? 'default' : 'outline'}
            onClick={() => setFilter('waiting-payment')}
          >
            Waiting Payment
          </Button>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Create a new order to get started"
            actionLabel="New Order"
            onAction={() => router.push('/order/create')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/order/${order.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                    <StatusBadge status={order.status} type="order" />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {order.orderType === 'dine-in' ? 'Dine In' : 
                         order.orderType === 'take-away' ? 'Take Away' :
                         order.orderType === 'grab' ? 'Grab' : 'GoFood'}
                      </Badge>
                    </div>
                    {order.tableNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Table:</span>
                        <span className="font-medium">{order.tableNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Items:</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {order.status === 'in-progress' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
