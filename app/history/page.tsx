'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Calendar, ChevronDown } from 'lucide-react'
import { transactions } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function HistoryPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const filteredTransactions = transactions.filter(trans => {
    let matches = true
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matches = matches && (trans.orderNumber.toLowerCase().includes(query) ||
             trans.customerName.toLowerCase().includes(query))
    }
    
    if (paymentFilter !== 'all') {
      matches = matches && trans.paymentMethod === paymentFilter
    }
    
    if (dateFilter) {
      const transDate = trans.date.toISOString().split('T')[0]
      matches = matches && transDate === dateFilter
    }
    
    return matches
  })

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = filteredTransactions.length
  const totalCash = filteredTransactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.total, 0)
  const totalNonCash = totalRevenue - totalCash

  const paymentMethods = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'qris', label: 'QRIS' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'transfer', label: 'Bank Transfer' },
  ]

  const selectedPaymentLabel = paymentMethods.find(p => p.value === paymentFilter)?.label || 'All Payment Methods'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              <p className="text-xs text-gray-500 mt-1">All payment methods</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Gross sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Cash Payments</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCash)}</p>
              <p className="text-xs text-gray-500 mt-1">{((totalCash/totalRevenue)*100).toFixed(1)}% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Non-Cash Payments</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalNonCash)}</p>
              <p className="text-xs text-gray-500 mt-1">{((totalNonCash/totalRevenue)*100).toFixed(1)}% of total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search Order ID or Customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                  className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{selectedPaymentLabel}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showPaymentDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPaymentDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => {
                          setPaymentFilter(method.value)
                          setShowPaymentDropdown(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                          paymentFilter === method.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((trans) => (
                    <tr key={trans.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{trans.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(trans.date)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{trans.customerName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{trans.tableNumber || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {trans.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{trans.itemsCount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(trans.total)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {trans.paymentMethod}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success" className="text-xs">
                          {trans.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
