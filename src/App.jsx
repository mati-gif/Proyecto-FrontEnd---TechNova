import Index from './components/pages'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login/Login';
import ProductCategories from './components/biz/ProductsCategories/ProductCategories';
// import ProductCard from './components/ProductCard/ProductCard';
import SingleProduct from './components/biz/SingleProduct/SingleProduct';

import { useState } from 'react';
import Register from './components/auth/Register/Register';
import Cart from './components/biz/Cart/Cart';
import CartContextProvider from './components/Context/CartContext/CartContextProvider';
import HeaderAdmin from './components/layout/Admin/HeaderAdmin';
import AdminLayout from './components/layout/Admin/AdminLayout';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminProducts from './components/pages/AdminProducts';
import AdminProductsForm from './components/pages/AdminProductsForm';
import AdminUsers from './components/pages/AdminUsers';
import UserLayout from './components/layout/UsuarioLayout/UserLayout';
import Orders from './components/biz/Orders/HistoryOrders';
import CheckOut from './components/pages/CheckOut';
import Payment from './components/pages/Payment';
import Success from './components/pages/Success';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  
  return (
    <>
    <CartContextProvider>
    <Sonner position="top-right" richColors />
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        {/* rutas para el usuario sin logguear */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/carrito"element={<Cart/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/catalog' element={<ProductCategories/>}/>
          <Route path='/product/:slug' element={<SingleProduct/>}/>
        </Route>
        {/* rutas para el usuario con rol de usuario (usuario comun) despues de haberse logueado */}
        <Route element={<UserLayout/>}>
          <Route path='/history-orders' element={<Orders/>}/>
          <Route path='/checkout' element={<CheckOut/>} />
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/success' element={<Success/>}/>
        </Route>


        {/* rutas para el usuario con role de admin y superadmin despues de haberse loggueado */}
        <Route  element={<AdminLayout />}>
        {/* <Route path={"/adminHeader"} element={<HeaderAdmin/>}/> */}
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/products' element={<AdminProducts/>}/>
          <Route  path='/admin/products/new' element={<AdminProductsForm/>}/>
          <Route  path='/admin/products/:id/edit' element={<AdminProductsForm/>}/>
          <Route  path='/admin/users' element={<AdminUsers/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </CartContextProvider>
    </>
  )
}

export default App
