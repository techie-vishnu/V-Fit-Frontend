import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from './components/layout/AppLayout';
import Login from './components/user/Login';
import Logout from './components/user/Logout';
import { UserRoute } from './components/protectedPoutes/UserRoute';
import Dashboard from './components/pages/dashboard/Dashboard';
import Users from './components/pages/users/Users';
import NotFound from './components/notFound/NotFound';
import Memberships from './components/pages/membership/Memberships';
import MembershipPlans from './components/pages/membership/MembershipPlans';
import Workouts from './components/pages/Workouts';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<UserRoute><Dashboard /></UserRoute>} />

          <Route path="/workouts" element={<UserRoute allowedRoles={['Trainer', 'Admin']}><Workouts /></UserRoute>} />

          {/* Admin Only pages */}
          <Route path="/users" element={<UserRoute isAdmin={true}><Users /></UserRoute>} />
          <Route path="/memberships" element={<UserRoute isAdmin={true}><Memberships /></UserRoute>} />
          <Route path="/plans" element={<UserRoute isAdmin={true}><MembershipPlans /></UserRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
