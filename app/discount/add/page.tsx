'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { categories, menuItems } from '@/lib/mock-data'
import { Employee } from '@/lib/types'

export default function AddDiscountPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [selectedType, setSelectedType] = useState('percentage')
  const [selectedApplicableTo, setSelectedApplicableTo] = useState('all')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showApplicableDropdown, setShowApplicableDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const types = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'nominal', label: 'Fixed Amount ($)' },
  ]

  const applicableOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'category', label: 'Specific Category' },
    { value: 'item', label: 'Specific Items' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Promo/Discount created successfully! (This is a demo)')
    router.push('/discount')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/discount')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Promos
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Promo</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new discount or promotion</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Name <span className="text-red-500">*</span>
                  </label>
                  <Input placeholder="e.g., Weekend Special" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <Input placeholder="e.g., WEEKEND20" />
                  <p className="text-xs text-gray-500 mt-1">Optional code customers can use</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {types.find(t => t.value === selectedType)?.label}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showTypeDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                          {types.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setSelectedType(type.value)
                                setShowTypeDropdown(false)
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                selectedType === type.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder={selectedType === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'} 
                      step={selectedType === 'percentage' ? '1' : '0.01'}
                      min="0"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount
                  </label>
                  <Input type="number" placeholder="0.00" step="0.01" min="0" />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no minimum</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From <span className="text-red-500">*</span>
                    </label>
                    <Input type="date" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid To <span className="text-red-500">*</span>
                    </label>
                    <Input type="date" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <Input type="number" placeholder="e.g., 100" min="1" />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of times this promo can be used</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable To <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowApplicableDropdown(!showApplicableDropdown)}
                      className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {applicableOptions.find(a => a.value === selectedApplicableTo)?.label}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showApplicableDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showApplicableDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                        {applicableOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSelectedApplicableTo(option.value)
                              setShowApplicableDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                              selectedApplicableTo === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/discount')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Promo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
