import { template } from "./taskview-components.js";
import "../tasklist/tasklist.js";
import "../taskbox/taskbox.js";

class TaskView extends HTMLElement {
  #tasklist;
  #taskbox;
  #allstatuses;
  #shadow;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "closed" });
    const templateClone = template.content.cloneNode(true);
    this.#shadow.appendChild(templateClone);

    this.#tasklist = this.#shadow.querySelector("group13-tasklist");
    this.#taskbox = this.#shadow.querySelector("group13-taskbox");

    this.#tasklist.addChangestatusCallback(this.#sendPutRequest.bind(this));
    this.#tasklist.addDeletetaskCallback(this.#sendDeleteRequest.bind(this));
    this.#taskbox.addNewtaskCallback(this.#sendPostRequest.bind(this));

    this.#initAsyncmethods();
  }

  #serviceUrl(endpoint) {
    const base = this.dataset.serviceurl.replace(/\/+$/, "");
    return `${base}/${endpoint}`;
  }

  /**
   * Inits the async methods, ensures the taskbox and tasklist has the elements they need.
   * @returns {Promise<void>}
   */
  async #initAsyncmethods() {
    const tasks = await this.#fetchTasks();

    if (tasks === null) {
      // Could benefit with a more robust handler
      console.log("Could not load tasks, please reload page.");
      return;
    }

    const statuses = await this.#fetchStatuses();

    if (tasks === null) {
      // Could benefit with a more robust handler
      console.log("Could not load statuses, please reload page.");
      return;
    }

    this.#allstatuses = statuses;
    this.#tasklist.setStatuseslist(this.#allstatuses);
    const taskMap = this.#buildMap(tasks);
    taskMap.forEach((task) => this.#tasklist.showTask(task));
    this.#taskbox.setStatuseslist(this.#allstatuses);
    this.#updateTasktext();
    this.#newtaskButtonEvent();
  }

  #buildMap(tasks) {
    let taskMap = new Map();

    tasks.forEach((task) => {
      if (!taskMap.has(task.id)) {
        taskMap.set(task.id, task);
      }
    });

    return taskMap;
  }

  /**
   * Updates the task text in the template element.
   * Checks if there are tasks in the view.
   */
  #updateTasktext() {
    const numberOfTasks = this.#tasklist.getNumtasks();
    const message = this.#shadow.querySelector("#message");

    const pElm = document.createElement("p");
    let pContent = null;

    if (numberOfTasks === 0) {
      pContent = document.createTextNode(`No tasks were found...`);
    } else {
      pContent = document.createTextNode(`Found ${numberOfTasks} tasks.`);
    }

    pElm.appendChild(pContent);
    message.replaceChildren(pElm);
  }

  /**
   * Removes disabled attribute, adds functionality to button.
   */
  #newtaskButtonEvent() {
    const newtaskBtn = this.#shadow.querySelector("#newtask > button");

    newtaskBtn.removeAttribute("disabled");
    newtaskBtn.addEventListener("click", () => {
      this.#taskbox.show();
    });
  }

  /**
   * Fetches all tasks from the database.
   * handles
   * @param url
   * @returns {Promise<*|null>}
   */
  async #fetchTasks() {
    try {
      const response = await fetch(this.#serviceUrl("tasklist"));
      if (response.ok === false) {
        throw new Error(`Response status: ${response.status}`);
      }
      const results = await response.json();

      if (results.responseStatus === true) {
        return results.tasks;
      }
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
    return null;
  }

  async #fetchStatuses() {
    try {
      const response = await fetch(this.#serviceUrl("allstatuses"));
      if (response.ok === false) {
        throw new Error(`Response status: ${response.status}`);
      }
      const results = await response.json();
      if (results.responseStatus === true) {
        return results.allstatuses;
      }
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
    return null;
  }

  /**
   * Sends a POST request to the server with a new task.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendPostRequest(data) {
    const requestSettings = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(data),
      cache: "no-cache",
      redirect: "error",
    };

    try {
      const response = await fetch(this.#serviceUrl("task"), requestSettings);
      if (response.ok === false) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const content = await response.json();

      if (content.responseStatus === true) {
        const task = content.task;
        this.#tasklist.showTask({
          id: task.id,
          title: task.title,
          status: task.status,
        });
      }
      this.#updateTasktext();
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
  }

  /**
   * Sends a delete request with a task to the server.
   * Method only uses the task ID to delete with the task endpoint.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendDeleteRequest(data) {
    try {
      const response = await fetch(`${this.#serviceUrl(`task/${data.id}`)}`, {
        method: "DELETE",
      });

      if (response.ok === false) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const content = await response.json();

      if (content.responseStatus === true) {
        this.#tasklist.removeTask(data.id);
        this.#updateTasktext();
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Sends a PUT request with the updated task status to the server.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendPutRequest(data) {
    if (
      data === null ||
      data === undefined ||
      data.status === null ||
      data.status === undefined ||
      data.status === ""
    ) {
      console.log("Invalid status data");
      return;
    }

    const requestSettings = {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ status: data.status }),
      cache: "no-cache",
      redirect: "error",
    };

    try {
      const response = await fetch(
        `${this.#serviceUrl(`task/${data.id}`)}`,
        requestSettings,
      );

      if (response.ok === false) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const content = await response.json();

      if (content.responseStatus === true) {
        this.#tasklist.updateTask({
          id: content.id,
          status: content.status,
        });

        this.#updateTasktext();
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}
customElements.define("group13-taskview", TaskView);
