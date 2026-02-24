'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Plus } from 'lucide-react'
import { tables, orders } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Employee, TableStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { TABLE_STATUS_COLORS } from '@/lib/constants'

export default function TablePage() {
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

  const sections = ['A', 'B']
  
  const getTableOrder = (tableId: string) => {
    return orders.find(order => order.tableId === tableId)
  }

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return '✓'
      case 'occupied':
        return '●'
      case 'reserved':
        return '◐'
      case 'cleaning':
        return '◌'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          {currentEmployee.role === 'admin' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-red-100 border-2 border-red-300"></div>
            <span className="text-sm text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-sm text-gray-600">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-100 border-2 border-gray-300"></div>
            <span className="text-sm text-gray-600">Cleaning</span>
          </div>
        </div>

        {/* Tables by Section */}
        {sections.map((section) => {
          const sectionTables = tables.filter(t => t.section === section)
          
          return (
            <div key={section} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Section {section}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {sectionTables.map((table) => {
                  const order = getTableOrder(table.id)
                  
                  return (
                    <Card
                      key={table.id}
                      className={cn(
                        "cursor-pointer hover:shadow-lg transition-shadow border-2",
                        table.status === 'available' && "border-green-300",
                        table.status === 'occupied' && "border-red-300",
                        table.status === 'reserved' && "border-yellow-300",
                        table.status === 'cleaning' && "border-gray-300"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="text-center mb-3">
                          <div className={cn(
                            "h-16 w-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2",
                            table.status === 'available' && "bg-green-100 text-green-800",
                            table.status === 'occupied' && "bg-red-100 text-red-800",
                            table.status === 'reserved' && "bg-yellow-100 text-yellow-800",
                            table.status === 'cleaning' && "bg-gray-100 text-gray-800"
                          )}>
                            {table.number}
                          </div>
                          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{table.capacity}</span>
                          </div>
                        </div>

                        <Badge className={cn("w-full justify-center mb-2", TABLE_STATUS_COLORS[table.status])}>
                          {getStatusIcon(table.status)} {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </Badge>

                        {order && table.status === 'occupied' && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Order #{order.orderNumber}</p>
                            <p className="text-xs font-medium text-gray-900 mb-1">{order.customerName}</p>
                            <p className="text-xs text-gray-600 mb-2">{order.items.length} items</p>
                            <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</p>
                            <div className="flex space-x-1 mt-2">
                              <Link href={`/order/${order.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full text-xs">
                                  View
                                </Button>
                              </Link>
                              {order.status === 'waiting-payment' && (
                                <Link href={`/order/${order.id}/payment`} className="flex-1">
                                  <Button size="sm" className="w-full text-xs">
                                    Pay
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
