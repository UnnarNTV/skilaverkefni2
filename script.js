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
document.getElementById("task-input").addEventListener("keydown", enterTask);
document.querySelector("form").addEventListener("keydown", stopSubmit);

// Adds a new task if the Enter key was pressed
function enterTask(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

// Prevents the form form submitting when the Enter key is pressed
function stopSubmit(event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}

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

  // Set the focus on the task input field
  taskInput.focus();
}

// Changes the filter state to all task
function showAllTasks() {
  filterState = "All";
  document.getElementById("task-header").innerHTML = "Tasks - all";
  renderTasks();
}

// Changes the filter state to incomplete tasks
function showPendingTasks() {
  filterState = "Pending";
  document.getElementById("task-header").innerHTML = "Tasks - pending";
  renderTasks();
}

// Changes the filter state to completed tasks
function showCompletedTasks() {
  filterState = "Completed";
  document.getElementById("task-header").innerHTML = "Tasks - completed";
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
  const tasksIncomplete = tasks.filter((task) => !task.done).length;

  document.getElementById("tasks-total").innerHTML =
    "Total tasks: " + tasksTotal;
  document.getElementById("tasks-finished").innerHTML =
    "Completed tasks: " + tasksFinished;
  document.getElementById("tasks-incomplete").innerHTML =
    "Pending tasks: " + tasksIncomplete;
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

  // Generate html
  const taskHTML = visibleTasks
    .map(
      (task) => `
        <div class="task ${task.done ? "task-done" : ""}">
            <p class="task-title">${task.title}</p>
            <div class="lower-part">
              <p class="status">${task.done ? "Completed" : "Pending"}</p>
              <div class="task-buttons">
                <button class="complete" ${task.done ? "disabled" : ""} onclick="completeTask(${task.id})">Completed</button>
                <button class="delete" onclick="removeTask(${task.id})">Delete</button>
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
  const loadedTasks = JSON.parse(localStorage.getItem("taskData"));
  if (loadedTasks) {
    // Load stored data if it exists
    tasks = loadedTasks;
  } else {
    // Load default initial data if the local storage does not contain anything
    tasks = [
      { id: 1, title: "Klára HTML", done: false },
      { id: 2, title: "Æfa CSS", done: true },
      { id: 3, title: "Byrja á JS", done: false },
    ];
  }
}

// Initial
loadData();
showAllTasks();
renderTasks();
document.getElementById("task-input").focus();
