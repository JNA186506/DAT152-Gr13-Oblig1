export const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" type="text/css"
    href="${new URL("taskview.css", import.meta.url)}">
      <h1>Tasks</h1>
        <div id="message"><p>Waiting for server data.</p></div>
      <div id="newtask">
        <button type="button" disabled>New task</button>
      </div>
  <!-- The task list -->
  <group13-TASKLIST></group13-TASKLIST>
  <!-- The Modal -->
  <group13-TASKBOX></group13-TASKBOX>

`;
