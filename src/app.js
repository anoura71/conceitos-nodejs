const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');


const app = express();

app.use(express.json());
app.use(cors());


const repositories = [];


// Listar os repositórios existentes
app.get('/repositories', (request, response) => {
  return response.json(repositories);
});


// Incluir novo repositório
app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});


// Alterar o repositório indicado
app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // Procura pelo repositório com o id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // Não encontrou
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  // Monta o objeto para atualização
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };
  // Atualiza o repositório na lista
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});


// Excluir o repositório indicado
app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  // Procura pelo repositório com o id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // Não encontrou
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  // Remove o repositório da lista
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});


// Incrementa em 1 unidade a contagem de 'likes' do repositório indicado
app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  // Procura pelo repositório com o id informado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  // Não encontrou
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  // Incrementa os likes do repositório encontrado
  let repository = repositories[repositoryIndex];
  repository.likes += 1;

  return response.json(repository);
});


module.exports = app;
