'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { discounts } from '@/lib/mock-data'
import { Employee } from '@/lib/types'

export default function EditDiscountPage() {
  const router = useRouter()
  const params = useParams()
  const discountId = params.id as string
  
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percentage' | 'nominal'>('percentage')
  const [value, setValue] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validTo, setValidTo] = useState('')
  const [usageLimit, setUsageLimit] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))

    // Load discount data
    const discount = discounts.find(d => d.id === discountId)
    if (discount) {
      setName(discount.name)
      setCode(discount.code || '')
      setType(discount.type)
      setValue(discount.value.toString())
      setValidFrom(new Date(discount.validFrom).toISOString().split('T')[0])
      setValidTo(new Date(discount.validTo).toISOString().split('T')[0])
      setUsageLimit(discount.usageLimit ? discount.usageLimit.toString() : '')
      setStatus(discount.status)
    }
  }, [router, discountId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/discount')
  }

  if (!currentEmployee) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Promo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Promo Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter promo name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Promo Code</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Discount Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gray-900 capitalize">{type}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showTypeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div
                          className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                            type === 'percentage' ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setType('percentage')
                            setShowTypeDropdown(false)
                          }}
                        >
                          Percentage
                        </div>
                        <div
                          className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                            type === 'nominal' ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setType('nominal')
                            setShowTypeDropdown(false)
                          }}
                        >
                          Fixed Amount
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Discount Value {type === 'percentage' ? '(%)' : '(Rp)'}
                  </label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    min="0"
                    max={type === 'percentage' ? '100' : undefined}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Valid From</label>
                  <Input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Valid Until</label>
                  <Input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Usage Limit (Optional)</label>
                  <Input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gray-900 capitalize">{status}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showStatusDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div
                          className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                            status === 'active' ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setStatus('active')
                            setShowStatusDropdown(false)
                          }}
                        >
                          Active
                        </div>
                        <div
                          className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                            status === 'inactive' ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setStatus('inactive')
                            setShowStatusDropdown(false)
                          }}
                        >
                          Inactive
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Promo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
