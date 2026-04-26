import Index from './components/pages'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from './components/layout/MainLayout';
function App() {


  return (
    <>
    <Sonner position="top-right" richColors />
    <BrowserRouter>
    <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
            </Route>
            
          </Routes>
      
    </BrowserRouter>
    </>
  )
}

export default App
