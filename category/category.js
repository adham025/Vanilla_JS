import { firebaseConfig } from "../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

function writeCategoryData(categoryName) {
  const id = Date.now(); // Use current timestamp for a unique ID
  const db = getDatabase();
  set(ref(db, "categories/" + id), {
    id: id,
    name: categoryName,
  })
    .then(() => {
      let Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "Added Successfully",
      });
      getCategories();
    })
    .catch((error) => {
      // Show error message using SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the category: " + error.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    });
}

let categoryName = document.getElementById("categoryName");
let error = document.getElementById("error");
categoryName.addEventListener("focus", () => {
  categoryName.style.border = "solid 1px #007bff";
});
categoryName.addEventListener("blur", () => {
  textValidation();
});
function textValidation() {
  categoryName.style.border = "";
  if (categoryName.value.length < 3 && categoryName.value != "") {
    error.style.display = "inline";
    return false;
  } else {
    error.style.display = "none";
    return true;
  }
}

let form = document.getElementById("category-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (textValidation()) {
    let categoryNameValue = categoryName.value.trim();
    if (categoryNameValue !== "") {
      writeCategoryData(categoryNameValue);
      // console.log("Done");
      form.reset();
    } else {
      error.style.display = "inline";
    }
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  form.reset();
});

window.editCategory = function (id) {
  let updateBtn = document.getElementById("updateBtn");
  const db = getDatabase();
  const categoryRef = ref(db, "categories/" + id);
  get(categoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const categoryData = snapshot.val();
        const categoryName = categoryData.name;
        document.getElementById("categoryName").value = categoryName;
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.style.display = "none";
        updateBtn.style.display = "flex";
        window.scrollTo(0, 0);
        updateBtn.onclick = function (e) {
          e.preventDefault();
          const newCategoryName = document.getElementById("categoryName").value;
          if (newCategoryName && newCategoryName !== categoryName) {
            update(ref(db, "categories/" + id), {
              name: newCategoryName,
            })
              .then(() => {
                let Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
                Toast.fire({
                  icon: "success",
                  title: "Updated Successfully",
                });
                getCategories();
                document.getElementById("category-form").reset();
                submitBtn.style.display = "flex";
                updateBtn.style.display = "none";
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error!",
                  text:
                    "There was an error deleting the category: " +
                    error.message,
                  icon: "error",
                  confirmButtonText: "Try Again",
                });
              });
          } else {
            Swal.fire({
              icon: "info",
              title: "No changes detected",
              text: "The category name remains the same.",
              confirmButtonText: "OK",
            });
          }
        };
      } else {
        Swal.fire({
          icon: "error",
          title: "Category not found",
          confirmButtonText: "OK",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error retrieving category data",
        text: error.message,
        confirmButtonText: "OK",
      });
    });
};

window.deleteCategory = function (id) {
  const db = getDatabase();
  const categoryRef = ref(db, "categories/" + id);
  // Fetch the category data to get the name
  get(categoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const categoryData = snapshot.val();
        const categoryName = categoryData.name;
        // console.log("Deleting category with name:", categoryName);
        remove(categoryRef)
          .then(() => {
            // console.log("Deleted Successfully");
            let Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Deleted Successfully",
            });
            getCategories();
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            Swal.fire({
              title: "Error!",
              text:
                "There was an error deleting the category: " + error.message,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          });
      } else {
        console.log("No such category found!");
      }
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
};

function getCategories() {
  var categoryTableBody = document.querySelector(".table tbody");
  let categoriesRef = ref(db, "categories/");
  categoryTableBody.innerHTML = "";
  get(categoriesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let categories = snapshot.val();
        let count = 0;
        categoryTableBody.innerHTML = "";
        Object.keys(categories).forEach((categoryId) => {
          let category = categories[categoryId];
          let row = document.createElement("tr");
          count++;
          row.innerHTML = `
                <td>${count}</td>
                <td>${category.name}</td>
                <td>
                <button onclick="editCategory(${category.id})" class ="update-btn">Edit</button>
                <button onclick="deleteCategory(${category.id})" class="delete-btn">Delete</button>
                </td>
            `;
          categoryTableBody.appendChild(row);
        });
      } else {
        // Display a "No Categories Found" message
        let row = document.createElement("tr");
        row.innerHTML = `<td style="text-align:center;font-size:20px" colspan="3">No Categories Found</td>`;
        categoryTableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

window.onload = function () {
  getCategories();
};
