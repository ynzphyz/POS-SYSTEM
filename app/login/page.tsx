'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cloud, ChevronDown, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { employees } from '@/lib/mock-data'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0])
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num)
      setError('')
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  const handleStartShift = () => {
    if (pin.length !== 6) {
      setError('Please enter 6-digit PIN')
      return
    }

    if (pin !== selectedEmployee.pin) {
      setError('Invalid PIN')
      setPin('')
      return
    }

    localStorage.setItem('currentEmployee', JSON.stringify(selectedEmployee))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center space-x-2.5">
              <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center">
                <Cloud className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-gray-900">CloudPos</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Employee Login</h1>
          <p className="text-sm text-gray-500 text-center mb-10">Choose your account to start your shift.</p>

          {/* Employee Selector */}
          <div className="mb-8 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 hover:border-gray-300 transition-all flex items-center justify-between bg-white"
            >
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{selectedEmployee.name}</p>
                  <p className="text-xs text-gray-500">{selectedEmployee.shiftTime || '10:00 AM - 02:00 PM'}</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-72 overflow-y-auto">
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployee(emp)
                      setShowDropdown(false)
                      setPin('')
                      setError('')
                    }}
                    className="w-full px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.shiftTime || '10:00 AM - 02:00 PM'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PIN Input */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 text-center mb-5">Please input your PIN to validate yourself.</p>
            <div className="flex justify-center gap-2.5 mb-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: pin[i] ? '#3B82F6' : '#E5E7EB',
                    backgroundColor: pin[i] ? '#EFF6FF' : '#FFFFFF'
                  }}
                >
                  {pin[i] && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-xs text-red-500 text-center mb-2">{error}</p>
            )}
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium w-full text-center transition-colors">
              Forgot PIN?
            </button>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-14 text-xl font-semibold text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all border border-gray-200"
              >
                {num}
              </button>
            ))}
            <div className="col-start-2">
              <button
                onClick={() => handleNumberClick('0')}
                className="w-full h-14 text-xl font-semibold text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all border border-gray-200"
              >
                0
              </button>
            </div>
            <button
              onClick={handleDelete}
              className="h-14 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all border border-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Start Shift Button */}
          <button
            onClick={handleStartShift}
            disabled={pin.length !== 6}
            className="w-full h-14 text-base font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: pin.length === 6 ? '#3B82F6' : '#93C5FD',
              color: 'white'
            }}
          >
            Start Shift
          </button>
        </div>
      </div>

      {/* Right Side - Welcome Card */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Cloud className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gray-900">CloudPos</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to CloudPos</h2>
            <p className="text-sm text-gray-600 mb-8">
              Modern restaurant management system designed for efficiency and ease of use.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Easy Order Management</h3>
                  <p className="text-xs text-gray-600">Create and track orders with just a few clicks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Real-time Kitchen Display</h3>
                  <p className="text-xs text-gray-600">Keep your kitchen staff updated instantly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Comprehensive Reports</h3>
                  <p className="text-xs text-gray-600">Track sales and performance metrics</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-6">
            © 2024 CloudPos. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
