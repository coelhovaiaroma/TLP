const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testando API de requisições ativas...');
    const res = await fetch('http://localhost:3001/api/requisicoes?status=ativo');
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Dados:', JSON.stringify(data, null, 2));

    console.log('\nTestando API de livros...');
    const res2 = await fetch('http://localhost:3001/api/livros?limit=5');
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Dados:', JSON.stringify(data2, null, 2));

  } catch (error) {
    console.error('Erro:', error);
  }
}

testAPI();
