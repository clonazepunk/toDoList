//Class task
class Task {
  constructor(info, id, completed) {
    this.info = info; //what you write in input
    this.id = id; //important if want to delete or complete
    this.completed = completed; //boolean
  }
}
//Consts
const form = document.querySelector("#form");
const task = document.querySelector("#task");
const progress = document.querySelector("#progress");
const list = document.querySelector("#list");
const completedList = document.querySelector("#list-of-completed-tasks");
const restartButton = document.querySelector("#restart-button");
const pendingButton = document.querySelector("#pending-button");
const completedButton = document.querySelector("#completed-button");
//Arrays
let tasks = [];
let completedTasks = [];
let arrayForId = [];
//Vars
let finishedTasks = 0;
let totalTasks = 0;
let totalProgress = 0;
//When document loaded
document.addEventListener("DOMContentLoaded", () => {
  setPercentage(); //to line 156
  arrayForId = JSON.parse(localStorage.getItem("arrayForId")) || []; //get info from LS
  tasks = JSON.parse(localStorage.getItem("tasks")) || []; //get info from LS
  createPendingHTML(); //to line 86
  completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []; //get info from LS
  createCompletedHTML(); //to line 105
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateInput(); //to line 48
  createPendingHTML();
  createCompletedHTML();
  setFinishedTasks();
  setPercentage();
  restartButton.addEventListener("click", restartAgenda); // to line 147
  pendingButton.addEventListener("click", deletePending); // to line 171
  completedButton.addEventListener("click", deleteCompleted); // to line 176
});
//Checks the input. If empty, sends error message; else creates task.
function validateInput() {
  if (task.value.trim() === "") {
    showMessage("Field required to proceed"); // to line 60
    resetForm();
    return;
  }
  const newTask = new Task(task.value, arrayForId.length, false);
  resetForm(); // to line 82
  tasks.push(newTask);
  arrayForId.push(newTask);
}
//Shows a 3 seconds message with the error
function showMessage(message) {
  const errorExists = document.querySelector(".error");
  if (!errorExists) {
    const div = document.createElement("div");
    div.textContent = message;
    div.classList.add("error");
    form.appendChild(div);
    setTimeout(() => {
      div.remove();
    }, 3000);
  }
}
//Set the finished tasks in order to get the percentage of progress
function setFinishedTasks() {
  finishedTasks = 0;
  tasks.forEach((task) => {
    if (task.completed) {
      finishedTasks++;
    }
  });
}
//
function resetForm() {
  form.reset();
}
//creates the HTML from the pending tasks
function createPendingHTML() {
  restartPendingHTML(); //to line 121
  tasks.forEach((task) => {
    //buttons in lines 133 & 138
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="list d-f jc-sb">
                <div class="w-75">${task.info}</div>
                <div>
                    <button class="but but-succ" id="succ${task.id}"onclick="completeTask(succ${task.id}, delete${task.id})" data-id="${task.id}">/</button>
                    <button class="but but-delete" id="delete${task.id}" onclick="deleteTask(delete${task.id})" data-id="${task.id}">x</button>
                </div>
            </div>
        `;
    list.appendChild(li);
  });
  setPercentage();
  setLocalStorageID(); //to line 189
  setLocalStoragePending(); //to line 181
}
//Creates the HTML for the completed tasks
function createCompletedHTML() {
  restartCompletedHTML();
  completedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="list d-f jc-sb completed">
        <div class="w-75">${task[0].info}</div>
    </div>
        `;
    completedList.appendChild(li);
  });
  setPercentage();
  setLocalStorageCompleted(); //to line 185
}
//Prevents multiplication of the HTML list for pending
function restartPendingHTML() {
  while (list.firstChild) {
    list.firstChild.remove();
  }
}
//Prevents multiplication of the HTML list for completed
function restartCompletedHTML() {
  while (completedList.firstChild) {
    completedList.firstChild.remove();
  }
}
//Upload the content of tasks array
function deleteTask(buttonId) {
  tasks = tasks.filter((task) => task.id != buttonId.dataset.id);
  createPendingHTML();
}
//Removes the completed task from the task array & put it in completedTasks array
function completeTask(succButtonId, deleteButtonId) {
  const filteredTask = tasks.filter(
    (task) => task.id == succButtonId.dataset.id
  );
  tasks = tasks.filter((task) => task.id != deleteButtonId.dataset.id);
  completedTasks.push(filteredTask);
  createPendingHTML();
  createCompletedHTML();
}
//Restarts every array
function restartAgenda() {
  tasks = [];
  completedTasks = [];
  arrayForId = [];
  createPendingHTML();
  createCompletedHTML();
}
//Sets percentage between total and completed tasks and shows it under "send" button
function setPercentage() {
  setTotalTasks();
  finishedTasks = completedTasks.length;
  const totalProgress = parseInt((completedTasks.length * 100) / totalTasks);
  if (totalTasks > 0) {
    progress.textContent = totalProgress;
    return;
  }
  progress.textContent = 0;
}
//Sets the total amount of tasks in order to get the percentage of progress
function setTotalTasks() {
  totalTasks = tasks.length + completedTasks.length;
}
//Function for the "delete pending" button
function deletePending() {
  tasks = [];
  createPendingHTML();
}
//Function for the "delete completed" button
function deleteCompleted() {
  completedTasks = [];
  createCompletedHTML();
}
//LocalStorage functions
function setLocalStoragePending() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setLocalStorageCompleted() {
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function setLocalStorageID() {
  localStorage.setItem("arrayForId", JSON.stringify(arrayForId));
}
