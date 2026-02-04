import React from 'react';
import { Button } from './Button';
import { Menu, Stethoscope } from 'lucide-react';

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-dark">
            <div className="container mx-auto h-[var(--header-height)] flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="bg-white p-1.5 rounded-lg">
                        <Stethoscope className="text-[var(--primary)] w-6 h-6" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">
                        Consultas<span className="text-[var(--accent)]">24h</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
                    <a href="#como-funciona" className="hover:text-[var(--accent)] transition-colors">Como Funciona</a>
                    <a href="#beneficios" className="hover:text-[var(--accent)] transition-colors">Benefícios</a>
                    <a href="#precos" className="hover:text-[var(--accent)] transition-colors">Preços</a>
                </nav>

                {/* CTA */}
                <div className="hidden md:block">
                    <Button variant="primary" size="sm">
                        Área do Cliente
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white p-2">
                    <Menu className="w-7 h-7" />
                </button>
            </div>
        </header>
    );
};
