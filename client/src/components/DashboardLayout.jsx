import { Outlet } from 'react-router-dom'
import { DashboardHeader } from './ui/dashboard-header'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
