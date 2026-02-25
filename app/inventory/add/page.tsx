'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, X, ChevronDown } from 'lucide-react'
import { categories } from '@/lib/mock-data'
import { Employee } from '@/lib/types'
import Image from 'next/image'

export default function AddInventoryItemPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showUnitDropdown, setShowUnitDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const units = [
    { value: 'pcs', label: 'Pieces' },
    { value: 'glass', label: 'Glass' },
    { value: 'cup', label: 'Cup' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'plate', label: 'Plate' },
    { value: 'bowl', label: 'Bowl' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
  ]

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/inventory')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/inventory')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new item to inventory</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Item Image</h3>
                  
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Recommended: Square image, at least 500x500px
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Item Details</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Code <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="e.g., F013" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="e.g., Chocolate Cake" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                          >
                            <span className={selectedCategory ? 'text-gray-700' : 'text-gray-400'}>
                              {selectedCategory || 'Select category'}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCategoryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                              {categories.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.name)
                                    setShowCategoryDropdown(false)
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                    selectedCategory === cat.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                  }`}
                                >
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                            className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                          >
                            <span className={selectedUnit ? 'text-gray-700' : 'text-gray-400'}>
                              {units.find(u => u.value === selectedUnit)?.label || 'Select unit'}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUnitDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showUnitDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                              {units.map((unit) => (
                                <button
                                  key={unit.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedUnit(unit.value)
                                    setShowUnitDropdown(false)
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                    selectedUnit === unit.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                  }`}
                                >
                                  {unit.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Price <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" placeholder="0.00" step="0.01" min="0" required />
                        <p className="text-xs text-gray-500 mt-1">Purchase price per unit</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sell Price <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" placeholder="0.00" step="0.01" min="0" required />
                        <p className="text-xs text-gray-500 mt-1">Selling price per unit</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Initial Stock <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" placeholder="0" min="0" required />
                        <p className="text-xs text-gray-500 mt-1">Starting quantity</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter item description, ingredients, or special notes..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {statuses.find(s => s.value === selectedStatus)?.label}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showStatusDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                              {statuses.map((status) => (
                                <button
                                  key={status.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStatus(status.value)
                                    setShowStatusDropdown(false)
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                    selectedStatus === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                  }`}
                                >
                                  {status.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Stock Alert
                        </label>
                        <Input type="number" placeholder="20" min="0" />
                        <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/inventory')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
