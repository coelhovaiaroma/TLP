/**
 * Layout.tsx - Componente de layout principal
 * Substitui header.php e footer.php do PHP original
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
    <>
      {/* Barra de Acessibilidade Moderna */}
      <div className="accessibility-bar bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center py-2">
                <div className="accessibility-controls d-flex gap-2">
                </div>
                <div className="current-time text-muted fw-medium">
                  <i className="fas fa-clock me-1"></i>
                  <span>{currentTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary main-nav">
        <div className="container">
          <Link className="navbar-brand" href="/">
            <i className="fas fa-book me-2"></i>
            Biblioteca Escolar
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Alternar navegação"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/' ? 'active' : ''}`} href="/">
                  <i className="fas fa-home me-1"></i> Início
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/livros' ? 'active' : ''}`} href="/livros">
                  <i className="fas fa-search me-1"></i> Buscar Livros
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/emprestimos' ? 'active' : ''}`} href="/emprestimos">
                  <i className="fas fa-hand-holding me-1"></i> Empréstimos
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/devolucoes' ? 'active' : ''}`} href="/devolucoes">
                  <i className="fas fa-undo me-1"></i> Devoluções
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/utentes' ? 'active' : ''}`} href="/utentes">
                  <i className="fas fa-users me-1"></i> Utentes
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname === '/relatorios' ? 'active' : ''}`} href="/relatorios">
                  <i className="fas fa-chart-bar me-1"></i> Relatórios
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${router.pathname.startsWith('/admin') ? 'active' : ''}`} href="/admin">
                  <i className="fas fa-cog me-1"></i> Administração
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={showHelp}
                  title="Ajuda"
                  style={{ border: 'none', background: 'none' }}
                >
                  <i className="fas fa-question-circle me-1"></i> Ajuda
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Container Principal */}
      <main className="main-content">
        <div className="container-fluid py-4">
          {children}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="footer bg-light mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Sistema de Biblioteca Escolar</h5>
              <p>Desenvolvido para facilitar o acesso e gestão de livros na biblioteca.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h6>Contato</h6>
              <p>
                <i className="fas fa-envelope me-1"></i> biblioteca@escola.edu<br />
                <i className="fas fa-phone me-1"></i> (11) 1234-5678
              </p>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} Biblioteca Escolar. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
