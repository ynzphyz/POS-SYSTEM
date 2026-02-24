'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { orders } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
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

  const inProgressOrders = orders.filter(o => o.status === 'in-progress')
  const readyOrders = orders.filter(o => o.status === 'ready')
  const waitingPaymentOrders = orders.filter(o => o.status === 'waiting-payment')
  
  const totalEarning = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        employeeName={currentEmployee.name} 
        employeeRole={currentEmployee.role}
      />
      
      <div className="p-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Good Morning, {currentEmployee.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-600">Give your best services for customers, happy working</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Earning */}
          <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Total Earning</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarning)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* In Progress */}
          <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressOrders.length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Ready to Served */}
          <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Ready to Served</p>
                <p className="text-2xl font-bold text-gray-900">{readyOrders.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Waiting for Payment */}
          <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Waiting for Payment</p>
                <p className="text-2xl font-bold text-gray-900">{waitingPaymentOrders.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* In Progress Orders */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">In Progress</h2>
            <div className="space-y-4">
              {inProgressOrders.slice(0, 2).map((order) => (
                <Card key={order.id} className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900">Order# {order.orderNumber}</p>
                        <span className="text-gray-400">/</span>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-gray-300">
                          {order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer Name</p>
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-orange-600">{order.progress}%</span>
                      <span className="text-xs text-gray-500">In Progress •</span>
                      <span className="text-xs text-orange-600 font-medium">{order.items.length} Items</span>
                      <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Waiting for Payment Orders */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Waiting for Payment</h2>
            <div className="space-y-4">
              {waitingPaymentOrders.slice(0, 2).map((order) => (
                <Card key={order.id} className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900">Order# {order.orderNumber}</p>
                        <span className="text-gray-400">/</span>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 border-gray-300">
                          {order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer Name</p>
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Waiting for Payment</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* See All Order Button */}
        <div className="flex justify-center">
          <Link href="/order">
            <Button variant="outline" className="px-6">
              See All Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
