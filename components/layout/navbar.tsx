'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Cloud, Home, ShoppingCart, Utensils, Calendar, ChefHat, History, BarChart3, Package, Clock, Tag, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLE_PERMISSIONS } from '@/lib/constants'
import { Role } from '@/lib/types'

const menuItems = [
  { href: '/', label: 'Dashboard', key: 'dashboard', icon: Home },
  { href: '/order', label: 'Order', key: 'order', icon: ShoppingCart },
  { href: '/table', label: 'Table', key: 'table', icon: Utensils },
  { href: '/reservation', label: 'Reservation', key: 'reservation', icon: Calendar },
  { href: '/kitchen', label: 'Kitchen', key: 'kitchen', icon: ChefHat },
  { href: '/history', label: 'History', key: 'history', icon: History },
  { href: '/reports', label: 'Reports', key: 'reports', icon: BarChart3 },
  { href: '/inventory', label: 'Inventory', key: 'inventory', icon: Package },
  { href: '/shift', label: 'Shift', key: 'shift', icon: Clock },
  { href: '/discount', label: 'Discount', key: 'discount', icon: Tag },
  { href: '/users', label: 'Users', key: 'users', icon: Users },
  { href: '/settings', label: 'Settings', key: 'settings', icon: Settings },
]

interface NavbarProps {
  employeeName?: string
  employeeRole?: Role
  employeeAvatar?: string
}

export function Navbar({ employeeName = 'Richardo', employeeRole = 'cashier', employeeAvatar }: NavbarProps) {
  const pathname = usePathname()
  const allowedPages = ROLE_PERMISSIONS[employeeRole] || []

  const filteredMenuItems = menuItems.filter(item => allowedPages.includes(item.key))

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">CloudPos</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-1">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2",
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {employeeName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                <p className="text-xs text-gray-500 capitalize">{employeeRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
