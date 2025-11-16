/**
 * Layout.tsx - Componente de layout principal
 * Novo design moderno - Mantém toda funcionalidade JavaScript intacta
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function Layout({ children, pageTitle = 'Biblioteca Escolar' }: LayoutProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Atualizar horário
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const showHelp = () => {
    const helpContent = `
      <h4>Ajuda - Biblioteca Escolar</h4>
      <p><strong>Navegação:</strong></p>
      <ul>
        <li>Use os botões grandes para navegar entre as seções</li>
        <li>Use os controles no topo para ajustar fonte e contraste</li>
        <li>Pressione Tab para navegar pelos elementos</li>
      </ul>
      <p><strong>Funcionalidades:</strong></p>
      <ul>
        <li><strong>Buscar Livros:</strong> Digite o título, autor ou ISBN</li>
        <li><strong>Empréstimos:</strong> Selecione usuário e exemplar disponível</li>
        <li><strong>Devoluções:</strong> Encontre o empréstimo e registre a devolução</li>
      </ul>
      <p><strong>Dicas:</strong></p>
      <ul>
        <li>Livros disponíveis aparecem em verde</li>
        <li>Livros emprestados aparecem em vermelho</li>
        <li>Empréstimos em atraso são destacados na página inicial</li>
      </ul>
    `;

    // Criar modal de ajuda
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ajuda</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${helpContent}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new (window as any).bootstrap.Modal(modal);
    bsModal.show();

    // Remover modal do DOM após fechar
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
    });
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* ===== HEADER SUPERIOR ===== */}
      <div className="navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
              📅 {currentTime}
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Sistema de Biblioteca Escolar
          </div>
        </div>
      </div>

      {/* ===== NAVBAR PRINCIPAL ===== */}
      <nav className="navbar navbar-expand-lg" style={{
        background: 'linear-gradient(90deg, #1f2937 0%, #111827 100%)',
        borderBottom: '3px solid #7c3aed',
        padding: '0'
      }}>
        <div className="container">
          <Link className="navbar-brand" href="/" style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            fontFamily: "'Poppins', sans-serif",
            background: 'linear-gradient(90deg, #7c3aed 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📚 Biblioteca
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Alternar navegação"
            style={{ borderColor: '#ffffff' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/"
                  style={{
                    color: router.pathname === '/' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  🏠 Início
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/livros"
                  style={{
                    color: router.pathname === '/livros' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/livros' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  🔍 Buscar Livros
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/emprestimos"
                  style={{
                    color: router.pathname === '/emprestimos' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/emprestimos' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  ✋ Empréstimos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/devolucoes"
                  style={{
                    color: router.pathname === '/devolucoes' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/devolucoes' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  ↩️ Devoluções
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/utentes"
                  style={{
                    color: router.pathname === '/utentes' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/utentes' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  👥 Utentes
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/relatorios"
                  style={{
                    color: router.pathname === '/relatorios' ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname === '/relatorios' ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  📊 Relatórios
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/admin"
                  style={{
                    color: router.pathname.startsWith('/admin') ? '#06b6d4' : '#ffffff',
                    fontWeight: router.pathname.startsWith('/admin') ? '600' : '500',
                    padding: '0.5rem 1rem'
                  }}
                >
                  ⚙️ Admin
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={showHelp}
                  title="Ajuda"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ffffff',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  ❓ Ajuda
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="flex-grow-1" style={{ padding: '2rem 0', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'linear-gradient(90deg, #1f2937 0%, #111827 100%)',
        color: '#ffffff',
        marginTop: 'auto',
        padding: '2rem 0',
        borderTop: '3px solid #7c3aed'
      }}>
        <div className="container">
          <div className="row" style={{ marginBottom: '1.5rem' }}>
            <div className="col-md-4" style={{ marginBottom: '1.5rem' }}>
              <h6 style={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                📚 Biblioteca Escolar
              </h6>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: '1.6' }}>
                Sistema moderno de gestão de acervo bibliotecário escolar
              </p>
            </div>
            <div className="col-md-4" style={{ marginBottom: '1.5rem' }}>
              <h6 style={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                🔗 Navegação
              </h6>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link href="/" style={{ color: '#0891b2', textDecoration: 'none', fontSize: '0.9rem' }}>Página Inicial</Link></li>
                <li><Link href="/livros" style={{ color: '#0891b2', textDecoration: 'none', fontSize: '0.9rem' }}>Buscar Livros</Link></li>
                <li><Link href="/admin" style={{ color: '#0891b2', textDecoration: 'none', fontSize: '0.9rem' }}>Administração</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 style={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                ✉️ Contato
              </h6>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                📧 biblioteca@escola.edu
              </p>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
                📞 (11) 1234-5678
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: 0 }}>
              &copy; {new Date().getFullYear()} Biblioteca Escolar. Todos os direitos reservados.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Design moderno | Desenvolvido com ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
