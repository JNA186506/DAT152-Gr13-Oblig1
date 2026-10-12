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
   setStatusesList(statuses) {
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
     this.#shadow.querySelectorAll("select").forEach(select => {
       const placeholder = document.createElement("option");
       placeholder.textContent = "Modify";
       placeholder.selected = true;
       placeholder.disabled = true;

       select.replaceChildren(placeholder);

       this.#allstatuses.forEach((status, index) => {
           let option = document.createElement("option");
           option.value = String(index);
           option.textContent = status;
           select.appendChild(option);
       });
     });
   }

    /**
     * Builds the dialog from template, and populates it with the #show method.
     */
    buildDialog() {
       const dialogClone = taskboxTemplate.content.cloneNode(true);
       this.#shadow.appendChild(dialogClone);
       this.#show();
    }

    /**
     * Adds focus to the input element.
     * Populates the dialog window with listeners.
     */
    #show() {
        this.#dialog = this.#shadow.querySelector("dialog");
        const spanElm = this.#dialog.querySelector("span");
        const postBtn = this.#dialog.querySelectorAll("button");

        const select = this.#shadow.querySelector("select");
        const input = this.#shadow.querySelector("input");

        input.focus();

        spanElm.addEventListener("click", () => {
            this.#dialog.close();
        });

        postBtn.forEach(button => {
          button.addEventListener("click", () => {
            const title = input.value.trim();
            const status = this.#allstatuses[Number(select.value)];

            if (title === "" || select.selectedIndex <= 0 ||
                status === undefined) {
              return;
            }

            this.#taskboxCallbacks.forEach(callback =>
              callback({ title, status })
            );

            input.value = "";
            this.#dialog.close();
          });
        });
    }

    addNewTaskCallback(callback) {
       const callbackId = Symbol("new");
       this.#taskboxCallbacks.set(callbackId, callback);
       return callbackId;
    }
}
customElements.define("group13-taskbox", TaskBox);
