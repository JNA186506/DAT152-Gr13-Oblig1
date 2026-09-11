import {taskboxTemplate} from "./components.js";

class TaskBox extends HTMLElement {
   #shadow
   #dialog
   #allstatuses
   #newTaskCallbacks = new Map();

   constructor() {
       super();
       this.#shadow = this.attachShadow({mode: "open"});
       this.#allstatuses = [];
       this.buildDialog();
   }

   setStatuses(statuses) {
       this.#allstatuses = statuses;
       this.updateStatusOptions();
   }

   getDialog() {
       return this.#dialog;
   }

   updateStatusOptions() {
       const select = this.#shadow.querySelector("select");
       let htmlStatuses = "";
       this.#allstatuses.forEach((s, i) => {
           htmlStatuses +=
               `<option value="${i}"> ${s} </option> \n`
       });

       select.innerHTML = htmlStatuses;
   }

    buildDialog() {
       const dialogClone = taskboxTemplate.content.cloneNode(true);
       this.#shadow.appendChild(dialogClone);
       this.showDialog();
    }

    showDialog() {
        this.#dialog = this.#shadow.querySelector("dialog");
        const spanElm = this.#dialog.querySelector("span");
        const postBtn = this.#dialog.querySelector("button");

        const select = this.#shadow.querySelector("select");
        const input = this.#shadow.querySelector("input");

        spanElm.addEventListener("click", () => {
            this.#dialog.close();
        });

        postBtn.addEventListener("click", () => {
            const title = input.value;
            const selectedValue = select.options[select.value].textContent;

            if (title === "" || selectedValue === "") {
                return;
            }

            this.#newTaskCallbacks.get("add")({
                title: title,
                status: selectedValue
            });
            input.value = "";
            this.#dialog.close();
        })
    }

    addNewTaskCallback(callback) {
       const callbackId = "add";
       this.#newTaskCallbacks.set(callbackId, callback);
       return callbackId;
    }



}
customElements.define("groupx-taskbox", TaskBox);