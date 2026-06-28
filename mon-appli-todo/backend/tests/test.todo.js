const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
  { _id: '1', text: 'Apprendre Docker', done: false },
  { _id: '2', text: 'Apprendre Jenkins', done: false }
];

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const todo = { _id: Date.now().toString(), text: req.body.text, done: false };
  todos.push(todo);
  res.json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t._id === req.params.id);
  if (!todo) return res.status(404).json({ message: 'Non trouvé' });
  todo.done = req.body.done;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t._id !== req.params.id);
  res.json({ message: 'Supprimé !' });
});

describe('API Todo', () => {
  test('GET /todos → retourne la liste', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /todos → crée un todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ text: 'Apprendre Kubernetes' });
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Apprendre Kubernetes');
    expect(res.body.done).toBe(false);
  });

  test('PATCH /todos/:id → met à jour un todo', async () => {
    const res = await request(app)
      .patch('/todos/1')
      .send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  test('DELETE /todos/:id → supprime un todo', async () => {
    const res = await request(app).delete('/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Supprimé !');
  });
});