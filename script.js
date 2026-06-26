// ====================================================
// TASKFLOW — SCRIPT.JS
// Handles: mobile menu, adding tasks, marking done,
// deleting tasks, and showing hours.
// No frameworks — plain JavaScript only.
// ====================================================

// ---------- 1. MOBILE MENU TOGGLE ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  // classList.toggle adds the class if missing, removes it if present
  navLinks.classList.toggle('active');

  const isOpen = navLinks.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu after clicking a link
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});


// ---------- 2. ELEMENT REFERENCES ----------
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const hoursInput = document.getElementById('hoursInput');

const myTasksList = document.getElementById('myTasksList');
const doneList = document.getElementById('doneList');
const hoursList = document.getElementById('hoursList');

let taskIdCounter = 0; // simple unique id for each task


// ---------- 3. CREATE A TASK CARD ----------
function createTaskCard(taskText, hours, taskId) {
  // Outer list item
  const li = document.createElement('li');
  li.classList.add('task-card');
  li.setAttribute('data-id', taskId);

  // Task text
  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = taskText;

  // Actions wrapper (Done button + 3-dot menu)
  const actions = document.createElement('div');
  actions.classList.add('task-actions');

  // "Done" button
  const doneBtn = document.createElement('button');
  doneBtn.classList.add('btn-done');
  doneBtn.textContent = 'Done';
  doneBtn.addEventListener('click', () => moveTaskToDone(li, taskText));

  // 3-dot menu button
  const menuBtn = document.createElement('button');
  menuBtn.classList.add('menu-btn');
  menuBtn.textContent = '⋮';
  menuBtn.setAttribute('aria-label', 'Task options');

  // Dropdown (Delete option)
  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    removeHoursEntry(taskId);
    checkEmptyState();
  });

  dropdown.appendChild(deleteBtn);

  // Toggle dropdown visibility on menu click
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent the outside-click handler from firing immediately
    dropdown.classList.toggle('show');
  });

  // Assemble actions
  actions.appendChild(doneBtn);
  actions.appendChild(menuBtn);
  actions.appendChild(dropdown);

  // Assemble card
  li.appendChild(span);
  li.appendChild(actions);

  // If hours were entered, add an entry in the Hours column
  if (hours && Number(hours) > 0) {
    addHoursEntry(taskText, hours, taskId);
  }

  return li;
}


// ---------- 4. ADD NEW TASK (form submit) ----------
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the page from refreshing

  const taskText = taskInput.value.trim();
  const hours = hoursInput.value.trim();

  if (taskText === '') {
    taskInput.focus();
    return;
  }

  taskIdCounter++;
  const newCard = createTaskCard(taskText, hours, taskIdCounter);
  myTasksList.appendChild(newCard);

  // Reset the form
  taskInput.value = '';
  hoursInput.value = '';
  taskInput.focus();

  checkEmptyState();
});


// ---------- 5. MOVE TASK TO "DONE" COLUMN ----------
function moveTaskToDone(taskCard, taskText) {
  // Remove from "My Tasks"
  taskCard.remove();

  // Build a simpler done card (no Done button needed anymore)
  const li = document.createElement('li');
  li.classList.add('task-card', 'done-card');

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('menu-btn');
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Remove completed task');
  deleteBtn.addEventListener('click', () => {
    li.remove();
    checkEmptyState();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  doneList.appendChild(li);
  checkEmptyState();
}


// ---------- 6. HOURS COLUMN HELPERS ----------
function addHoursEntry(taskText, hours, taskId) {
  const li = document.createElement('li');
  li.classList.add('hours-card');
  li.setAttribute('data-hours-id', taskId);

  const span = document.createElement('span');
  span.textContent = taskText;

  const value = document.createElement('span');
  value.classList.add('hours-value');
  value.textContent = hours + ' hrs';

  li.appendChild(span);
  li.appendChild(value);
  hoursList.appendChild(li);

  checkEmptyState();
}

function removeHoursEntry(taskId) {
  const entry = hoursList.querySelector(`[data-hours-id="${taskId}"]`);
  if (entry) {
    entry.remove();
  }
}


// ---------- 7. CLOSE DROPDOWNS WHEN CLICKING OUTSIDE ----------
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.show').forEach((dropdown) => {
    dropdown.classList.remove('show');
  });
});


// ---------- 8. EMPTY STATE MESSAGES ----------
function checkEmptyState() {
  updateColumnEmptyState(myTasksList, 'No tasks yet. Add one above.');
  updateColumnEmptyState(doneList, 'Nothing completed yet.');
  updateColumnEmptyState(hoursList, 'No hours logged yet.');
}

function updateColumnEmptyState(listEl, message) {
  // Remove any existing empty message first
  const existing = listEl.querySelector('.empty-msg');
  if (existing) existing.remove();

  // If the list has no real items left, show the message
  if (listEl.children.length === 0) {
    const msg = document.createElement('li');
    msg.classList.add('empty-msg');
    msg.textContent = message;
    listEl.appendChild(msg);
  }
}

// Run once on page load so columns don't look broken/blank
checkEmptyState();
