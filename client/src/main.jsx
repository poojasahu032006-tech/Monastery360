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
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: "'Noto Sans', 'Segoe UI', Arial, sans-serif",
                        boxShadow: 'var(--shadow-md)',
                    },
                    success: { iconTheme: { primary: 'var(--color-primary)', secondary: 'var(--bg-primary)' } },
                    error: { iconTheme: { primary: 'var(--color-accent)', secondary: 'var(--bg-primary)' } },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>
)
