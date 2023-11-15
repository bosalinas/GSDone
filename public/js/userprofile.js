let activeList = {};

const listDescription = document.getElementById("list-container");
const createListBtn = document.getElementById("save-list");
const inputListName = document.getElementById("task-name");
const submitTaskButton = document.getElementById("btn-post");
// const deleteTaskButton = document.getElementById("btn-delete");

//event listener to submit form
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

// gets task and displays it in new table row
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

      //load checkbox states from localStorage
      const checkboxStates = JSON.parse(localStorage.getItem('checkboxId')) || {};

      data.tasks.forEach((task) => {
        if (task.list_body) {
          const row = document.createElement("tr");
          //TODO:isChecked is staying false even though it's being clicked AKA 'on change'
          const checkboxId = `checkbox-${task.id}`
          const isChecked = checkboxStates[checkboxId] || false;
          console.log("checkboxId:", checkboxId);
          console.log("isChecked:", isChecked);
          row.innerHTML = ` 
          <th scope="row">
            <input 
              class="todo-checkbox" 
              type="checkbox" 
              id="${checkboxId}"
              ${isChecked ? 'checked': ''}
              >
          </th>
          <td class="text-break">${task.list_body} 
          <button 
            class="btn-delete" 
            data-task-id="${task.id}">Delete</button> 
          </td>
          `;

          tableBody.appendChild(row);

          //add event listener to checkboxes
          const checkbox = row.querySelector('.todo-checkbox');
          console.log("checkbox:", checkbox);
          checkbox.addEventListener('change', () => {
            //update checkbox state in local storage
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
// NEW CODE: having the event listener inside the displayList() function means that it fires over and over again. That was causing the error.
const tableBody = document.querySelector("#task-table tbody");
tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const taskId = event.target.dataset.taskId;
    deleteList(taskId);
  }
});
//delete button
// PASS taskId PARAMETER to deleteList function to be able to access it within function and use it in fetch request to delete the list
const deleteList = (taskId) => {
  console.log("deleting task with ID:", taskId);
  fetch(`/api/lists/${taskId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log('Task deleted successfully');
        displayList(); // Refresh the displayed list after deletion
      } else {
        console.error('Failed to delete Task:', response.status);
      }
    })
    .catch((error) => {
      console.error('Error in fetch request:', error);
    });
};

displayList();