let activeList = {};

const listDescription = document.getElementById("list-container");
const createListBtn = document.getElementById("save-list");
const inputListName = document.getElementById("task-name");
const submitTaskButton = document.getElementById("btn-post");
const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates')) || {};

const formEl = document.querySelector(".new-task-form");
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  saveList();
});

const getList = (id) =>
  fetch(`/api/lists/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#tbody");
      const newRow = document.createElement("tr");
      const listCell = document.createElement("td");
      listCell.textContent = data;
      newRow.appendChild(listCell);
      tableBody.appendChild(newRow);
    });

const displayList = (id) =>
  fetch(`/api/lists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#task-table tbody");
      tableBody.innerHTML = "";
      data.tasks.forEach((task) => {
        if (task.list_body) {
          const row = document.createElement("tr");
          const checkboxId = `checkbox-${task.id}`
          const isChecked = checkboxStates[checkboxId] || false;
          row.innerHTML = ` <th scope="row">
          <div style="display: flex; justify-content: center; align-items: center; margin-top: .5rem">
            <input class="todo-checkbox" type="checkbox" id="${checkboxId}" ${isChecked ? 'checked' : ''}>
          </div>
          </th>
          <td class="text-break">
          ${task.list_body}<button class="btn-delete" style="float: right;" data-task-id="${task.id}">Delete</button>
          </td>
          `;
          tableBody.appendChild(row);
          const checkbox = row.querySelector('.todo-checkbox');
          checkbox.addEventListener('change', () => {
            checkboxStates[checkboxId] = checkbox.checked;
            localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
          })
        }
      });
    });

const saveList = () => {
  const inputListNameText = inputListName.value;
  fetch("/api/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ list_body: inputListNameText }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayList();
    });
};

const tableBody = document.querySelector("#task-table tbody");
tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const taskId = event.target.dataset.taskId;
    deleteList(taskId);
  }
});

const deleteList = (taskId) => {
  fetch(`/api/lists/${taskId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        displayList();
      } else {
        console.error('Failed to delete task', response.status);
      }
    })
    .catch((error) => {
      console.error('Error in fetch request:', error);
    });
};

displayList();