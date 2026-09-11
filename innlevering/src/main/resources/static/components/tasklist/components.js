export const template = document.createElement("template");
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
export const initContent = document.createElement("template");
initContent.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${new URL('tasklist.css', import.meta.url)}">

    <div id="tasklist"></div>`;

export const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

export const taskrow = document.createElement("template");
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

export const taskboxTemplate = document.createElement("template");
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
