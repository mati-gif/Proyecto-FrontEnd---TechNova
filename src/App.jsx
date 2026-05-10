import Index from './components/pages'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from './components/layout/MainLayout';
import Login from './components/Login/Login';
import { useState } from 'react';
import Register from './components/Register/Register';
import Cart from './components/Cart/Cart';
import CartContextProvider from './components/Context/CartContextProvider';
function App() {

    const [isSignedIn, setIsSignedIn] = useState(false);

    const handleLogin = () =>{
      setIsSignedIn(true)
    }

  return (
    <>
    <CartContextProvider>
    <Sonner position="top-right" richColors />
    <BrowserRouter>
    <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/carrito"element={<Cart/>}/>
            </Route>
            <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
          </Routes>
      
    </BrowserRouter>
    </CartContextProvider>
    </>
  )
}

export default App
