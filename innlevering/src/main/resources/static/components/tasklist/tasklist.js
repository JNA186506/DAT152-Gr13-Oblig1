import { initContent, tasktable, taskrow } from "./components.js";

/**
 * TaskList
 * Manage view with list of tasks
 */
class TaskList extends HTMLElement {
  #shadow;
  #rows = new Map();
  #changeCallbacks = new Map();
  #deleteCallbacks = new Map();
  #allstatuses;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "closed" });

    this.#allstatuses = [];
    this.#initTable();
  }

  #initTable() {
    const content = initContent.content.cloneNode(true);
    const tableClone = tasktable.content.cloneNode(true);

    content.querySelector("#tasklist").appendChild(tableClone);
    this.#shadow.appendChild(content);
  }

  /**
   * Add task at top in list of tasks in the view
   * @public
   * @param {Object} task - Object representing a task
   */
  showTask(task) {
    this.removeTask(task.id);
    const rowClone = taskrow.content.cloneNode(true);
    const row = rowClone.querySelector("tr");

    let cloneTData = rowClone.querySelectorAll("td");
    cloneTData[0].textContent = task.title;
    cloneTData[1].textContent = task.status;

    const select = rowClone.querySelector("select");
    if (select !== null) {
      select.addEventListener("change", (e) => {
        this.#changeCallbacks.forEach((c) => {
          c({
            id: task.id,
            status: this.#allstatuses[e.target.value],
          });
        });
      });
    }

    const rmButton = rowClone.querySelector("button");
    if (rmButton !== null) {
      rmButton.addEventListener("click", (e) => {
        this.#deleteCallbacks.forEach((c) => {
          c(task);
        });
      });
    }

    const tableBody = this.#shadow.querySelector("tbody");
    tableBody.prepend(rowClone);
    this.#rows.set(task.id, row);
    this.setStatuseslist(this.#allstatuses);
  }

  /**
   * @public
   * @param {Array} list with all possible task statuses
   */
  setStatuseslist(list) {
    this.#allstatuses = [...list];
    this.#shadow.querySelectorAll("select").forEach((select) => {
      const placeholder = document.createElement("option");
      placeholder.textContent = "Modify";
      placeholder.disabled = true;
      placeholder.selected = true;
      select.replaceChildren(placeholder);

      this.#allstatuses.forEach((status, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = status;
        select.appendChild(option);
      });
    });
  }

  /**
   * Add callback to run on change of status of a task, i.e. on change in the SELECT element
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
    const row = this.#rows.get(task.id);

    if (row !== undefined) {
      row.querySelector("td:nth-child(2)").textContent = task.status;
    }
  }

  /**
   * Remove a task from the view
   * @param {Integer} id - ID of task to remove
   */
  removeTask(id) {
    const row = this.#rows.get(id);
    if (row !== undefined) {
      row.remove();
      this.#rows.delete(id);
    }
  }

  /**
   * @public
   * @return {Number} - Number of tasks on display in view
   */
  getNumtasks() {
    return this.#rows.size;
  }
}
customElements.define("group13-tasklist", TaskList);
