import Index from "./components/pages";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import MainLayout from "./components/layout/MainLayout";
import Login from "./components/auth/Login/Login";
import ProductCategories from "./components/biz/ProductsCategories/ProductCategories";
import SingleProduct from "./components/biz/SingleProduct/SingleProduct";
import Cart from "./components/biz/Cart/Cart";
import CartContextProvider from "./components/Context/CartContext/CartContextProvider";
import MyFavorites from "./components/MyFavorites/MyFavorites";
import FavoritesContextProvider from "./components/Context/FavoritesContext/favoritesContextProvider";
import AdminLayout from "./components/layout/Admin/AdminLayout";
import AdminDashboard from "./components/pages/AdminDashboard";
import AdminProducts from "./components/pages/AdminProducts";
import AdminProductsForm from "./components/pages/AdminProductsForm";
import AdminUsers from "./components/pages/AdminUsers";
import AdminContactGroups from "./components/pages/AdminContactGroups";
import CheckOut from "./components/pages/CheckOut";
import Payment from "./components/pages/Payment";
import Success from "./components/pages/Success";
import ContactUs from "./components/ContactUs/ContactUs";
import Protected from "./components/routes/protected/Protected";
import NotFound from "./components/routes/notFound/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddresContextProvider from "./components/Context/ShippingAddressContext/ShippingAddresContextProvider";
import HistoryOrders from "./components/biz/Orders/HistoryOrders";

function App() {
  return (
    <>
      <Sonner position="top-right" richColors />
      <CartContextProvider>
        <ShippingAddresContextProvider>
          <ToastContainer />
          <BrowserRouter>
            <FavoritesContextProvider>
              <Routes>
                {/* Rutas públicas y layout principal */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/my-cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/catalog" element={<ProductCategories />} />
                  <Route path="/product/:slug" element={<SingleProduct />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="*" element={<NotFound />} />

                  {/* Rutas protegidas para usuarios */}
                  <Route
                    element={
                      <Protected
                        allowedRoles={["user", "admin", "superadmin"]}
                      />
                    }
                  >
                    <Route path="/history-orders" element={<HistoryOrders />} />
                    <Route path="/my-favorites" element={<MyFavorites />} />
                    <Route path="/checkout" element={<CheckOut />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>

                {/* Rutas para el usuario con rol de admin y superadmin despues de haberse logueado */}
                <Route
                  element={<Protected allowedRoles={["admin", "superadmin"]} />}
                >
                  <Route element={<AdminLayout />}>
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route
                      path="/admin/products/new"
                      element={<AdminProductsForm />}
                    />
                    <Route
                      path="/admin/products/:id/edit"
                      element={<AdminProductsForm />}
                    />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route
                      path="/admin/contact-us/all"
                      element={<AdminContactGroups />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </FavoritesContextProvider>
          </BrowserRouter>
        </ShippingAddresContextProvider>
      </CartContextProvider>
    </>
  );
}

export default App;
