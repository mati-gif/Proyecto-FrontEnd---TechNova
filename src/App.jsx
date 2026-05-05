import Index from './components/pages'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from './components/layout/MainLayout';
import Login from './components/Login/Login';
import ProductCategories from './components/ProductsCategories/ProductCategories';
import ProductCard from './components/ProductCard/ProductCard';
import SingleProduct from './components/SingleProduct/SingleProduct';

function App() {
  return (
    <>
    <Sonner position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/catalog' element={<ProductCategories/>}/>
          <Route path='/product/:slug' element={<SingleProduct/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
