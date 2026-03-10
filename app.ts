interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const taskCount = document.getElementById("taskCount") as HTMLSpanElement;

let tasks: Task[] = loadTasks();

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) as Task[] : [];
}

function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount(): void {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  taskCount.textContent = `${completed} of ${total} completed`;
}

function addTask(): void {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  const newTask: Task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(taskId: number): void {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(taskId: number): void {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function renderTasks(): void {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "No tasks yet. Add your first task.";
    taskList.appendChild(emptyMessage);
    updateTaskCount();
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const leftSection = document.createElement("div");
    leftSection.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = task.completed ? "task-text completed" : "task-text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    leftSection.appendChild(checkbox);
    leftSection.appendChild(span);

    li.appendChild(leftSection);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateTaskCount();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();