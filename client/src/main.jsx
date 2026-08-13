import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1A1F2C',
                        color: '#F0EDE8',
                        border: '1px solid rgba(201,135,58,0.3)',
                        fontFamily: "'Inter', sans-serif",
                    },
                    success: { iconTheme: { primary: '#C9873A', secondary: '#0D0F14' } },
                    error: { iconTheme: { primary: '#E84545', secondary: '#0D0F14' } },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>
)
