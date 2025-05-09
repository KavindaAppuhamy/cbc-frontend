import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import ProductCard from './components/productCard'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import SignUpPage from './pages/signup'

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <div>
        <Routes path="/*">
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>    
      </div>
    </BrowserRouter>
  )
}

export default App
