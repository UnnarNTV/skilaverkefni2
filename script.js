// base task data
let tasks = [
  { id: 1, title: "Klára HTML", done: false },
  { id: 2, title: "Æfa CSS", done: true },
  { id: 3, title: "Byrja á JS", done: false },
];

// Keeps track of which tasks do render
let filterState = "All";

// Event listeners
document.getElementById("filter-all").addEventListener("click", showAllTasks);
document
  .getElementById("filter-pending")
  .addEventListener("click", showPendingTasks);
document
  .getElementById("filter-completed")
  .addEventListener("click", showCompletedTasks);
document.getElementById("add-task-button").addEventListener("click", addTask);

// Adds a task to the task list
function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskTitle = taskInput.value;
  if (taskTitle.length > 0) {
    // find the highest id used
    // NOTE: Could turn this into finding the lowest available task id
    const highestId = tasks.reduce(
      (highest, current) => Math.max(highest, current.id),
      1,
    );

    tasks.push({
      id: highestId + 1,
      title: taskTitle,
      done: false,
    });
    renderTasks();
  }
  taskInput.value = "";
  saveData();
}

// Changes the filter state to all task
function showAllTasks() {
  filterState = "All";
  renderTasks();
}

// Changes the filter state to incomplete tasks
function showPendingTasks() {
  filterState = "Pending";
  renderTasks();
}

// Changes the filter state to completed tasks
function showCompletedTasks() {
  filterState = "Completed";
  renderTasks();
}

// Marks a task as completed
function completeTask(id) {
  tasks.find((task) => task.id === id).done = true;
  renderTasks();
  saveData();
}

// Remove a task from the task list
function removeTask(id) {
  tasks = tasks.filter((task) => !(task.id === id));
  renderTasks();
  saveData();
}

// Renders updated statistics about tasks in the header
function updateStatistics() {
  const tasksTotal = tasks.length;
  const tasksFinished = tasks.filter((task) => task.done).length;
  const tasksUncompleted = tasks.filter((task) => !task.done).length;

  document.getElementById("tasks-total").innerHTML = tasksTotal;
  document.getElementById("tasks-finished").innerHTML = tasksFinished;
  document.getElementById("tasks-uncompleted").innerHTML = tasksUncompleted;
}

// Generates html for tasks and displays them on the task display
function renderTasks() {
  // Filter tasks to show only those that the user has specified
  let visibleTasks;
  if (filterState === "All") {
    visibleTasks = [...tasks];
  } else if (filterState === "Pending") {
    visibleTasks = [...tasks].filter((task) => !task.done);
  } else if (filterState === "Completed") {
    visibleTasks = [...tasks].filter((task) => task.done);
  }

  const taskHTML = visibleTasks
    .map(
      (task) => `
        <div class="task ${task.done ? "task-done" : ""}">
            <p class="task-title">${task.title}</p>
            <div class="lower-part">
              <p class="status">${task.done ? "Completed" : "Pending"}</p>
              <div class="task-buttons">
                <button ${task.done ? "disabled" : ""} onclick="completeTask(${task.id})">Completed</button>
                <button onclick="removeTask(${task.id})">Delete</button>
              </div>
            </div>
        </div>
        `,
    )
    .join("");
  document.getElementById("task-display").innerHTML = taskHTML;
  updateStatistics();
}

// Saves task data to local storage
function saveData() {
  const saveString = JSON.stringify(tasks);
  localStorage.setItem("taskData", saveString);
}

// Loads task data from local storage
function loadData() {
  tasks = JSON.parse(localStorage.getItem("taskData"));
}

// Initial
loadData();
renderTasks();
