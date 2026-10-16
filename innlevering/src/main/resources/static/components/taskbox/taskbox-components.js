export const taskboxTemplate = document.createElement("template");
taskboxTemplate.innerHTML = `
  <link rel="stylesheet" type="text/css"
    href="${new URL("taskbox.css", import.meta.url)}">
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
