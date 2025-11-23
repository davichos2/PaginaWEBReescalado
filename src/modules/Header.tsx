import { useState } from "react";


export default function Header() {
    const[menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-black text-white p-4 w-full">
            {/* Logo y Nombre del Proyecto */}
            <div className="flex items-center space-x-3">
                <img src="/escala.png" alt="Logo" className="w-10 h-10 items-center" />
                <h1 className="text-2xl font-bold whitespace-nowrap items-center">ImageScale AI</h1>
            </div>
        

            {/* Menú Hamburguesa */}
            <div className="block lg:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            
        </header>
    );
}
