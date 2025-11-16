/**
 * index.tsx - Página inicial da biblioteca
 * NOVO DESIGN MODERNO - Mantém toda lógica funcional intacta
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

interface EmprestimoAtraso {
  re_cod: number;
  li_titulo: string;
  ut_nome: string;
  re_data_prevista: string;
}

interface ReservaPendente {
  res_cod: number;
  li_titulo: string;
  ut_nome: string;
  res_data: string;
}

export default function HomePage() {
  const [emprestimosAtraso, setEmprestimosAtraso] = useState<EmprestimoAtraso[]>([]);
  const [reservasPendentes, setReservasPendentes] = useState<ReservaPendente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEmprestimosAtraso(), fetchReservasPendentes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchEmprestimosAtraso = async () => {
    try {
      const res = await fetch('/api/requisicoes?status=ativo');
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Falha ao carregar requisições');
      }

      const hoje = new Date();
      const emprestimos = (json.data || [])
        .filter((item: any) => {
          const dataPrevista = new Date(item.re_data_prevista);
          return dataPrevista < hoje && !item.re_data_devolucao;
        })
        .map((item: any) => ({
          re_cod: item.re_cod,
          li_titulo: item.exemplar?.livro?.li_titulo || 'Livro',
          ut_nome: item.utente?.ut_nome || 'Utente',
          re_data_prevista: item.re_data_prevista,
        }));

      setEmprestimosAtraso(emprestimos);
    } catch (error) {
      console.error('Erro ao buscar empréstimos em atraso:', error);
    }
  };

  const fetchReservasPendentes = async () => {
    try {
      const { data, error } = await import('../lib/supabase').then(({ supabase }) =>
        supabase
          .from('reserva')
          .select(`
            res_cod,
            res_data,
            utente!res_ut_cod (
              ut_cod,
              ut_nome
            ),
            livro!res_li_cod (
              li_cod,
              li_titulo,
              autor!li_autor (
                au_nome
              )
            )
          `)
          .eq('res_status', 'pendente')
      );

      if (error) {
        console.error('Erro ao buscar reservas pendentes:', error);
        return;
      }

      const reservas = (data || []).map((item: any) => {
        const livro = Array.isArray(item.livro) ? item.livro[0] : item.livro;
        const autor = Array.isArray(livro?.autor) ? livro.autor[0] : livro?.autor;
        return {
          res_cod: item.res_cod,
          li_titulo: livro?.li_titulo || 'Livro',
          ut_nome: item.utente?.ut_nome || 'Utente',
          res_data: item.res_data,
        };
      });

      setReservasPendentes(reservas);
    } catch (error) {
      console.error('Erro ao buscar reservas pendentes:', error);
    }
  };

  const handleAprovarReserva = async (reservaId: number) => {
    try {
      const response = await fetch(`/api/reservas/${reservaId}/aprovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Reserva aprovada e empréstimo criado com sucesso!');
        fetchReservasPendentes();
        fetchEmprestimosAtraso();
      } else {
        alert(result.error || 'Erro ao aprovar reserva');
      }
    } catch (error) {
      console.error('Erro ao aprovar reserva:', error);
      alert('Erro ao aprovar reserva');
    }
  };

  const handleRejeitarReserva = async (reservaId: number) => {
    try {
      const { error } = await import('../lib/supabase').then(({ supabase }) =>
        supabase
          .from('reserva')
          .update({ res_status: 'rejeitada' })
          .eq('res_cod', reservaId)
      );

      if (error) {
        console.error('Erro ao rejeitar reserva:', error);
        alert('Erro ao rejeitar reserva');
      } else {
        alert('Reserva rejeitada com sucesso!');
        fetchReservasPendentes();
      }
    } catch (error) {
      console.error('Erro ao rejeitar reserva:', error);
      alert('Erro ao rejeitar reserva');
    }
  };

  const formatDate = (date: string): string => {
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Layout pageTitle="Biblioteca Escolar - Página Inicial">
      {/* ===== SEÇÃO HERO ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        color: '#ffffff',
        marginBottom: '3rem',
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📚 Bem-vindo à Biblioteca Escolar
        </h1>
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          opacity: '0.95',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Explore nosso acervo, faça empréstimos e consulte seus livros favoritos
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/livros" style={{
            background: '#ffffff',
            color: '#7c3aed',
            padding: '0.875rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'all 250ms ease-in-out',
            display: 'inline-block',
            border: 'none',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            🔍 Explorar Livros
          </Link>
          <Link href="/emprestimos" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '0.875rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1rem',
            border: '2px solid #ffffff',
            transition: 'all 250ms ease-in-out',
            display: 'inline-block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#7c3aed';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#ffffff';
          }}>
            ✋ Fazer Empréstimo
          </Link>
        </div>
      </div>

      {/* ===== CARDS DE ATALHO ===== */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '1.75rem',
          fontWeight: '700',
          marginBottom: '2rem',
          color: '#111827'
        }}>
          Acesso Rápido
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Card 1 */}
          <Link href="/livros" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Buscar Livros</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Explore e localize livros no acervo
            </p>
          </Link>

          {/* Card 2 */}
          <Link href="/emprestimos" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✋</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Empréstimos</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Registre novos empréstimos
            </p>
          </Link>

          {/* Card 3 */}
          <Link href="/devolucoes" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>↩️</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Devoluções</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Registre devoluções de livros
            </p>
          </Link>

          {/* Card 4 */}
          <Link href="/utentes" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Utentes</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Gerenciar usuários da biblioteca
            </p>
          </Link>

          {/* Card 5 */}
          <Link href="/relatorios" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Relatórios</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Visualizar relatórios e estatísticas
            </p>
          </Link>

          {/* Card 6 */}
          <Link href="/admin" style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms ease-in-out',
            display: 'block',
            cursor: 'pointer'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
            <h5 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>Administração</h5>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 0 }}>
              Configurar autores, editoras e gêneros
            </p>
          </Link>
        </div>
      </div>

      {/* ===== ALERTAS E AVISOS ===== */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Carregando avisos...</p>
        </div>
      ) : (
        <>
          {reservasPendentes.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#0891b2'
              }}>
                📋 Reservas Pendentes ({reservasPendentes.length})
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(90deg, #7c3aed 0%, #0891b2 100%)',
                      color: '#ffffff'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Utente</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Livro</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data da Reserva</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasPendentes.map((reserva) => (
                      <tr key={reserva.res_cod} style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background-color 150ms ease-in-out'
                      }} onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
                      }} onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>{reserva.ut_nome}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{reserva.li_titulo}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{formatDate(reserva.res_data)}</td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => handleAprovarReserva(reserva.res_cod)}
                            style={{
                              background: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              marginRight: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 150ms ease-in-out'
                            }} onMouseOver={(e) => {
                              e.currentTarget.style.background = '#059669';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }} onMouseOut={(e) => {
                              e.currentTarget.style.background = '#10b981';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            ✓ Aprovar
                          </button>
                          <button
                            onClick={() => handleRejeitarReserva(reserva.res_cod)}
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 150ms ease-in-out'
                            }} onMouseOver={(e) => {
                              e.currentTarget.style.background = '#dc2626';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }} onMouseOut={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            ✕ Rejeitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {emprestimosAtraso.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px',
              padding: '1.5rem',
              color: '#7f1d1d'
            }}>
              <h4 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#991b1b'
              }}>
                ⚠️ Empréstimos em Atraso
              </h4>
              <p style={{ marginBottom: '1rem' }}>Os seguintes empréstimos estão vencidos:</p>
              <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
                {emprestimosAtraso.map((emprestimo) => (
                  <li key={emprestimo.re_cod} style={{ marginBottom: '0.5rem' }}>
                    <strong>{emprestimo.ut_nome}</strong> - "{emprestimo.li_titulo}"
                    <span style={{ color: '#991b1b', fontWeight: '700' }}>
                      {' '}(Vencimento: {formatDate(emprestimo.re_data_prevista)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!reservasPendentes.length && !emprestimosAtraso.length && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px',
              padding: '1.5rem',
              color: '#065f73',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                ✓ Tudo em ordem! Nenhuma reserva pendente ou empréstimo em atraso.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
