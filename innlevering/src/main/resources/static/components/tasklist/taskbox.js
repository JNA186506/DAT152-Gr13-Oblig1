import {taskboxTemplate} from "./components.js";

class TaskBox extends HTMLElement {
   #shadow
   #dialog
   #allstatuses
   #taskboxCallbacks = new Map();

   constructor() {
       super();
       this.#shadow = this.attachShadow({mode: 'closed'});
       this.#allstatuses = [];
       this.buildDialog();
   }

    /**
     * Sets and updates statuses
     *
     * @param statuses
     */
   setStatuses(statuses) {
       this.#allstatuses = statuses;
       this.updateStatusOptions();
   }

    /**
     * Opens the dialog window
     */
   openDialog() {
       this.#dialog.showModal();
   }

    /**
     * Updates the selects for the dialog window
     */
   updateStatusOptions() {
       const select = this.#shadow.querySelector("select");
       let htmlStatuses = "";
       this.#allstatuses.forEach((s, i) => {
           htmlStatuses +=
               `<option value="${i}"> ${s} </option> \n`
       });

       select.innerHTML = htmlStatuses;
   }

    /**
     * Builds the dialog from template, and populates it with the showDialog method.
     */
    buildDialog() {
       const dialogClone = taskboxTemplate.content.cloneNode(true);
       this.#shadow.appendChild(dialogClone);
       this.showDialog();
    }

    /**
     * Adds focus to the input element.
     * Populates the dialog window with listeners.
     */
    showDialog() {
        this.#dialog = this.#shadow.querySelector("dialog");
        const spanElm = this.#dialog.querySelector("span");
        const postBtn = this.#dialog.querySelectorAll("button");

        const select = this.#shadow.querySelector("select");
        const input = this.#shadow.querySelector("input");

        input.focus();

        spanElm.addEventListener("click", () => {
            this.#dialog.close();
        });

        postBtn.forEach(() => {
            addEventListener("click", () => {
                const title = input.value;
                const selectedValue = select.options[select.value].textContent;

                if (title === "" || selectedValue === "") {
                    return;
                }

                this.#taskboxCallbacks.forEach(callback =>
                    callback({title: title, status: selectedValue})
                );

                input.value = "";
                this.#dialog.close();
            })
        });
    }

    addNewTaskCallback(callback) {
       const callbackId = Symbol("new");
       this.#taskboxCallbacks.set(callbackId, callback);
       return callbackId;
    }
}
customElements.define("group13-taskbox", TaskBox);
