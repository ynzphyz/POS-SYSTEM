'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, TrendingUp } from 'lucide-react'
import { shifts } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function ShiftPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [openingCash, setOpeningCash] = useState('500')
  const [closingCash, setClosingCash] = useState('')

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const currentShift = shifts.find(s => s.status === 'open' && s.cashierId === currentEmployee.id)
  const closedShifts = shifts.filter(s => s.status === 'closed')

  const handleOpenShift = () => {
    if (!openingCash || Number(openingCash) <= 0) {
      return
    }
    router.push('/')
  }

  const handleCloseShift = () => {
    if (!closingCash || Number(closingCash) <= 0) {
      return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shift Management</h1>

        {currentShift ? (
          <>
            {/* Current Shift Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cashier</p>
                    <p className="text-lg font-semibold text-gray-900">{currentShift.cashierName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Time</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(currentShift.openTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Opening Cash</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(currentShift.openingCash)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(currentShift.totalSales)}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Transactions</p>
                          <p className="text-xl font-bold text-gray-900">{currentShift.totalTransactions}</p>
                        </div>
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Expected Cash</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(currentShift.expectedCash)}</p>
                        </div>
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Close Shift Form */}
            <Card>
              <CardHeader>
                <CardTitle>Close Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Shift Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Cash Received</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentShift.totalCash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Non-Cash</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentShift.totalNonCash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Opening Cash</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentShift.openingCash)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-900">Expected Cash in Drawer</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(currentShift.expectedCash)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Actual Cash Count</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Closing Cash Amount
                        </label>
                        <Input
                          type="number"
                          placeholder="Enter actual cash in drawer"
                          value={closingCash}
                          onChange={(e) => setClosingCash(e.target.value)}
                        />
                      </div>

                      {closingCash && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Expected</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(currentShift.expectedCash)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Actual</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(Number(closingCash))}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-semibold text-gray-900">Difference</span>
                            <span className={`text-sm font-bold ${
                              Number(closingCash) - currentShift.expectedCash >= 0 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {formatCurrency(Number(closingCash) - currentShift.expectedCash)}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleCloseShift}
                        disabled={!closingCash}
                      >
                        Close Shift
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Open New Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <p className="text-sm text-gray-600 mb-4">
                  Start your shift by entering the opening cash balance in the register.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Opening Cash Balance
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter opening cash amount"
                      value={openingCash}
                      onChange={(e) => setOpeningCash(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleOpenShift}
                  >
                    Open Shift
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shift History */}
        {closedShifts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shift History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opening Cash</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Cash</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {closedShifts.map((shift) => (
                      <tr key={shift.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(shift.openTime).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{shift.cashierName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(shift.openTime)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {shift.closeTime ? formatDate(shift.closeTime) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(shift.openingCash)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {shift.closingCash ? formatCurrency(shift.closingCash) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {formatCurrency(shift.totalSales)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {shift.difference !== undefined && (
                            <span className={shift.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(shift.difference)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
