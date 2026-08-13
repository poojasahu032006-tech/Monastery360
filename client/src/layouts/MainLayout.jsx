import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="page-wrapper" role="main">
                {children}
            </main>
            <Footer />
        </>
    );
}
