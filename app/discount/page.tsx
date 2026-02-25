'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { discounts } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Employee } from '@/lib/types'

export default function DiscountPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discounts & Promos</h1>
          <Button onClick={() => router.push('/discount/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Promo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((discount) => (
            <Card key={discount.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{discount.name}</h3>
                    <p className="text-sm text-gray-600">{discount.code}</p>
                  </div>
                  <Badge variant={discount.status === 'active' ? 'success' : 'secondary'}>
                    {discount.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900 capitalize">{discount.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium text-gray-900">
                      {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until</span>
                    <span className="font-medium text-gray-900">{formatDate(discount.validTo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium text-gray-900">
                      {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="destructive" size="sm" className="flex-1">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
