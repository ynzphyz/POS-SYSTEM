'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, ChevronDown } from 'lucide-react'
import { employees } from '@/lib/mock-data'
import { Employee, Role } from '@/lib/types'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('cashier')
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    const emp = JSON.parse(empData)
    if (emp.role !== 'admin') {
      router.push('/')
      return
    }
    setCurrentEmployee(emp)

    // Load user data
    const user = employees.find(e => e.id === userId)
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      setRole(user.role)
      setPin(user.pin)
      setStatus(user.status)
    }
  }, [router, userId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/users')
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
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
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

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gray-900 capitalize">{role}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showRoleDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {(['admin', 'manager', 'cashier', 'waiter', 'kitchen'] as const).map((r) => (
                          <div
                            key={r}
                            className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors capitalize ${
                              role === r ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setRole(r)
                              setShowRoleDropdown(false)
                            }}
                          >
                            {r}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">PIN (6 digits)</label>
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                    required
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
                        {(['active', 'inactive'] as const).map((s) => (
                          <div
                            key={s}
                            className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors capitalize ${
                              status === s ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setStatus(s)
                              setShowStatusDropdown(false)
                            }}
                          >
                            {s}
                          </div>
                        ))}
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
                  Update User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
