import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getTasks(query) {
  await fakeNetwork(`getTasks:${query}`);
  let tasks = await localforage.getItem("tasks");
  if (!tasks) tasks = [];
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["title", "description"] });
  }
  return tasks.sort(sortBy("last", "createdAt"));
}

export async function createTask() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let task = { id, createdAt: Date.now(), isDone: false };
  let tasks = await getTasks();
  tasks.unshift(task);
  await set(tasks);
  return task;
}

export async function getTask(id) {
  await fakeNetwork(`task:${id}`);
  let tasks = await localforage.getItem("tasks");
  let task = tasks.find(task => task.id === id);
  return task ?? null;
}

export async function updateTask(id, updates) {
  await fakeNetwork();
  let tasks = await localforage.getItem("tasks");
  let task = tasks.find(task => task.id === id);
  if (!task) throw new Error("No task found for", id);
  Object.assign(task, updates);
  await set(tasks);
  return task;
}

export async function deleteTask(id) {
  let tasks = await localforage.getItem("tasks");
  let index = tasks.findIndex(task => task.id === id);
  if (index > -1) {
    tasks.splice(index, 1);
    await set(tasks);
    return true;
  }
  return false;
}

function set(tasks) {
  return localforage.setItem("tasks", tasks);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 900);
  });
}