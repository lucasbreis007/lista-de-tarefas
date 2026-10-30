// ========================================================
// 1. SELEÇÃO DOS ELEMENTOS DO HTML (DOM)
// ========================================================
// O JavaScript usa esses métodos para "encontrar" as tags no HTML e interagir com elas.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

// ========================================================
// 2. ESTADO DA APLICAÇÃO (DADOS)
// ========================================================
// Tentamos carregar as tarefas já salvas no navegador (localStorage).
// Se não houver nada salvo, começamos com uma lista vazia ([]).
let tasks = JSON.parse(localStorage.getItem('minhas_tarefas')) || [];

// ========================================================
// 3. FUNÇÕES PRINCIPAIS
// ========================================================

/**
 * Salva a lista de tarefas atual no navegador para não perder ao recarregar a página.
 */
function saveTasks() {
  localStorage.setItem('minhas_tarefas', JSON.stringify(tasks));
}

/**
 * Atualiza o contador de tarefas pendentes / concluídas na interface.
 */
function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  if (total === 0) {
    taskCount.textContent = 'Nenhuma tarefa cadastrada.';
  } else {
    taskCount.textContent = `${completed} de ${total} tarefas concluídas`;
  }
}

/**
 * Desenha (renderiza) na tela todos os itens presentes na lista 'tasks'.
 */
function renderTasks() {
  // 1. Limpa a lista atual para desenhar novamente
  taskList.innerHTML = '';

  // 2. Se a lista estiver vazia, exibe uma mensagem amigável
  if (tasks.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-message';
    emptyLi.textContent = 'Tudo limpo por aqui! Adicione uma tarefa acima 🎯';
    taskList.appendChild(emptyLi);
    updateTaskCount();
    return;
  }

  // 3. Percorre cada tarefa do array e cria os elementos HTML dinamicamente
  tasks.forEach((task) => {
    // Cria o item da lista <li>
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Cria a área clicável que contém o checkbox e o texto
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    // Cria a caixinha de seleção (checkbox)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    // Quando clicar no checkbox, alternamos o status da tarefa
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Cria o elemento com o texto da tarefa
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = task.text;

    // Cria uma etiqueta visual (badge) para destacar o status da tarefa
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${task.completed ? 'completed-badge' : 'pending-badge'}`;
    statusBadge.textContent = task.completed ? '✓ Concluída' : 'Pendente';

    // Monta o conteúdo interno
    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(spanText);
    contentDiv.appendChild(statusBadge);

    // Cria o botão de deletar tarefa
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;'; // Simbolo 'X'
    deleteBtn.title = 'Remover tarefa';

    // Quando clicar no botão 'X', remove a tarefa
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Junta tudo dentro do <li>
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    // Insere o <li> dentro do <ul> no HTML
    taskList.appendChild(li);
  });

  // Atualiza o contador de tarefas
  updateTaskCount();
}

/**
 * Adiciona uma nova tarefa à lista
 * @param {string} text - O texto digitado pelo usuário
 */
function addTask(text) {
  // Cria um objeto representando a nova tarefa
  const newTask = {
    id: Date.now(),      // Um número único baseado no horário atual
    text: text.trim(),   // Remove espaços extras nas pontas
    completed: false     // Começa sempre como não concluída
  };

  // Adiciona a nova tarefa no início da lista
  tasks.unshift(newTask);

  // Salva no navegador e atualiza a tela
  saveTasks();
  renderTasks();
}

/**
 * Marca ou desmarca uma tarefa como concluída
 * @param {number} id - O identificador único da tarefa
 */
function toggleTask(id) {
  // Percorre a lista e inverte o valor de 'completed' da tarefa encontrada
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

/**
 * Remove uma tarefa da lista
 * @param {number} id - O identificador único da tarefa
 */
function deleteTask(id) {
  // Filtra a lista, mantendo apenas as tarefas cujo id seja diferente do que queremos apagar
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

// ========================================================
// 4. ESCUTADORES DE EVENTOS (EVENT LISTENERS)
// ========================================================

// Quando o usuário envia o formulário (clica no botão ou aperta Enter)
taskForm.addEventListener('submit', (event) => {
  // Evita que a página recarregue ao submeter o formulário (comportamento padrão do HTML)
  event.preventDefault();

  const text = taskInput.value;

  // Se houver algum texto digitado, adiciona a tarefa
  if (text.trim() !== '') {
    addTask(text);
    taskInput.value = ''; // Limpa o campo de texto
    taskInput.focus();    // Mantém o cursor no campo de texto
  }
});

// ========================================================
// 5. INICIALIZAÇÃO
// ========================================================
// Renderiza as tarefas salvas assim que o arquivo é lido
renderTasks();
