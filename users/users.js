import { firebaseConfig } from "../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let overlay = document.querySelector(".overlay");
overlay.style.display = "flex";
const db = getDatabase();
let usersRef = ref(db, "users/");
get(usersRef).then((snapshot) => {
  let data = snapshot.val();
  printData(data);
  overlay.style.display = "none";
});

let count = 0;
function printData(data) {
  let tbody = document.getElementById("tbody");
  let box = "";
  for (let key in data) {
    box += `
      <tr>
          <td>${++count}</td>
          <td>${data[key].firstName}</td>
          <td>${data[key].lastName}</td>
          <td>${data[key].email}</td>
          <td>
            <select data-current-role="${
              data[key].role
            }" onchange="changeRole(event,'${key}')">
                <option value="user" ${
                  data[key].role === "user" ? "selected" : ""
                }>User</option>
                <option value="admin" ${
                  data[key].role === "admin" ? "selected" : ""
                }>Admin</option>
            </select>
          </td>
      </tr>
    `;
  }
  tbody.innerHTML = box;
}

window.changeRole = async (e, id) => {
  let newRole = e.target.value;
  console.log(newRole);
  e.preventDefault();

  let okay = await sweetAlert();
  console.log(okay);

  if (okay) {
    update(ref(db, "users/" + id), {
      role: newRole,
    })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log(e.target.getAttribute("data-current-role"));

    e.target.value = e.target.getAttribute("data-current-role");
  }
};

async function sweetAlert() {
  const result = await Swal.fire({
    title: "Are you sure you want to change the role for this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Changed successfully",
      icon: "success",
    });
    return true; // Return true if confirmed
  }
  return false; // Return false if not confirmed
}
