'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { tables } from '@/lib/mock-data'
import { Employee } from '@/lib/types'

export default function AddReservationPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [selectedTable, setSelectedTable] = useState('')
  const [showTableDropdown, setShowTableDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const availableTables = tables.filter(t => t.status === 'available')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/reservation')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/reservation')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reservations
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">New Reservation</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new table reservation</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="Enter customer name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input type="tel" placeholder="+1234567890" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <Input type="date" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <Input type="time" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Size <span className="text-red-500">*</span>
                    </label>
                    <Input type="number" placeholder="Number of guests" min="1" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table (Optional)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTableDropdown(!showTableDropdown)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                      >
                        <span className={selectedTable ? 'text-gray-700' : 'text-gray-400'}>
                          {selectedTable ? `Table ${selectedTable}` : 'Select table'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTableDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showTableDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTable('')
                              setShowTableDropdown(false)
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 text-gray-400"
                          >
                            No table assigned
                          </button>
                          {availableTables.map((table) => (
                            <button
                              key={table.id}
                              type="button"
                              onClick={() => {
                                setSelectedTable(table.number)
                                setShowTableDropdown(false)
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                selectedTable === table.number ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              Table {table.number} - {table.section} ({table.capacity} seats)
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/reservation')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Reservation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
