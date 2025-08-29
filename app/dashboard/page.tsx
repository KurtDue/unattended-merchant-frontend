'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DashboardStats {
  todayVisitors: number
  weekVisitors: number
  doorStatus: 'locked' | 'unlocked'
  lastAccess: string
  activeCameras: number
  totalCameras: number
  systemStatus: 'online' | 'offline' | 'maintenance'
}

export default function DashboardPage() {
  const { user, selectedStore } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Simulate loading dashboard data
    const loadDashboard = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - in production this would come from your API
      setStats({
        todayVisitors: 24,
        weekVisitors: 156,
        doorStatus: 'locked',
        lastAccess: '2 hours ago',
        activeCameras: 3,
        totalCameras: 4,
        systemStatus: 'online'
      })
      
      setLoading(false)
    }

    loadDashboard()
  }, [user, router])

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" className="text-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  const quickActions = [
    {
      name: 'Door Access',
      description: 'Manage store entry',
      href: '/dashboard/doors',
      color: 'bg-green-500'
    },
    {
      name: 'Security Cameras',
      description: 'View live feeds',
      href: '/dashboard/cameras',
      color: 'bg-blue-500'
    },
    {
      name: 'Analytics',
      description: 'View detailed reports',
      href: '/dashboard/analytics',
      color: 'bg-purple-500'
    }
  ]

  const statusCards = [
    {
      title: 'Today\'s Visitors',
      value: stats?.todayVisitors.toString() || '0',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Week',
      value: stats?.weekVisitors.toString() || '0',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Door Status',
      value: stats?.doorStatus === 'locked' ? 'Locked' : 'Unlocked',
      color: stats?.doorStatus === 'locked' ? 'text-red-600' : 'text-green-600',
      bgColor: stats?.doorStatus === 'locked' ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Last Access',
      value: stats?.lastAccess || 'Never',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Overview</h1>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>{selectedStore?.name}</span>
            <span className="mx-2">•</span>
            <span>{selectedStore?.address}</span>
          </div>
        </div>

        {/* System Status Banner */}
        <div className="mb-8">
          <div className={`rounded-lg p-4 ${
            stats?.systemStatus === 'online' ? 'bg-green-50 border border-green-200' :
            stats?.systemStatus === 'maintenance' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div>
                <h3 className={`text-sm font-medium ${
                  stats?.systemStatus === 'online' ? 'text-green-800' :
                  stats?.systemStatus === 'maintenance' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  System Status: {stats?.systemStatus ? stats.systemStatus.charAt(0).toUpperCase() + stats.systemStatus.slice(1) : 'Unknown'}
                </h3>
                <p className={`text-sm ${
                  stats?.systemStatus === 'online' ? 'text-green-600' :
                  stats?.systemStatus === 'maintenance' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stats?.systemStatus === 'online' ? 'All systems operational' :
                   stats?.systemStatus === 'maintenance' ? 'Scheduled maintenance in progress' :
                   'System experiencing issues'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statusCards.map((card) => (
            <div key={card.title} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <div className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="card hover:shadow-lg transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <div className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Door access granted</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Entry ID: {selectedStore?.entryId}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Camera feed accessed</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Camera #1</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weekly report generated</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
