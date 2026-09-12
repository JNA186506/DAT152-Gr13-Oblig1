import { template } from "./components.js"
class TaskController extends HTMLElement {
  #taskList
  #taskbox
  #tasks
  #allstatuses
  #shadow

  constructor() {
    super();

    this.#shadow = this.attachShadow({mode: 'open'});
    const templateClone = template.content.cloneNode(true);
    this.#shadow.appendChild(templateClone);

    this.#taskList = this.#shadow.querySelector("groupx-tasklist");
    this.#taskbox = this.#shadow.querySelector("groupx-taskbox");

    this.#taskList.addChangestatusCallback(this.#sendPutRequest.bind(this));
    this.#taskList.addDeletetaskCallback(this.#sendDeleteRequest.bind(this));
    this.#taskbox.addNewTaskCallback(this.#sendPostRequest.bind(this));

    this.#initAsyncmethods();
  }

  async #initAsyncmethods() {
    this.#tasks = await this.#fetchTasks("./api/tasklist")
    this.#allstatuses = await this.#fetchStatuses("./api/allstatuses");

    this.#taskList.setData(this.#tasks, this.#allstatuses);
    this.#taskbox.setStatuses(this.#allstatuses);
    this.updateTasktext();
  }

  updateTasktext() {
    const numberOfTasks = this.#taskList.getNumtasks();
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

  activateNewTaskbutton() {
    const newTaskBtn = this.#shadow.querySelector("#newtask > button");

    newTaskBtn.removeAttribute("disabled")
    newTaskBtn.addEventListener("click", () => {
      this.#taskbox.getDialog().showModal();
    } );
  }

  async #fetchTasks(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const results = await response.json();
      this.activateNewTaskbutton();
      return results.tasks;
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
    }
    return null;
  }

  async #fetchStatuses(url) {
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
   * Sends a POST request to the server with a new task.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendPostRequest(data) {
    const requestSettings = {
      "method": "POST",
      "headers": {"Content-Type": "application/json; charset=utf-8"},
      "body": JSON.stringify(data),
      "cache": "no-cache",
      "redirect": "error"
    };

    try {
      const response = await fetch(`./api/task`, requestSettings);
      if (response.ok) {
        console.log(`All good, task added`);
        this.#taskList.addTask({
          id: this.#tasks.length + 1,
          title: data.title,
          status: data.status,
        });
      } else {
        console.log(`Could not connect to server`)
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
    this.updateTasktext();
  }

  /**
   * Sends a deleterequest with a task to the server.
   * Method only uses the task ID to delete with the task endpoint.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendDeleteRequest(data) {
    try {
      const response = await fetch(`./api/task/${data.id}`, {"method": "DELETE"});
      if (response.ok) {
        console.log(`All good, task deleted`);
        this.#taskList.removeTask(data.id);
      } else {
        console.log(`Could not connect to server`)
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
    this.updateTasktext();
  }

  /**
   * Sends a PUT request with the updated task status to the server.
   * @param data
   * @returns {Promise<void>}
   */
  async #sendPutRequest(data) {
    if (!data || !data.status) {
      console.log("Invalid status data");
      return;
    }

    const requestSettings = {
      "method": "PUT",
      "headers": {"Content-Type": "application/json; charset=utf-8"},
      "body": JSON.stringify({status: data.status}),
      "cache": "no-cache",
      "redirect": "error"
    };

    try {
      const response = await fetch(`./api/task/${data.id}`, requestSettings);
      if (response.ok) {
        console.log(`All good, data put`);
        this.#taskList.updateTask({
          id: data.id,
          status: data.status
        });
        this.updateTasktext();
      } else {
        console.log(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}
customElements.define("groupx-tasktemplate", TaskController);
