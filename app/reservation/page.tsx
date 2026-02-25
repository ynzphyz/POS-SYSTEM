'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Users, Phone } from 'lucide-react'
import { reservations as initialReservations } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Employee, Reservation } from '@/lib/types'
import { StatusBadge } from '@/components/shared/status-badge'

export default function ReservationPage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  const handleConfirm = (reservationId: string) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'confirmed' as const }
          : res
      )
    )
  }

  const handleEdit = (reservationId: string) => {
    router.push(`/reservation/edit/${reservationId}`)
  }

  const handleDelete = (reservationId: string) => {
    setReservations(prev => prev.filter(res => res.id !== reservationId))
  }

  if (!currentEmployee) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <Button onClick={() => router.push('/reservation/add')}>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reservation.customerName}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>
                  <StatusBadge status={reservation.status} type="reservation" />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(reservation.date)} at {reservation.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{reservation.partySize} guests</span>
                  </div>
                  {reservation.tableNumber && (
                    <Badge variant="secondary">Table {reservation.tableNumber}</Badge>
                  )}
                </div>

                <div className="mb-3 min-h-[40px]">
                  {reservation.notes && (
                    <p className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                      {reservation.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9"
                    onClick={() => handleEdit(reservation.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm" 
                    className="flex-1 h-9"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    Delete
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-9"
                    onClick={() => handleConfirm(reservation.id)}
                  >
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
