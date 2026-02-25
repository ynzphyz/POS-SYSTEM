'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { transactions, menuItems, employees } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function ReportsPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today')

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  // Calculate statistics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalOrders = transactions.length
  const averageOrderValue = totalRevenue / totalOrders
  const totalCustomers = new Set(transactions.map(t => t.customerName)).size

  // Payment method breakdown
  const paymentBreakdown = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total
    return acc
  }, {} as Record<string, number>)

  // Order type breakdown
  const orderTypeBreakdown = transactions.reduce((acc, t) => {
    acc[t.orderType] = (acc[t.orderType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Top selling items
  const itemSales = transactions.reduce((acc, t) => {
    t.itemsCount
    return acc
  }, {} as Record<string, number>)

  // Best performing cashiers
  const cashierPerformance = transactions.reduce((acc, t) => {
    if (!acc[t.cashierName]) {
      acc[t.cashierName] = { orders: 0, revenue: 0 }
    }
    acc[t.cashierName].orders += 1
    acc[t.cashierName].revenue += t.total
    return acc
  }, {} as Record<string, { orders: number; revenue: number }>)

  const topCashiers = Object.entries(cashierPerformance)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            <div className="flex gap-2">
              <Button 
                variant={period === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('today')}
              >
                Today
              </Button>
              <Button 
                variant={period === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('week')}
              >
                This Week
              </Button>
              <Button 
                variant={period === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('month')}
              >
                This Month
              </Button>
              <Button 
                variant={period === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('year')}
              >
                This Year
              </Button>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">12.5%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Orders</p>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">8.2%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Avg Order Value</p>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">3.1%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Customers</p>
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">15.3%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Methods */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {Object.entries(paymentBreakdown).map(([method, amount]) => {
                  const percentage = (amount / totalRevenue) * 100
                  return (
                    <div key={method}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">{method}</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Types */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Types</h3>
              <div className="space-y-4">
                {Object.entries(orderTypeBreakdown).map(([type, count]) => {
                  const percentage = (count / totalOrders) * 100
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type === 'dine-in' ? 'Dine In' : type === 'take-away' ? 'Take Away' : type}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{count} orders</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Cashiers */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Cashiers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCashiers.map(([name, data], index) => (
                    <tr key={name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{data.orders}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(data.revenue)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatCurrency(data.revenue / data.orders)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.slice(0, 6).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Badge variant={index < 3 ? 'default' : 'outline'}>#{index + 1}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
