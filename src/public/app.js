let currentPriority = 'medium';
let currentFilter = 'all';

function setPriority(p) {
  currentPriority = p;
  document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-p="${p}"]`).classList.add('active');
}

function setFilter(f, el) {
  currentFilter = f;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  loadTasks();
}

function showToast(msg, color = 'var(--accent3)') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderLeftColor = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

async function loadStats() {
  const res = await fetch('/api/tasks/stats');
  const { data } = await res.json();
  document.getElementById('stat-total').textContent = data.total;
  document.getElementById('stat-pending').textContent = data.pending;
  document.getElementById('stat-progress').textContent = data.inProgress;
  document.getElementById('stat-done').textContent = data.done;
  document.getElementById('stat-high').textContent = data.highPriority;
}

async function loadTasks() {
  let url = '/api/tasks';
  const params = [];
  if (currentFilter === 'high') params.push('priority=high');
  else if (currentFilter !== 'all') params.push(`status=${currentFilter}`);
  if (params.length) url += '?' + params.join('&');

  const res = await fetch(url);
  const { data } = await res.json();
  renderTasks(data);
}

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  if (!tasks || tasks.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">📋</div><div class="empty-text">No tasks here.</div></div>`;
    return;
  }

  list.innerHTML = tasks.map(t => `
    <div class="task-card ${t.status === 'done' ? 'done-card' : ''}" id="card-${t.id}">
      <div class="task-left">
        <div class="task-title">${escHtml(t.title)}</div>
        ${t.description ? `<div class="task-desc">${escHtml(t.description)}</div>` : ''}
        <div class="task-meta">
          <span class="tag tag-${t.priority}">${t.priority}</span>
          <span class="tag tag-${t.status}">${t.status}</span>
          <span class="task-date">${new Date(t.createdAt).toLocaleDateString('id-ID', {day:'numeric',month:'short'})}</span>
        </div>
      </div>
      <div class="task-actions">
        <select class="status-select" onchange="updateStatus('${t.id}', this.value)">
          <option value="pending" ${t.status==='pending'?'selected':''}>Pending</option>
          <option value="in-progress" ${t.status==='in-progress'?'selected':''}>In Progress</option>
          <option value="done" ${t.status==='done'?'selected':''}>Done</option>
        </select>
        <button class="btn-delete" onclick="deleteTask('${t.id}')">✕ Delete</button>
      </div>
    </div>
  `).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function createTask() {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  if (!title) { showToast('Title is required!', 'var(--high)'); return; }

  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority: currentPriority })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    setPriority('medium');
    await loadTasks();
    await loadStats();
    showToast('✓ Task created!');
  } else {
    showToast(data.message, 'var(--high)');
  }
}

async function updateStatus(id, status) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (data.success) {
    await loadTasks();
    await loadStats();
    showToast('✓ Status updated!');
  }
}

async function deleteTask(id) {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) {
    await loadTasks();
    await loadStats();
    showToast('✓ Task deleted!', 'var(--accent2)');
  }
}

// Init
loadTasks();
loadStats();
