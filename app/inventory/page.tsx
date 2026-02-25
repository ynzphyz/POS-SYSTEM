'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle,
  TrendingDown,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react'
import { menuItems, stocks, categories } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function InventoryPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showStockDropdown, setShowStockDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const filteredItems = menuItems.filter(item => {
    let matches = true
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matches = matches && (
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      )
    }
    
    if (categoryFilter !== 'all') {
      matches = matches && item.category === categoryFilter
    }
    
    if (stockFilter === 'low') {
      matches = matches && item.stock > 0 && item.stock <= 20
    } else if (stockFilter === 'out') {
      matches = matches && item.stock === 0
    }
    
    return matches
  })

  const totalItems = menuItems.length
  const lowStockItems = menuItems.filter(item => item.stock > 0 && item.stock <= 20).length
  const outOfStockItems = menuItems.filter(item => item.stock === 0).length
  const totalValue = menuItems.reduce((sum, item) => sum + (item.costPrice * item.stock), 0)

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ]

  const stockOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out', label: 'Out of Stock' }
  ]

  const selectedCategoryLabel = categoryOptions.find(c => c.value === categoryFilter)?.label || 'All Categories'
  const selectedStockLabel = stockOptions.find(s => s.value === stockFilter)?.label || 'All Stock Levels'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <Button onClick={() => router.push('/inventory/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Items</p>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              <p className="text-xs text-gray-500 mt-1">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Low Stock</p>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
              <p className="text-xs text-gray-500 mt-1">Need restock soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Out of Stock</p>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
              <p className="text-xs text-gray-500 mt-1">Urgent restock</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Inventory Value</p>
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total cost value</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name or code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{selectedCategoryLabel}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setCategoryFilter(option.value)
                          setShowCategoryDropdown(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                          categoryFilter === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowStockDropdown(!showStockDropdown)}
                  className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{selectedStockLabel}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showStockDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showStockDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                    {stockOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStockFilter(option.value as any)
                          setShowStockDropdown(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                          stockFilter === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button variant="outline">
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sell Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => {
                    const stockStatus = item.stock === 0 ? 'out' : item.stock <= 20 ? 'low' : 'good'
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{item.code}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${
                            stockStatus === 'out' ? 'text-red-600' :
                            stockStatus === 'low' ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{item.unit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{formatCurrency(item.costPrice)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.price)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {stockStatus === 'out' ? (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          ) : stockStatus === 'low' ? (
                            <Badge variant="warning" className="text-xs">Low Stock</Badge>
                          ) : (
                            <Badge variant="success" className="text-xs">In Stock</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Raw Materials Stock */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Raw Materials Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((stock) => {
              const isLow = stock.currentStock <= stock.minStock
              
              return (
                <Card key={stock.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{stock.name}</h3>
                        <p className="text-xs text-gray-500">{stock.unit}</p>
                      </div>
                      {isLow && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-sm text-gray-500">Current</span>
                        <span className={`text-lg font-bold ${isLow ? 'text-orange-600' : 'text-green-600'}`}>
                          {stock.currentStock}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400">Min: {stock.minStock}</span>
                        {stock.lastRestocked && (
                          <span className="text-xs text-gray-400">
                            Last: {new Date(stock.lastRestocked).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
