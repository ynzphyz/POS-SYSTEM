'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Employee } from '@/lib/types'

export default function AddTablePage() {
  const router = useRouter()
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [selectedSection, setSelectedSection] = useState('')
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)

  useEffect(() => {
    const empData = localStorage.getItem('currentEmployee')
    if (!empData) {
      router.push('/login')
      return
    }
    setCurrentEmployee(JSON.parse(empData))
  }, [router])

  if (!currentEmployee) return null

  const sections = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'VIP', label: 'VIP Section' },
    { value: 'Outdoor', label: 'Outdoor' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Table added successfully! (This is a demo)')
    router.push('/table')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar employeeName={currentEmployee.name} employeeRole={currentEmployee.role} />
      
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/table')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tables
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Table</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new table for your restaurant</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table Number <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="e.g., A7" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between text-sm"
                      >
                        <span className={selectedSection ? 'text-gray-700' : 'text-gray-400'}>
                          {sections.find(s => s.value === selectedSection)?.label || 'Select section'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showSectionDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSectionDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                          {sections.map((section) => (
                            <button
                              key={section.value}
                              type="button"
                              onClick={() => {
                                setSelectedSection(section.value)
                                setShowSectionDropdown(false)
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                selectedSection === section.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {section.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <Input type="number" placeholder="e.g., 4" min="1" required />
                  <p className="text-xs text-gray-500 mt-1">Number of people this table can accommodate</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/table')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Table
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
