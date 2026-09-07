
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" type="text/css"
    href="${new URL('taskview.css', import.meta.url)}">
      <h1>Tasks</h1>
        <div id="message"><p>Waiting for server data.</p></div>
      <div id="newtask">
        <button type="button" disabled>New task</button>
      </div>
  <!-- The task list -->
  <GROUPX-TASKLIST></GROUPX-TASKLIST>
  <!-- The Modal -->
  <GROUPX-TASKBOX></GROUPX-TASKBOX>

`;
const initContent = document.createElement("template");
initContent.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${new URL('tasklist.css', import.meta.url)}">

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

const taskboxTemplate = document.createElement("template");
taskboxTemplate.innerHTML = `
  <link rel="stylesheet" type="text/css"
    href="${new URL('taskbox.css', import.meta.url)}">
    <dialog>
      <!-- Modal content -->
        <span>&times;</span>
        <div>
          <div>Title:</div>
        <div>
          <input type="text" size="25" maxlength="80"
          placeholder="Task title" autofocus/>
        </div>
        <div>Status:</div><div><select></select></div>
      </div>
      <p><button type="submit">Add task</button></p>
  </dialog>
`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {
  #shadow
  #callbacks = new Map();
  #tasks
  #allstatuses
  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });

    this.initMaincontent();
    this.initTable();
    this.buildDialog();

  }

  initMaincontent() {
    const templateClone = template.content.cloneNode(true);
    this.#shadow.appendChild(templateClone);
  }

  async initTable() {
    this.#tasks = await this.getTasklist("./api/tasklist");
    this.#allstatuses = await this.getStatuseslist("./api/allstatuses");

    const content = initContent.content.cloneNode(true);
    const tableClone = tasktable.content.cloneNode(true);

    content.querySelector("#tasklist").appendChild(tableClone);
    this.#shadow.querySelector("groupx-tasklist").appendChild(content);

    for (let task of this.#tasks) {
      this.showTask(task);
    }
    this.setStatuseslist(this.#allstatuses);

    this.updateTasktext();
  }

  updateTasktext() {
    const numberOfTasks = this.getNumtasks();
    const message = this.#shadow.querySelector("#message");
    const newtaskBtn = this.#shadow.querySelector("#newtask > button");

    const pElm = document.createElement("p");
    let pContent = null;

    if (numberOfTasks == 0) {
      pContent = document.createTextNode(`No tasks were found...`);

      newtaskBtn.setAttribute("disabled");
    } else {
      pContent = document.createTextNode(`Found ${numberOfTasks} tasks.`);
      newtaskBtn.removeAttribute("disabled");
    }

    pElm.appendChild(pContent);
    message.replaceChildren(pElm);
  }

  async getTasklist(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const results = await response.json();
      return results.tasks;
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
    return null;
  }

  async getStatuseslist(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const results = await response.json();
      return results.allstatuses;

    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
    return null;
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

    const tableBody = this.#shadow.querySelector("tbody");

    tableBody.appendChild(rowClone)
  }

  /**
   * @public
   * @param {Array} list with all possible task statuses
   */
  setStatuseslist(allstatuses) {
    let htmlStatuses = "";
    allstatuses.forEach((s, i) => {
      htmlStatuses +=
        `<option value="${i}"> ${s} </option> \n`
    });

    const option = this.#shadow.querySelectorAll("select");
    option.forEach(o => o.innerHTML += htmlStatuses);

  }

  buildDialog() {
    const dialogClone = taskboxTemplate.content.cloneNode(true);
    const boxLocation = this.#shadow.querySelector("groupx-taskbox");

    boxLocation.appendChild(dialogClone);
    this.showDialog();
  }

  showDialog() {
    const newTaskbtn = this.#shadow.querySelector("#newtask > button");
    const dialog = this.#shadow.querySelector("dialog");
    const spanElm = dialog.querySelector("span");

    spanElm.addEventListener("click", () => {
      dialog.close();
    })


    newTaskbtn.addEventListener("click", () => {
      dialog.showModal();
    });
  }

  /**
   * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
   * @public
   * @param {function} callback
   */
  addChangestatusCallback(callback) {
    /**
     * Fill inn the code
     */
  }

  /**
   * Add callback to run on click on delete button of a task
   * @public
   * @param {function} callback
   */
  addDeletetaskCallback(callback) {
    /**
     * Fill inn the code
     */
  }

  /**
   * Update the status of a task in the view
   * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
   */
  updateTask(task) {
    /**
     * Fill inn the code
     */
  }

  /**
   * Remove a task from the view
   * @param {Integer} task - ID of task to remove
   */
  removeTask(id) {
    /**
     * Fill inn the code
     */
  }

  /**
   * @public
   * @return {Number} - Number of tasks on display in view
   */
  getNumtasks() {
    return this.#tasks.length;
  }
}
customElements.define("groupx-tasktemplate", TaskList);
