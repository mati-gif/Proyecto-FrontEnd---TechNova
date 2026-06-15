import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContextProvider from './components/Context/AuthContext/AuthContextProvider.jsx';


createRoot(document.getElementById('root')).render(

    <AuthContextProvider>
        <App />
    </AuthContextProvider>
)
