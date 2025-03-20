import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from './components/layout/AppLayout';
import Login from './components/user/Login';
import Logout from './components/user/Logout';
import { UserRoute } from './components/protectedPoutes/UserRoute';
import Dashboard from './components/pages/Dashboard';
import Users from './components/pages/Users';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<UserRoute><Dashboard /></UserRoute>} />

          {/* Admin Only pages */}
          <Route path="/users" element={<UserRoute isAdmin={true}><Users /></UserRoute>} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
