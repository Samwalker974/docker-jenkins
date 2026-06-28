const API = window.API_URL || 'http://localhost:3000';

async function loadTodos() {
  const res = await fetch(`${API}/todos`);
  const todos = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = todos.map(t => `
    <li class="${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''}
        onchange="toggleTodo('${t._id}', this.checked)">
      <span>${t.text}</span>
      <button class="btn-delete" onclick="deleteTodo('${t._id}')">✕</button>
    </li>
  `).join('');
}

async function addTodo() {
  const input = document.getElementById('input');
  if (!input.value.trim()) return;
  await fetch(`${API}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';
  loadTodos();
}

async function toggleTodo(id, done) {
  await fetch(`${API}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

document.getElementById('input').addEventListener('keypress', e => {
  if (e.key === 'Enter') addTodo();
});

loadTodos();