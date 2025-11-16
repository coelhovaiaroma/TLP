/**
 * livros.tsx - Página de busca de livros
 * NOVO DESIGN MODERNO - Mantém toda lógica funcional intacta
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

interface Livro {
  li_cod: number;
  li_titulo: string;
  li_isbn?: string;
  li_ano?: number;
  autor?: { au_nome: string };
  editora?: { ed_nome: string };
  genero?: { ge_genero: string };
  total_exemplares: number;
  exemplares_disponiveis: number;
}

interface SearchResults {
  livros: Livro[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    resultsPerPage: number;
  };
}

export default function LivrosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar todos os livros quando a página carregar
  useEffect(() => {
    if (router.query.search) {
      const term = router.query.search as string;
      const page = router.query.page as string || '1';
      setSearchTerm(term);
      searchBooks(term, page);
    } else if (router.isReady) {
      loadAllBooks();
    }
  }, [router.query, router.isReady]);

  const loadAllBooks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/livros?limit=100');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar livros');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar livros');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (term: string, page: string = '1') => {
    if (!term.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/livros?search=${encodeURIComponent(term)}&page=${page}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar livros');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar livros');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/livros?search=${encodeURIComponent(searchTerm.trim())}&page=1`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (searchTerm.trim()) {
      router.push(`/livros?search=${encodeURIComponent(searchTerm.trim())}&page=${newPage}`);
    }
  };

  return (
    <Layout pageTitle="Buscar Livros - Biblioteca Escolar">
      {/* ===== HEADER SEÇÃO ===== */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '2.25rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🔍 Buscar Livros
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: 0 }}>
          Explore nosso acervo e encontre o livro que você está procurando
        </p>
      </div>

      {/* ===== FORMULÁRIO DE BUSCA ===== */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label htmlFor="search" style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Termo de Busca
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Título, autor, ISBN, editora ou gênero..."
                style={{
                  width: '100%',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 150ms ease-in-out'
                }} onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                }} onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
                autoFocus
              />
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: 0 }}>
                Dica: Você pode buscar por título, autor, ISBN, editora ou gênero
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 250ms ease-in-out',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }} onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                }
              }} onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? '⏳ Buscando...' : '🔍 Buscar'}
            </button>
          </div>
        </form>
      </div>

      {/* ===== MENSAGEM DE ERRO ===== */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '4px solid #ef4444',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#991b1b'
        }}>
          <p style={{ marginBottom: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* ===== RESULTADOS ===== */}
      {searchResults && (
        <>
          {/* Header de Resultados */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#111827'
            }}>
              {searchTerm ? `📊 Resultados para "${searchTerm}"` : '📚 Todos os Livros'}
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#6b7280',
              marginBottom: 0
            }}>
              {searchResults.pagination.totalResults} livro(s) {searchTerm ? 'encontrado(s)' : 'cadastrado(s)'}
            </p>
          </div>

          {searchResults.livros.length === 0 ? (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              color: '#1e40af'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                ℹ️ {searchTerm
                  ? `Nenhum livro encontrado para "${searchTerm}". Tente com outros termos.`
                  : 'Nenhum livro cadastrado no sistema.'}
              </p>
            </div>
          ) : (
            <>
              {/* Tabela de Livros */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem',
                overflowX: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(90deg, #7c3aed 0%, #0891b2 100%)',
                      color: '#ffffff'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Autor</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Editora</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ano</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gênero</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disponíveis</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.livros.map((livro) => (
                      <tr
                        key={livro.li_cod}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 150ms ease-in-out'
                        }} onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
                        }} onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>
                          {livro.li_titulo}
                          {livro.li_isbn && (
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                              ISBN: {livro.li_isbn}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{livro.autor?.au_nome || 'N/A'}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{livro.editora?.ed_nome || 'N/A'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>{livro.li_ano || 'N/A'}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{livro.genero?.ge_genero || 'N/A'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                            color: '#ffffff',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'inline-block'
                          }}>
                            {livro.total_exemplares}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {livro.exemplares_disponiveis > 0 ? (
                            <span style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                              color: '#ffffff',
                              padding: '0.375rem 0.875rem',
                              borderRadius: '16px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'inline-block'
                            }}>
                              ✓ {livro.exemplares_disponiveis}
                            </span>
                          ) : (
                            <span style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                              color: '#ffffff',
                              padding: '0.375rem 0.875rem',
                              borderRadius: '16px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'inline-block'
                            }}>
                              ✕ 0
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <Link href={`/livro/${livro.li_cod}`} style={{
                            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                            color: '#ffffff',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 150ms ease-in-out',
                            display: 'inline-block'
                          }} onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.4)';
                          }} onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                            👁️ Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {searchResults.pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  flexWrap: 'wrap'
                }}>
                  {searchResults.pagination.currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(searchResults.pagination.currentPage - 1)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#ffffff',
                        color: '#7c3aed',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 150ms ease-in-out'
                      }} onMouseOver={(e) => {
                        e.currentTarget.style.background = '#7c3aed';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#7c3aed';
                      }} onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#7c3aed';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      ← Anterior
                    </button>
                  )}

                  {Array.from({ length: searchResults.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const current = searchResults.pagination.currentPage;
                      return page >= current - 2 && page <= current + 2;
                    })
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: page === searchResults.pagination.currentPage ? 'none' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          background: page === searchResults.pagination.currentPage
                            ? 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)'
                            : '#ffffff',
                          color: page === searchResults.pagination.currentPage ? '#ffffff' : '#7c3aed',
                          cursor: 'pointer',
                          fontWeight: '600',
                          minWidth: '36px',
                          transition: 'all 150ms ease-in-out'
                        }} onMouseOver={(e) => {
                          if (page !== searchResults.pagination.currentPage) {
                            e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                          }
                        }} onMouseOut={(e) => {
                          if (page !== searchResults.pagination.currentPage) {
                            e.currentTarget.style.background = '#ffffff';
                          }
                        }}
                      >
                        {page}
                      </button>
                    ))}

                  {searchResults.pagination.currentPage < searchResults.pagination.totalPages && (
                    <button
                      onClick={() => handlePageChange(searchResults.pagination.currentPage + 1)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#ffffff',
                        color: '#7c3aed',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 150ms ease-in-out'
                      }} onMouseOver={(e) => {
                        e.currentTarget.style.background = '#7c3aed';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#7c3aed';
                      }} onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#7c3aed';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      Próximo →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ===== DICAS ===== */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '2px solid rgba(124, 58, 237, 0.2)',
        marginTop: '2rem'
      }}>
        <h3 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '1.125rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          💡 Dicas para Uma Busca Eficiente
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '1.5rem',
          color: '#374151',
          lineHeight: '1.8'
        }}>
          <li>Use palavras-chave do título do livro</li>
          <li>Digite o nome completo ou sobrenome do autor</li>
          <li>Para ISBN, digite apenas os números</li>
          <li>Busque por gênero: Romance, Ficção, História, etc.</li>
          <li>Use o nome da editora se souber</li>
        </ul>
      </div>
    </Layout>
  );
}
