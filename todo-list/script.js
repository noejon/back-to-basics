// List of ids
const TODO_LIST_ID = 'todoList';
const ADD_TASK_ID = "addTask";

// List of classes
const TASK_CLASS = 'task';
const EDIT_TASK_CLASS = 'edit-task'
const EDITABLE_TASK_CLASS = 'editable-task'
const DELETE_TASK_CLASS = 'delete-task'
const COMPLETE_TASK_CLASS = 'complete-task'

const appState = {};

/**
 * generating a random id that serves as a unique key.
 * The first 13 characters are used to store the current date
 * in milliseconds, followed by a randomly generated hash based on 
 * seeded from the date and the value
 * @param {*} value 
 * @returns a random hash usable as a unique key (for the purpose of this app at least)
 */
const generateId = (value) => {
  const date = Date.now();
  const textEncoder = new TextEncoder();
  const seed = textEncoder.encode(`${date}${value}`);

  const randomUintValue = window.crypto.getRandomValues(new Uint32Array(seed))[0];
  return `${date}${randomUintValue.toString(16)}`;
}

const appendButtonToTask = (task, text, className) => {
  if (!task || !text || !className) {
    return;
  }
  const button = document.createElement('button');
  button.classList.add('task-button', 'button', className);
  button.textContent = text;
  task.appendChild(button);
};

const createTask = (taskKey) => {
  const task = document.createElement('li');
  task.className = TASK_CLASS;
  task.setAttribute("data-key", taskKey)
  return task;
}

const setCompletedStatus = (checkbox) => {
  const task = checkbox.parentNode;
  const editButton = task.querySelector(`.${EDIT_TASK_CLASS}`);
  if (checkbox.checked) {
    const editableDiv = task.querySelector(`.${EDITABLE_TASK_CLASS}`);
    editableDiv.setAttribute('contentEditable', false);
    task.classList.add('completed');
    task.setAttribute('disabled', 'disabled')
    editButton.setAttribute('disabled', 'disabled')
  } else {
    task.classList.remove('completed');
    task.removeAttribute('disabled')
    editButton.removeAttribute('disabled');
  }
}

const appendTaskCheckbox = (task, isCompleted) => {
  if (!task) {
    return;
  }
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.className = COMPLETE_TASK_CLASS;
  checkBox.checked = !!isCompleted;
  task.appendChild(checkBox);
  return checkBox;
}

const appendTaskText = (task, taskText) => {
  const taskTextDiv = document.createElement('div');

  taskTextDiv.setAttribute('contentEditable', false);
  taskTextDiv.textContent = taskText;
  taskTextDiv.className = EDITABLE_TASK_CLASS;
  task.appendChild(taskTextDiv);
}

const appendTaskToList = (list, value, isCompleted, taskKey) => {
  const task = createTask(taskKey);
  const checkbox = appendTaskCheckbox(task, isCompleted);
  appendTaskText(task, value);
  appendButtonToTask(task, 'Edit', EDIT_TASK_CLASS);
  appendButtonToTask(task, 'Delete', DELETE_TASK_CLASS);
  setCompletedStatus(checkbox);
  list.appendChild(task);
}

const renderTodoList = (todoList) => {
  if (!todoList) return
  Object.entries(todoList).forEach(([key, { isCompleted, value }]) => {
    if (!value) {
      console.error('Unexpected empty item in initial todo list')
      return;
    }
    const list = document.getElementById(TODO_LIST_ID);
    appendTaskToList(list, value, isCompleted, key);
  })
}

const moveCursorToEndOfContentEditable = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(element, element.childNodes.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range)
}

const addUlEventListener = () => {
  const todoListNode = document.getElementById(TODO_LIST_ID);
  todoListNode.addEventListener('click', (event) => {
    if (event.target.classList.contains(COMPLETE_TASK_CLASS)) {
      const checkbox = event.target;
      const task = checkbox.parentNode

      setCompletedStatus(checkbox);

      const taskKey = task.getAttribute('data-key');
      appState.todoList[taskKey].isCompleted = checkbox.checked;
      localStorage.setItem('todoList', JSON.stringify(appState.todoList))
    }
    if (event.target.classList.contains(DELETE_TASK_CLASS)) {
      const task = event.target.parentNode;
      const taskKey = task.getAttribute('data-key');
      delete appState.todoList[taskKey];
      localStorage.setItem('todoList', JSON.stringify(appState.todoList))
      task.remove();
    }
    if (event.target.classList.contains(EDIT_TASK_CLASS)) {
      const editButton = event.target;
      const task = editButton.parentNode;
      const editableTask = task.querySelector(`.${EDITABLE_TASK_CLASS}`);
      const abortController = new AbortController();
      editableTask.setAttribute('contentEditable', true);
      editableTask.focus();
      moveCursorToEndOfContentEditable(editableTask)

      editableTask.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // Enter key
          event.preventDefault();
          const task = event.target.parentNode;
          const taskKey = task.getAttribute('data-key');
          const value = event.target.textContent;

          appState.todoList[taskKey].value = value;
          localStorage.setItem('todoList', JSON.stringify(appState.todoList))
          editableTask.setAttribute('contentEditable', false);
          abortController.abort()
        }
      }, { signal: abortController.signal })
    }
  });
}

const addInputItemToList = () => {
  const inputItem = document.getElementById('inputItem');

  const taskText = inputItem.value.trim();

  if (taskText !== "") {
    const taskKey = generateId(taskText);
    const list = document.getElementById(TODO_LIST_ID);
    appendTaskToList(list, taskText, false, taskKey);
    appState.todoList[taskKey] = { value: taskText, isCompleted: false }
    localStorage.setItem('todoList', JSON.stringify(appState.todoList))
    inputItem.value = "";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addUlEventListener();
  // Read from the appState initially to populate the todo list
  const todoList = JSON.parse(localStorage.getItem('todoList'));
  // Update the appState accordingly
  appState.todoList = todoList || {};
  renderTodoList(appState.todoList);

  // The first thing we do is adding the event listener to the button to add a value
  const addTaskButton = document.getElementById(ADD_TASK_ID);
  const inputItem = document.getElementById('inputItem');

  addTaskButton.addEventListener('click', addInputItemToList);
  inputItem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addInputItemToList();
    }
  })

});

