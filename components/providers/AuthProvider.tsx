'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  stores: Store[]
  role: 'merchant' | 'admin'
}

interface Store {
  id: string
  name: string
  tenantKey: string
  entryId: string
  address: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  selectedStore: Store | null
  setSelectedStore: (store: Store) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users data
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'demo@joker.com',
    name: 'Demo Joker Manager',
    role: 'merchant',
    stores: [
      {
        id: '1',
        name: 'Demo Joker Store',
        tenantKey: 'demo-joker',
        entryId: '390250',
        address: 'Møterom Tunsberg',
        isActive: true
      }
    ]
  },
  {
    id: '2',
    email: 'admin@unattended.com',
    name: 'System Administrator',
    role: 'admin',
    stores: [
      {
        id: '1',
        name: 'Demo Joker Store',
        tenantKey: 'demo-joker',
        entryId: '390250',
        address: 'Møterom Tunsberg',
        isActive: true
      },
      {
        id: '2',
        name: 'Main Store',
        tenantKey: 'main-store',
        entryId: 'entry-002',
        address: 'Main Street 123',
        isActive: true
      }
    ]
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user')
    const storedStore = localStorage.getItem('selectedStore')
    
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      
      if (storedStore) {
        setSelectedStore(JSON.parse(storedStore))
      } else if (userData.stores.length > 0) {
        setSelectedStore(userData.stores[0])
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo authentication - in production, this would be a real API call
    const user = DEMO_USERS.find(u => u.email === email)
    
    if (user && password === 'demo123') {
      setUser(user)
      setSelectedStore(user.stores[0] || null)
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      if (user.stores[0]) {
        localStorage.setItem('selectedStore', JSON.stringify(user.stores[0]))
      }
      
      setLoading(false)
      return true
    }
    
    setLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    setSelectedStore(null)
    localStorage.removeItem('user')
    localStorage.removeItem('selectedStore')
  }

  const handleSetSelectedStore = (store: Store) => {
    setSelectedStore(store)
    localStorage.setItem('selectedStore', JSON.stringify(store))
  }

  const value = {
    user,
    login,
    logout,
    loading,
    selectedStore,
    setSelectedStore: handleSetSelectedStore
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
