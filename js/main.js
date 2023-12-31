
const tableBody = document.getElementById("tbody");
const form = document.getElementById("add-user-form");
const url = "https://jsonplaceholder.typicode.com/users";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.map((comment) => {
      const { id, name, email, username } = comment;
// console.log(id, name, email, body);
      const row = document.createElement("tr");
      row.innerHTML = `
             <td>${id}</td>      
             <td>${name}</td>      
             <td>${username}</td>      
             <td>${email}</td>      
             
             <td>
                <button class="edit-button" data-id=${id}  data-name=${name} data-lname=${username} data-email=${email}>Edit</button>
             </td>
             <td>
                <button class="delete-button" data-id=${id} >Delete</button>
             </td>
        `;

      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error(error));




  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("update-id").value;
    const name = document.getElementById("name").value;
    const username = document.getElementById("lName").value;
    const email = document.getElementById("email").value;

    if (id) {
      updateUser(id, name, lName, email);
      form.reset();
    } else {
      const formData = {
        name: name,
        lname: username,
        email: email,
      };

      fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          const row = document.createElement("tr");

          row.innerHTML = `
        <td>${data.id}</td>      
        <td>${name}</td>      
        <td>${username}</td>      
        <td>${email}</td>      
        <td>
           <button class="edit-button" "data-id=${id}"  "data-name=${name}" data-lname=${username} data-email=${email}>Edit</button>
        </td>
        <td>
           <button class="delete-button" data-id=${id} >Delete</button>
        </td>
        `;
          tableBody.appendChild(row);
          form.reset();
        })
        .catch((error) => console.error(error));
    }
  });



  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
      const id = e.target.dataset.id;
      const name = e.target.dataset.name;
      const username = e.target.dataset.lname;
      const email = e.target.dataset.email;

      form.querySelector("#update-id").value = id;
      form.querySelector("#name").value = name;
      form.querySelector("#lName").value = username;
      form.querySelector("#email").value = email;

      document.querySelector("#save-user-button").textContent = "Update User";
    } else if (e.target.classList.contains("delete-button")) {
      const id = e.target.dataset.id;

      deleteUser(id)
        .then(() => {
          const tableRow = e.target.closest("tr");
          tableRow.remove();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  async function deleteUser(id) {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        return response.text();
      }
    } catch (error) {
      return console.error(error);
    }
  }

  function updateUser(id, name, username, email) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);

    return fetch(`${url}/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const tableRows = document.querySelectorAll("#user-list tbody tr");

        for (let row of tableRows) {
          if (row.cells[0].textContent === id.toString()) {
            row.cells[1].textContent = name;
            row.cells[2].textContent = username;
            row.cells[3].textContent = email;
          }
        }
        return data;
      })
      .catch((error) => console.error(error));
  }

  // import myFun from "./allFunctions.js";

  // console.log(myFun());