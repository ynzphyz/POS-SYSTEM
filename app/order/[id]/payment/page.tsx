'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react'
import { orders } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Employee, PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [reference, setReference] = useState('')

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

  const change = cashReceived ? Number(cashReceived) - order.total : 0

  const handleConfirmPayment = () => {
    if (paymentMethod === 'cash' && (!cashReceived || Number(cashReceived) < order.total)) {
      alert('Cash received must be greater than or equal to total')
      return
    }
    if ((paymentMethod === 'debit' || paymentMethod === 'transfer') && !reference) {
      alert('Please enter reference number')
      return
    }
    alert('Payment confirmed successfully!')
    router.push('/order')
  }

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'qris', label: 'QRIS', icon: Smartphone },
    { value: 'debit', label: 'Debit Card', icon: CreditCard },
    { value: 'transfer', label: 'Bank Transfer', icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Link href={`/order/${order.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          paymentMethod === method.value
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <Icon className={cn(
                          "h-8 w-8 mx-auto mb-2",
                          paymentMethod === method.value ? "text-blue-600" : "text-gray-400"
                        )} />
                        <p className={cn(
                          "text-sm font-medium text-center",
                          paymentMethod === method.value ? "text-blue-600" : "text-gray-600"
                        )}>
                          {method.label}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {paymentMethod === 'cash' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Cash Received
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter cash amount"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                    </div>
                    {cashReceived && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Cash Received</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(Number(cashReceived))}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-semibold text-gray-900">Change</span>
                          <span className={`text-lg font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(change)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'qris' && (
                  <div className="text-center py-8">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-gray-400">QR Code Placeholder</p>
                    </div>
                    <p className="text-sm text-gray-600">Scan QR code to pay</p>
                  </div>
                )}

                {(paymentMethod === 'debit' || paymentMethod === 'transfer') && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Reference Number
                    </label>
                    <Input
                      placeholder="Enter reference number"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                  {order.tableNumber && (
                    <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
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
                    <span className="text-gray-600">Service (5%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Grand Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleConfirmPayment}
                >
                  Confirm Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
