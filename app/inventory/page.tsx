'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Employee } from '@/lib/types'

export default function InventoryPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">Inventory page - Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
