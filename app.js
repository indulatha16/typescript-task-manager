var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var taskCount = document.getElementById("taskCount");
var tasks = loadTasks();
function loadTasks() {
    var savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
}
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateTaskCount() {
    var total = tasks.length;
    var completed = tasks.filter(function (task) { return task.completed; }).length;
    taskCount.textContent = "".concat(completed, " of ").concat(total, " completed");
}
function addTask() {
    var text = taskInput.value.trim();
    if (text === "") {
        alert("Please enter a task");
        return;
    }
    var newTask = {
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
function toggleTask(taskId) {
    tasks = tasks.map(function (task) {
        return task.id === taskId ? __assign(__assign({}, task), { completed: !task.completed }) : task;
    });
    saveTasks();
    renderTasks();
}
function deleteTask(taskId) {
    tasks = tasks.filter(function (task) { return task.id !== taskId; });
    saveTasks();
    renderTasks();
}
function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        var emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "No tasks yet. Add your first task.";
        taskList.appendChild(emptyMessage);
        updateTaskCount();
        return;
    }
    tasks.forEach(function (task) {
        var li = document.createElement("li");
        li.className = "task-item";
        var leftSection = document.createElement("div");
        leftSection.className = "task-left";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () { return toggleTask(task.id); });
        var span = document.createElement("span");
        span.className = task.completed ? "task-text completed" : "task-text";
        span.textContent = task.text;
        var deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () { return deleteTask(task.id); });
        leftSection.appendChild(checkbox);
        leftSection.appendChild(span);
        li.appendChild(leftSection);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    updateTaskCount();
}
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
renderTasks();
