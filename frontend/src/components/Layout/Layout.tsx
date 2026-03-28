import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-xl">Member Management</h1>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
