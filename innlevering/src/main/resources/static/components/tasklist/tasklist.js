import { initContent, tasktable, taskrow, taskboxTemplate } from "./components.js"

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {
  #shadow
  #changeCallbacks = new Map();
  #deleteCallbacks = new Map();
  #tasks
  #allstatuses

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });

    this.#tasks = [];
    this.#allstatuses = [];
  }

  setData(tasks, statuses) {
    this.#tasks = tasks;
    this.#allstatuses = statuses;
    this.initTable();
  }

  initTable() {
    const content = initContent.content.cloneNode(true);
    const tableClone = tasktable.content.cloneNode(true);

    content.querySelector("#tasklist").appendChild(tableClone);
    this.#shadow.appendChild(content);

    for (let task of this.#tasks) {
      this.showTask(task);
    }
    this.setStatuseslist(this.#allstatuses);
  }

  /**
   * Add task at top in list of tasks in the view
   * @public
   * @param {Object} task - Object representing a task
   */
  showTask(task) {
    const rowClone = taskrow.content.cloneNode(true);

    let cloneTData = rowClone.querySelectorAll("td");
    cloneTData[0].textContent = task.title;
    cloneTData[1].textContent = task.status;

    const select = rowClone.querySelector("select");
    if (select) {
      select.addEventListener('change', (e) => {
        this.#changeCallbacks.forEach(c => {
          c({
            id: task.id,
            status: this.#allstatuses[e.target.value]
          });
        });
      });
    }

    const rmButton = rowClone.querySelector("button");
    if (rmButton) {
      rmButton.addEventListener('click', (e) => {
        this.#deleteCallbacks.forEach(c => {
          c(task);
        })
      });
    }

    const tableBody = this.#shadow.querySelector("tbody");
    tableBody.appendChild(rowClone);
  }

  /**
   * @public
   * @param {Array} list with all possible task statuses
   */
  setStatuseslist(list) {
    let htmlOptions = `<option disabled selected>Modify</option>`;

    list.forEach((status, index) => {
      htmlOptions += `<option value="${index}">${status}</option>\n`;
    });

    this.#shadow.querySelectorAll("select").forEach(select => {
      select.innerHTML = htmlOptions;
    });
  }

  /**
   * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
   * @public
   * @param {function} callback
   */
  addChangestatusCallback(callback) {
    const callbackId = Symbol("change");
    this.#changeCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * Add callback to run on click on delete button of a task
   * @public
   * @param {function} callback
   */
  addDeletetaskCallback(callback) {
    const callbackId = Symbol("delete");
    this.#deleteCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * Update the status of a task in the view
   * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
   */
  updateTask(task) {
    let updateableTask = this.#tasks.find(t => t.id === task.id);
    if (!updateableTask) {
      return;
    }
    updateableTask.status = task.status;
    const taskIndex = this.#tasks.indexOf(updateableTask);
    const rows = this.#shadow.querySelectorAll("tbody tr");

    const row = rows[taskIndex];

    if (row) {
      row.querySelector("td:nth-child(2)").textContent = task.status;
    }
  }

  /**
   * Remove a task from the view
   * @param {Integer} id - ID of task to remove
   */
  removeTask(id) {
    const removedTask = this.#tasks.find(t => t.id === id);
    const removedTaskIndex = this.#tasks.indexOf(removedTask);

    if (removedTask) {
      this.#tasks.splice(removedTaskIndex, 1);
    }

    const rows = this.#shadow.querySelectorAll("tbody tr");
    this.#shadow.querySelector("tbody").removeChild(rows[removedTaskIndex]);
  }

  /**
   * Add a new task to the view
   * @param newTask
   */
  addTask(newTask) {
    this.#tasks.push(newTask);
    this.showTask(newTask);
    this.setStatuseslist(this.#allstatuses);
  }

  /**
   * @public
   * @return {Number} - Number of tasks on display in view
   */
  getNumtasks() {
    return this.#tasks.length;
  }
}
customElements.define("groupx-tasklist", TaskList);
