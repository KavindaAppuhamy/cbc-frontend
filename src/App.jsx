import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import AdminPage from './pages/adminPage'
import AdminLoginPage from './pages/admin/adminLogin'
import TestPage from './pages/testPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/register'
import ReviewPage from './pages/reviewPage'
import OtpVerificationPage from './pages/otpVerification'

function App() {

  return (
    <BrowserRouter>
      <div>
        <Toaster position='top-center'/>
        <Routes path="/*">
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/verify-otp" element={<OtpVerificationPage/>}/>
          <Route path='/testing' element={<TestPage/>}/>
          <Route path='/admin/login' element={<AdminLoginPage/>}/>
          <Route path='/admin/*' element={<AdminPage/>}/>
          <Route path='/reviews/*' element={<ReviewPage/>}/>
          <Route path='/*' element={<HomePage/>} />
        </Routes>    
      </div>
    </BrowserRouter>
  )
}

export default App
