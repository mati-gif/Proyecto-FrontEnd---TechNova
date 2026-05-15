import Index from './components/pages'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from './components/layout/MainLayout';
import Login from './components/Login/Login';
import ProductCategories from './components/ProductsCategories/ProductCategories';
import ProductCard from './components/ProductCard/ProductCard';
import SingleProduct from './components/SingleProduct/SingleProduct';

import { useState } from 'react';
import Register from './components/Register/Register';
import Cart from './components/Cart/Cart';
import CartContextProvider from './components/Context/CartContextProvider';
import HeaderAdmin from './components/layout/Admin/HeaderAdmin';
import AdminLayout from './components/layout/Admin/AdminLayout';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminProducts from './components/pages/AdminProducts';
import AdminProductsForm from './components/pages/AdminProductsForm';
import NotFound from './components/NotFound/NotFound';
import ContactUs from './components/ContactUs/ContactUs';
function App() {
  return (
    <>
    <CartContextProvider>
    <Sonner position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/cart"element={<Cart/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/catalog' element={<ProductCategories/>}/>
          <Route path='/product/:slug' element={<SingleProduct/>}/>
          <Route path='/contact-us' element={<ContactUs/>}/>
          <Route path="*" element={<NotFound/>} />
        </Route>
        <Route  element={<AdminLayout />}>
        {/* <Route path={"/adminHeader"} element={<HeaderAdmin/>}/> */}
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/products' element={<AdminProducts/>}/>
          <Route  path='/admin/products/new' element={<AdminProductsForm/>}/>
          <Route  path='/admin/products/:id/edit' element={<AdminProductsForm/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </CartContextProvider>
    </>
  )
}

export default App
