import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import useUserStore from './store'
import UserAccountPage from './pages/UserAccountPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AddEvent from './pages/AddEvent'
import EventPage from './pages/EventPage'
import CalendarView from './pages/CalendarView'
import OrderSummary from './pages/OrderSummary'
import PaymentSummary from './pages/PaymentSummary'
import TicketPage from './pages/TicketPage'
import AdminDashboard from './pages/AdminDashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './ProtectedRoute';

// axios.defaults.baseURL = 'http://localhost:4000/'
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true

function App() {
  // const fetchUser = useUserStore((state) => state.fetchUser)

  // console.log(fetchUser);
  // useEffect(() => {
  //   fetchUser() // User data ko fetch karne ke liye
  // }, [fetchUser])
  // const currentUser = useUserStore((state) => state.)

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route
          path='/useraccount'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/createEvent'
          element={
            <ProtectedRoute allowedRoles={['organizer' || 'admin']}>
              <AddEvent />
            </ProtectedRoute>
          }
        />

        <Route path='/dashboard' 
        element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/organizer/dashboard'
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/event/:id' element={<EventPage />} />
        <Route path='/calendar' element={<CalendarView />} />
        <Route
          path='/wallet'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <TicketPage />
            </ProtectedRoute>
          }
        />
        <Route path='/event/:id/ordersummary' element={<OrderSummary />} />
      </Route>

      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/event/:id/ordersummary/paymentsummary' element={<PaymentSummary />} />
    </Routes>
  )
}

export default App
