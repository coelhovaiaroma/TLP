/**
 * API Route para CRUD da tabela reserva
 * Gerencia reservas de livros
 */

import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Configurar CORS para permitir requisições do frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        return res.status(405).json({ error: 'Método não permitido' })
    }
  } catch (error) {
    console.error('Erro na API de reservas:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

/**
 * GET - Buscar reservas
 * Suporta filtros por status (pendente, aprovada, rejeitada) e paginação
 */
async function handleGet(req, res) {
  const { status, page = 1, limit = 10, id } = req.query

  try {
    // Se foi fornecido um ID específico, buscar apenas essa reserva
    if (id) {
      const { data: reserva, error } = await supabaseAdmin
        .from('reserva')
        .select(`
          res_cod,
          res_data,
          res_status,
          utente:utente (
            ut_cod,
            ut_nome,
            ut_email
          ),
          livro:livro (
            li_cod,
            li_titulo,
            autor:autor (
              au_nome
            )
          )
        `)
        .eq('res_cod', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Reserva não encontrada' })
        }
        throw error
      }

      return res.status(200).json({ reserva })
    }

    // Busca geral com filtros
    let query = supabaseAdmin
      .from('reserva')
      .select(`
        res_cod,
        res_data,
        res_status,
        utente:utente (
          ut_cod,
          ut_nome,
          ut_email
        ),
        livro:livro (
          li_cod,
          li_titulo,
          autor:autor (
            au_nome
          )
        )
      `)

    // Aplicar filtros
    if (status) {
      query = query.eq('res_status', status)
    }

    // Ordenar por data de reserva (mais recentes primeiro)
    query = query.order('res_data', { ascending: false })

    // Aplicar paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reservas, error } = await query

    if (error) throw error

    return res.status(200).json({ data: reservas })
  } catch (error) {
    console.error('Erro ao buscar reservas:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * POST - Criar nova reserva
 */
async function handlePost(req, res) {
  const { res_ut_cod, res_li_cod, res_data } = req.body

  try {
    // Validar dados obrigatórios
    if (!res_ut_cod || !res_li_cod) {
      return res.status(400).json({ error: 'Utente e livro são obrigatórios' })
    }

    // Verificar se o utente existe
    const { data: utente, error: utenteError } = await supabaseAdmin
      .from('utente')
      .select('ut_cod')
      .eq('ut_cod', res_ut_cod)
      .single()

    if (utenteError || !utente) {
      return res.status(400).json({ error: 'Utente não encontrado' })
    }

    // Verificar se o livro existe
    const { data: livro, error: livroError } = await supabaseAdmin
      .from('livro')
      .select('li_cod')
      .eq('li_cod', res_li_cod)
      .single()

    if (livroError || !livro) {
      return res.status(400).json({ error: 'Livro não encontrado' })
    }

    // Verificar se já existe reserva ativa para este utente e livro
    const { data: reservaExistente, error: reservaError } = await supabaseAdmin
      .from('reserva')
      .select('res_cod')
      .eq('res_ut_cod', res_ut_cod)
      .eq('res_li_cod', res_li_cod)
      .eq('res_status', 'pendente')

    if (reservaError) {
      throw reservaError
    }

    if (reservaExistente && reservaExistente.length > 0) {
      return res.status(400).json({ error: 'Já existe uma reserva pendente para este utente e livro' })
    }

    // Criar a reserva
    const { data: novaReserva, error } = await supabaseAdmin
      .from('reserva')
      .insert({
        res_ut_cod,
        res_li_cod,
        res_data: res_data || new Date().toISOString().split('T')[0],
        res_status: 'pendente'
      })
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({ data: novaReserva })
  } catch (error) {
    console.error('Erro ao criar reserva:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * PUT - Atualizar reserva
 */
async function handlePut(req, res) {
  const { id } = req.query
  const { res_status } = req.body

  try {
    if (!id) {
      return res.status(400).json({ error: 'ID da reserva é obrigatório' })
    }

    // Verificar se a reserva existe
    const { data: reservaExistente, error: fetchError } = await supabaseAdmin
      .from('reserva')
      .select('res_cod, res_status')
      .eq('res_cod', id)
      .single()

    if (fetchError || !reservaExistente) {
      return res.status(404).json({ error: 'Reserva não encontrada' })
    }

    // Atualizar a reserva
    const { data: reservaAtualizada, error } = await supabaseAdmin
      .from('reserva')
      .update({
        res_status: res_status || reservaExistente.res_status
      })
      .eq('res_cod', id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ data: reservaAtualizada })
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * DELETE - Deletar reserva
 */
async function handleDelete(req, res) {
  const { id } = req.query

  try {
    if (!id) {
      return res.status(400).json({ error: 'ID da reserva é obrigatório' })
    }

    const { error } = await supabaseAdmin
      .from('reserva')
      .delete()
      .eq('res_cod', id)

    if (error) throw error

    return res.status(200).json({ message: 'Reserva deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar reserva:', error)
    return res.status(500).json({ error: error.message })
  }
}
