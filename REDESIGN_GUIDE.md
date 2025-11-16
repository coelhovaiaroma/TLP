# 🎨 Guia de Redesign - Biblioteca Escolar

## ✅ Concluído (Novo Design)

### Ficheiros Redesenhados:
1. **styles/globals.css** - ✅ Novo CSS global completo
   - Paleta: Roxo (#7c3aed) + Teal (#0891b2)
   - Tipografias: Poppins + Sora
   - Componentes modernos com gradientes

2. **components/Layout.tsx** - ✅ Nova estrutura visual
   - Header com gradiente dark
   - Navbar com animações smooth
   - Footer redirecionado
   - Tudo funcional mantido intacto

3. **pages/index.tsx** - ✅ Página inicial redesenhada
   - Seção hero com gradiente
   - Grid de 6 cards de atalho
   - Tabelas e alertas modernos

4. **pages/livros.tsx** - ✅ Busca de livros redesenhada
   - Formulário moderno com focus effects
   - Tabela com hover effects
   - Paginação custom
   - Dicas visualmente atrativas

---

## 🔨 Próximos Passos

### Padrões de Design Adotados:

```typescript
// CORES
--primary: #7c3aed (Roxo)
--secondary: #0891b2 (Teal)
--accent: #ec4899 (Rosa)
--success: #10b981 (Verde)
--danger: #ef4444 (Vermelho)
--warning: #f59e0b (Amarelo)

// ESPAÇAMENTO
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem

// BORDER RADIUS
--radius-lg: 12px
--radius-xl: 16px

// SHADOWS
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Componentes Padrão:

#### 1. **Cards**
```typescript
{
  background: '#ffffff',
  borderRadius: '12px',
  padding: '2rem',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  transition: 'all 250ms ease-in-out'
}
// On hover: transform: translateY(-4px), shadow-xl
```

#### 2. **Botões Primários**
```typescript
{
  background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
  color: '#ffffff',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 250ms ease-in-out'
}
// On hover: transform: translateY(-2px), shadow-lg
```

#### 3. **Tabelas**
```typescript
Header: 'linear-gradient(90deg, #7c3aed 0%, #0891b2 100%)'
Row hover: 'rgba(124, 58, 237, 0.05)'
Border: '#e5e7eb'
Padding: '1rem'
```

#### 4. **Títulos (H1, H2)**
```typescript
{
  fontFamily: "'Poppins', sans-serif",
  fontWeight: '700',
  background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}
```

#### 5. **Alerts**
```typescript
// Success
background: 'rgba(16, 185, 129, 0.1)'
borderLeft: '4px solid #10b981'
color: '#047857'

// Danger
background: 'rgba(239, 68, 68, 0.1)'
borderLeft: '4px solid #ef4444'
color: '#991b1b'

// Info
background: 'rgba(59, 130, 246, 0.1)'
borderLeft: '4px solid #3b82f6'
color: '#1e40af'
```

---

## 📄 Páginas Faltando Redesenho

### 1. **pages/emprestimos.tsx**
- Substituir formulários antigos por modernos
- Cards para seleção de utentes
- Tabela com hover effects para exemplares
- Carrinho de empréstimos em card moderno
- Botões com gradientes

### 2. **pages/devolucoes.tsx**
- Tabela com filtros modernos
- Cards para seleção de empréstimos
- Modal de confirmação de devolução
- Status badges com cores

### 3. **pages/utentes.tsx**
- Grid de cards para lista de utentes
- Formulário moderno para novo utente
- Tabela com ações inline
- Modal para edição

### 4. **pages/admin.tsx**
- Tabs com nova aparência
- Cards para cada seção (Autores, Editoras, Gêneros)
- Formulários inline
- Listas com ações

### 5. **pages/relatorios.tsx**
- Cards de estatísticas com números grandes
- Gráficos com cores do tema
- Tabelas de relatórios
- Filtros modernos

---

## 🎯 Checklist para Cada Página

Para cada página que recriar:

- [ ] Manter **100% da lógica funcional** (funções, estado, API calls)
- [ ] **Não alterar IDs, names ou valores** de inputs/forms
- [ ] Aplicar **gradientes** para títulos e cabeçalhos
- [ ] Usar **inline styles** ou CSS classes do globals.css
- [ ] Adicionar **hover effects** em botões e cards
- [ ] Usar **emojis** para ícones visuais
- [ ] **Borders e shadows** consistentes
- [ ] **Responsividade** para mobile
- [ ] **Animações smooth** (150-250ms)
- [ ] **Cores** conforme paleta principal

---

## 🎨 Exemplos de Conversão

### Antes (Antigo):
```tsx
<div className="card">
  <div className="card-header">
    <h5>Título</h5>
  </div>
  <div className="card-body">Conteúdo</div>
</div>
```

### Depois (Novo Design):
```tsx
<div style={{
  background: '#ffffff',
  borderRadius: '12px',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}}>
  <h3 style={{
    fontFamily: "'Poppins', sans-serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#111827'
  }}>Título</h3>
  <p>Conteúdo</p>
</div>
```

---

## ⚡ Performance & Boas Práticas

1. **Evitar re-renders desnecessários** - Use `React.memo` se necessário
2. **Lazy load de componentes** - Se tiver muitos cards/tabelas
3. **CSS-in-JS vs External** - Preferir globals.css para classes reutilizáveis
4. **Transitions suaves** - Sempre usar `transition: 'all 250ms ease-in-out'`
5. **Acessibilidade** - Manter `aria-` attributes e labels

---

## 🚀 Deploy & Testes

Após completar o redesign:

1. Testar em **Chrome, Firefox, Safari**
2. Verificar **responsividade** em mobile
3. Testar **todas as funcionalidades** (busca, criação, edição, delete)
4. Verificar **performance** com DevTools
5. Validar **acessibilidade** com WAVE

---

## 📞 Suporte ao Design

Para manter **consistência visual**, sempre referenciar:
- `styles/globals.css` para variáveis e classes
- `components/Layout.tsx` para padrão estrutural
- `pages/index.tsx` para exemplo de cards
- `pages/livros.tsx` para exemplo de tabelas

---

**Status**: 🟢 Pronto para continuar com próximas páginas  
**Data**: 16 de Novembro de 2025  
**Versão**: 1.0
