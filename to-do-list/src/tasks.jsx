import { matchSorter } from "match-sorter";

export async function getTasks(query) {
  let tasks = getLocalStorageItem("tasks");
  if (!tasks) tasks = [];
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["title", "description"] });
  }
  return tasks;
}

export async function createTask() {
  let id = Math.random().toString(36).substring(2, 9);
  let task = { id, createdAt: Date.now(), isDone: false };
  let tasks = await getTasks();
  tasks.unshift(task);
  setLocalStorageItem("tasks", tasks);
  return task;
}

export async function getTask(id) {
  let tasks = getLocalStorageItem("tasks");
  let task = tasks.find(task => task.id === id);
  return task ?? null;
}

export async function updateTask(id, updates) {
  let tasks = getLocalStorageItem("tasks");
  let task = tasks.find(task => task.id === id);
  if (!task) throw new Error("No task found for", id);
  Object.assign(task, updates);
  setLocalStorageItem("tasks", tasks);
  return task;
}

export async function deleteTask(id) {
  let tasks = getLocalStorageItem("tasks");
  let index = tasks.findIndex(task => task.id === id);
  if (index > -1) {
    tasks.splice(index, 1);
    setLocalStorageItem("tasks", tasks);
    return true;
  }
  return false;
}

function setLocalStorageItem(key, value) {
  console.log(value);
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
