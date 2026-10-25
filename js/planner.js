/**
 * Academic planner
 * ---------------------------------------------------------------------------
 * Tasks are kept in an array and mirrored to localStorage, so the list and
 * the summary cards survive a page refresh.
 */

const STORAGE_KEY = "mubarak-academic-tasks";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskError = document.getElementById("task-error");
const taskList = document.getElementById("task-list");
const taskEmpty = document.getElementById("task-empty");
const countTotal = document.getElementById("count-total");
const countPending = document.getElementById("count-pending");
const countCompleted = document.getElementById("count-completed");
const deleteModal = document.getElementById("delete-modal");
const deleteModalTask = document.getElementById("delete-modal-task");
const confirmDeleteButton = document.getElementById("confirm-delete");

let tasks = loadTasks();
let pendingDeleteId = null;

/* --------------------------------------------------------------------------
   Storage
   -------------------------------------------------------------------------- */
function loadTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        // Storage may be blocked; the list still works for this visit.
    }
}

/* --------------------------------------------------------------------------
   Task markup
   -------------------------------------------------------------------------- */
function createId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = task.completed ? "task is-complete" : "task";
    item.dataset.id = task.id;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "task__toggle";
    toggle.dataset.action = "toggle";
    toggle.setAttribute("aria-pressed", String(task.completed));
    toggle.setAttribute(
        "aria-label",
        task.completed ? "Mark as pending" : "Mark as completed"
    );
    toggle.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"></path></svg>';

    const text = document.createElement("span");
    text.className = "task__text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "task__delete";
    remove.dataset.action = "delete";
    remove.setAttribute("aria-label", "Delete task");
    remove.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12' +
        'M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round"></path></svg>';

    item.append(toggle, text, remove);
    return item;
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        taskList.appendChild(createTaskElement(task));
    });

    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;

    countTotal.textContent = total;
    countPending.textContent = total - completed;
    countCompleted.textContent = completed;
    taskEmpty.hidden = total > 0;
}

/* --------------------------------------------------------------------------
   Actions
   -------------------------------------------------------------------------- */
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        taskError.hidden = false;
        taskInput.focus();
        return;
    }

    tasks.push({ id: createId(), text, completed: false });
    taskInput.value = "";
    taskError.hidden = true;
    saveTasks();
    renderTasks();
});

taskInput.addEventListener("input", () => {
    taskError.hidden = true;
});

taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const item = button.closest(".task");
    const index = tasks.findIndex((task) => task.id === item.dataset.id);
    if (index === -1) return;

    if (button.dataset.action === "toggle") {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        return;
    }

    pendingDeleteId = tasks[index].id;
    deleteModalTask.textContent = tasks[index].text;
    deleteModal.showModal();
});

/* Delete confirmation */
confirmDeleteButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => task.id !== pendingDeleteId);
    pendingDeleteId = null;
    deleteModal.close();
    saveTasks();
    renderTasks();
});

deleteModal.querySelector("[data-modal-close]").addEventListener("click", () => {
    deleteModal.close();
});

/* Clicking the backdrop closes the dialog */
deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) deleteModal.close();
});

deleteModal.addEventListener("close", () => {
    pendingDeleteId = null;
});

renderTasks();
