import React from 'react'
import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from '../layout/Footer';
function MainLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout