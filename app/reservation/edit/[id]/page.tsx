'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { reservations } from '@/lib/mock-data'
import { tables } from '@/lib/mock-data'
import { Employee } from '@/lib/types'

export default function EditReservationPage() {
  const router = useRouter()
  const params = useParams()
  const reservationId = params.id as string
  
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [showTableDropdown, setShowTableDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))

    // Load reservation data
    const reservation = reservations.find(r => r.id === reservationId)
    if (reservation) {
      setCustomerName(reservation.customerName)
      setPhone(reservation.phone)
      setEmail(reservation.email || '')
      setDate(new Date(reservation.date).toISOString().split('T')[0])
      setTime(reservation.time)
      setPartySize(reservation.partySize.toString())
      setTableNumber(reservation.tableNumber || '')
      setNotes(reservation.notes || '')
    }
  }, [router, reservationId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/reservation')
  }

  if (!currentEmployee) return null

  const availableTables = tables.filter(t => t.status === 'available')

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
            <CardTitle>Edit Reservation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Party Size</label>
                  <Input
                    type="number"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    placeholder="Number of guests"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Table (Optional)</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTableDropdown(!showTableDropdown)}
                      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
                    >
                      <span className={tableNumber ? 'text-gray-900' : 'text-gray-500'}>
                        {tableNumber || 'Select table'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTableDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showTableDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                          onClick={() => {
                            setTableNumber('')
                            setShowTableDropdown(false)
                          }}
                        >
                          No table
                        </div>
                        {availableTables.map((table) => (
                          <div
                            key={table.id}
                            className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                              tableNumber === table.number ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setTableNumber(table.number)
                              setShowTableDropdown(false)
                            }}
                          >
                            {table.number} - {table.section} (Capacity: {table.capacity})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Special Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
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
                  Update Reservation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
