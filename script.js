class Task {
  constructor(info, id, completed) {
    this.info = info;
    this.id = id;
    this.completed = completed;
  }
}

const form = document.querySelector("#form");
const task = document.querySelector("#task");
const progress = document.querySelector("#progress");
const list = document.querySelector("#list");
const completedList = document.querySelector("#list-of-completed-tasks");
const restartButton = document.querySelector("#restart-button");
const pendingButton = document.querySelector('#pending-button');
const completedButton = document.querySelector('#completed-button');

//falta: función del progreso, programar los botones de delete pending y delete completed

let tasks = [];
let completedTasks = [];
let finishedTasks = 0;
let totalTasks = 0;
let totalProgress = 0;
let id = 1;

document.addEventListener("DOMContentLoaded", () => {
  setPercentage();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateInput();
  createPendingHTML();
  createCompletedHTML();
  setFinishedTasks();
  setPercentage();
  restartButton.addEventListener("click", restartAgenda);
  pendingButton.addEventListener('click', deletePending);
  completedButton.addEventListener('click', deleteCompleted);
});

function validateInput() {
  if (task.value === "") {
    showMessage("Field required to proceed");
    return;
  }
  const newTask = new Task(task.value, id, false);
  id++;
  resetForm();
  tasks.push(newTask);
  // console.log(tasks);
}

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

function setFinishedTasks() {
  finishedTasks = 0;
  tasks.forEach((task) => {
    if (task.completed) {
      finishedTasks++;
    }
  });
  // console.log(finishedTasks);
}

function resetForm() {
  form.reset();
}

function createPendingHTML() {
  restartPendingHTML();
  tasks.forEach((task) => {
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
}

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
}

function restartPendingHTML() {
  while (list.firstChild) {
    list.firstChild.remove();
  }
}

function restartCompletedHTML() {
  while (completedList.firstChild) {
    completedList.firstChild.remove();
  }
}

function deleteTask(buttonId) {
  tasks = tasks.filter((task) => task.id != buttonId.dataset.id);
  createPendingHTML();
}

function completeTask(succButtonId, deleteButtonId) {
  const filteredTask = tasks.filter(
    (task) => task.id == succButtonId.dataset.id
  );
  tasks = tasks.filter((task) => task.id != deleteButtonId.dataset.id);
  completedTasks.push(filteredTask);
  createPendingHTML();
  createCompletedHTML();
}

function restartAgenda() {
  tasks = [];
  completedTasks = [];
  createPendingHTML();
  createCompletedHTML();
}

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

function setTotalTasks() {
  totalTasks = tasks.length + completedTasks.length;
}

function deletePending(){
  tasks = [];
  createPendingHTML();
}

function deleteCompleted(){
  completedTasks = [];
  createCompletedHTML();
}