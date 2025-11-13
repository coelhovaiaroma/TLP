/**
 * index.tsx - Página inicial da biblioteca
 * Convertido de index.php para Next.js com Supabase
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
        fetchEmprestimosAtraso(); // Atualizar lista de empréstimos ativos
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
      {/* Seção Hero */}
      <div className="hero-section bg-gradient-to-br from-primary-50 to-secondary-50 py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-primary mb-3 fade-in">
                Biblioteca Escolar
              </h1>
              <p className="lead text-muted mb-4 fade-in" style={{ animationDelay: '0.2s' }}>
                Sistema moderno de gestão de biblioteca para facilitar o acesso e organização de livros na escola.
              </p>
              <div className="d-flex gap-3 fade-in" style={{ animationDelay: '0.4s' }}>
                <Link href="/livros" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm">
                  <i className="fas fa-search me-2"></i>Explorar Livros
                </Link>
                <Link href="/emprestimos" className="btn btn-outline-primary btn-lg px-4 py-3 rounded-pill">
                  <i className="fas fa-hand-holding me-2"></i>Fazer Empréstimo
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="hero-icon fade-in" style={{ animationDelay: '0.6s' }}>
                <i className="fas fa-book-open text-primary" style={{ fontSize: '8rem', opacity: '0.1' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avisos */}
      {loading ? (
        <div className="row mt-4">
          <div className="col-12">
            <div className="text-center">
              <div className="loading"></div>
              <p>Carregando avisos...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {reservasPendentes.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5>📋 Reservas Pendentes</h5>
                  </div>
                  <div className="card-body">
                    <p>Há {reservasPendentes.length} reserva(s) aguardando aprovação:</p>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Utente</th>
                            <th>Livro</th>
                            <th>Data da Reserva</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservasPendentes.map((reserva) => (
                            <tr key={reserva.res_cod}>
                              <td><strong>{reserva.ut_nome}</strong></td>
                              <td>{reserva.li_titulo}</td>
                              <td>{formatDate(reserva.res_data)}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => handleAprovarReserva(reserva.res_cod)}
                                >
                                  <i className="fas fa-check"></i> Aprovar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRejeitarReserva(reserva.res_cod)}
                                >
                                  <i className="fas fa-times"></i> Rejeitar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {emprestimosAtraso.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">⚠️ Avisos Importantes</h4>
                  <p>Os seguintes empréstimos estão em atraso:</p>
                  <ul className="mb-0">
                    {emprestimosAtraso.map((emprestimo) => (
                      <li key={emprestimo.re_cod}>
                        <strong>{emprestimo.ut_nome}</strong> - "{emprestimo.li_titulo}"
                        (Vencimento: {formatDate(emprestimo.re_data_prevista)})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
