'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { orders } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Employee } from '@/lib/types'
import { StatusBadge } from '@/components/shared/status-badge'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const order = orders.find(o => o.id === params.id)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
        <div className="p-6">
          <p>Order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Link href="/order">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} type="order" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="text-base font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Type</p>
                      <Badge variant="outline">{order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}</Badge>
                    </div>
                    {order.tableNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Table</p>
                        <p className="text-base font-medium text-gray-900">Table {order.tableNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <p className="text-base font-medium text-gray-900">{order.progress}%</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={
                              item.status === 'ready' ? 'success' :
                              item.status === 'cooking' ? 'warning' : 'secondary'
                            }>
                              {item.status}
                            </Badge>
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
                            <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-red-600">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (11%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge (5%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Grand Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {order.status === 'waiting-payment' && (
                    <Link href={`/order/${order.id}/payment`}>
                      <Button className="w-full" size="lg">
                        Pay Bills
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full">
                    Print Bill
                  </Button>
                  <Button variant="outline" className="w-full">
                    Edit Order
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
