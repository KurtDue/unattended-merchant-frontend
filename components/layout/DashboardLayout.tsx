'use client'

import { Fragment } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  current?: boolean
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Door Access', href: '/dashboard/doors' },
  { name: 'Cameras', href: '/dashboard/cameras' },
  { name: 'Analytics', href: '/dashboard/analytics' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, selectedStore, setSelectedStore } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleStoreChange = (store: any) => {
    setSelectedStore(store)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Unattended</span>
              </div>
              
              {/* Desktop navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Store Selector */}
              {user?.stores && user.stores.length > 1 && (
                <div className="relative">
                  <select 
                    className="text-sm rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 transition-colors"
                    value={selectedStore?.id || ''}
                    onChange={(e) => {
                      const store = user.stores.find(s => s.id === e.target.value)
                      if (store) handleStoreChange(store)
                    }}
                  >
                    {user.stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* User menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
