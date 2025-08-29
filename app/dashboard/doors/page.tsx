'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import axios from 'axios'

interface UnlockHistory {
  id: number
  timestamp: string
  requestedBy: string
  requestSource: string
  success: boolean
}

interface DoorStatus {
  isLocked: boolean
  lastAccess: string
  status: 'online' | 'offline'
}

export default function DoorsPage() {
  const { user, selectedStore } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [unlocking, setUnlocking] = useState(false)
  const [doorStatus, setDoorStatus] = useState<DoorStatus | null>(null)
  const [unlockHistory, setUnlockHistory] = useState<UnlockHistory[]>([])
  const [lastUnlockResult, setLastUnlockResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadDoorData()
  }, [user, router, selectedStore])

  const loadDoorData = async () => {
    setLoading(true)
    
    try {
      // Simulate door status check
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDoorStatus({
        isLocked: true,
        lastAccess: '2 hours ago',
        status: 'online'
      })

      // Mock unlock history
      setUnlockHistory([
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          requestedBy: user?.name || 'Unknown',
          requestSource: 'Web Portal',
          success: true
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          requestedBy: user?.name || 'Unknown',
          requestSource: 'Mobile App',
          success: true
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          requestedBy: 'Admin',
          requestSource: 'Web Portal',
          success: false
        }
      ])
    } catch (error) {
      console.error('Error loading door data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlockDoor = async () => {
    if (!selectedStore || unlocking) return

    setUnlocking(true)
    setLastUnlockResult(null)

    try {
      const response = await axios.post('https://openpath-api-prod.azurewebsites.net/api/unlock', {
        TenantKey: selectedStore.tenantKey,
        EntryId: selectedStore.entryId,
        RequestedBy: user?.name || 'Unknown',
        RequestSource: 'Web Portal'
      })

      if (response.data.success) {
        setLastUnlockResult({
          success: true,
          message: 'Door unlocked successfully!'
        })
        
        // Add to history
        const newEntry: UnlockHistory = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          requestedBy: user?.name || 'Unknown',
          requestSource: 'Web Portal',
          success: true
        }
        setUnlockHistory(prev => [newEntry, ...prev])
        
        // Update door status
        setDoorStatus(prev => prev ? {
          ...prev,
          isLocked: false,
          lastAccess: 'Just now'
        } : null)
        
        // Auto-relock after 5 seconds (simulation)
        setTimeout(() => {
          setDoorStatus(prev => prev ? {
            ...prev,
            isLocked: true
          } : null)
        }, 5000)
      } else {
        setLastUnlockResult({
          success: false,
          message: response.data.errorMessage || 'Failed to unlock door'
        })
      }
    } catch (error: any) {
      console.error('Unlock error:', error)
      setLastUnlockResult({
        success: false,
        message: error.response?.data?.errorMessage || 'Network error occurred'
      })
      
      // Add failed attempt to history
      const newEntry: UnlockHistory = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        requestedBy: user?.name || 'Unknown',
        requestSource: 'Web Portal',
        success: false
      }
      setUnlockHistory(prev => [newEntry, ...prev])
    } finally {
      setUnlocking(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" className="text-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Door Access Control</h1>
          <p className="mt-2 text-gray-600">
            Manage entry access for {selectedStore?.name}
          </p>
        </div>

        {/* Last Result Banner */}
        {lastUnlockResult && (
          <div className={`mb-6 rounded-lg p-4 ${
            lastUnlockResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <p className={`text-sm font-medium ${
                lastUnlockResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {lastUnlockResult.message}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Door Control Panel */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Front Door Control</h2>
              
              {/* Door Status */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-3 ${
                      doorStatus?.isLocked ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                      <span className="text-white text-sm">🔒</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {doorStatus?.isLocked ? 'Locked' : 'Unlocked'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status: {doorStatus?.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doorStatus?.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doorStatus?.status === 'online' ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Entry ID:</span>
                    <span className="ml-2 font-medium">{selectedStore?.entryId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Access:</span>
                    <span className="ml-2 font-medium">{doorStatus?.lastAccess}</span>
                  </div>
                </div>
              </div>

              {/* Unlock Button */}
              <div className="text-center">
                <button
                  onClick={handleUnlockDoor}
                  disabled={unlocking || doorStatus?.status === 'offline'}
                  className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                    unlocking || doorStatus?.status === 'offline'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {unlocking ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-3" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      🔓 Unlock Front Door
                    </>
                  )}
                </button>
                
                {doorStatus?.status === 'offline' && (
                  <p className="mt-2 text-sm text-red-600">
                    Door is offline and cannot be unlocked
                  </p>
                )}
                
                <p className="mt-4 text-sm text-gray-500">
                  Door will automatically lock again after 30 seconds
                </p>
              </div>
            </div>
          </div>

          {/* Door Information */}
          <div>
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Door Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{selectedStore?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entry ID:</span>
                  <span className="font-medium">{selectedStore?.entryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenant:</span>
                  <span className="font-medium">{selectedStore?.tenantKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">Main Entrance</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Successful Unlocks</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {unlockHistory.filter(h => h.success && 
                      new Date(h.timestamp).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Failed Attempts</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {unlockHistory.filter(h => !h.success && 
                      new Date(h.timestamp).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access History */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Access History</h2>
              <button
                onClick={loadDoorData}
                className="btn-secondary text-sm"
              >
                🔄 Refresh
              </button>
            </div>
            
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unlockHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          🕐 {formatTimestamp(entry.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          👤 {entry.requestedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.requestSource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
