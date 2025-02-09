import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage  from './components/Login'
import RegisterPage from './components/Register'
import axios from 'axios';
import {Toaster} from 'react-hot-toast'
import UserContextProvider from '../context/userContext'
import Dashboard from './components/Dashboard'
import Movies from './components/Movies'
import Studies from './components/Studies'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true



const App = () => {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Navbar/>
          
            <Toaster position='bottom-right' toastOptions={{duration : 3000} }/>
              <Routes>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/movies' element={<Movies/>}/>
                <Route path='/studies' element={<Studies/>}/>

                
              </Routes>
        </BrowserRouter>
      </UserContextProvider>
      
      
    </>
  )
}

export default App