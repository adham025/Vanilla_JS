import { firebaseConfig } from "../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

import {
  getDatabase,
  ref,
  set,
  remove,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getStorage,
  ref as imageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const storage = getStorage();
const db = getDatabase();

function toUploadImage() {
  var productImg = document.getElementById("productImage");

  let file = productImg.files[0];
  let imageName = file.name;
  const storageRef = imageRef(storage, "productImages/" + imageName);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // link = downloadURL;
          await downloadURL;
          resolve(downloadURL);
        });
      }
    );
  });
}

window.deleteproduct = function (id) {
  const db = getDatabase();
  const categoryRef = ref(db, "products/" + id);
  remove(categoryRef);
};

const categorylist = ref(db, "categories/");
onValue(categorylist, async (snapshot) => {
  let data = await snapshot.val();
  let catego = document.getElementById("category");
  for (let key in data) {
    catego.innerHTML += `<option value="${data[key].name}">${data[key].name}</option>`;
  }
});

function writeUserData(
  imgSrc,
  proname,
  color,
  brand,
  category,
  price,
  stock,
  description
) {
  var id = Date.now();
  set(ref(db, "products/" + id), {
    id: id,
    image: imgSrc,
    name: proname,
    color: color,
    brand: brand,
    category: category,
    price: price,
    stock: stock,
    description: description,
  });
}
const links = document.querySelectorAll(".sidebar a");
var id;
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    for (let j = 0; j < links.length; j++) {
      links[j].classListNaNpxove("active");
    }
    links[i].classList.add("active");
  });
}
var form = document.getElementById("productForm");
var errorMessage = document.getElementsByClassName("errorMessage");
let add = document.getElementById("add");
var products = [];

add.addEventListener("click", async (e) => {
  e.preventDefault();
  var inputs = document.querySelectorAll("#productForm input");
  var productImg = document.getElementById("productImage");
  var proname = document.getElementById("name").value;
  var color = document.getElementById("color").value;
  var brand = document.getElementById("brand").value;
  var category = document.getElementById("category").value;
  var price = document.getElementById("price").value;
  var stock = document.getElementById("stock").value;
  var description = document.getElementById("description").value;

  inputs.forEach((input) => {
    if (input.value === "") {
      input.nextElementSibling.textContent = "This field is required";
      input.style.border = "2px solid red";
    } else {
      input.style.border = "2px solid #ccc";
      input.nextElementSibling.textContent = "";
    }

    input.addEventListener("change", () => {
      if (input.value === "") {
        input.nextElementSibling.textContent = "This field is required";
        input.style.border = "2px solid red";
      } else {
        input.style.border = "2px solid #ccc";
        input.nextElementSibling.textContent = "";
      }
    });
    input.addEventListener("keyup", () => {
      if (input.value === "") {
        input.nextElementSibling.textContent = "This field is required";
        input.style.border = "2px solid red";
      } else {
        input.style.border = "2px solid #ccc";
        input.nextElementSibling.textContent = "";
      }
    });
  });

  if (
    !productImg ||
    !proname ||
    !color ||
    !brand ||
    !category ||
    !price ||
    !stock ||
    !description
  ) {
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  if (price <= 0 || stock <= 0) {
    errorMessage.textContent = "Price and stock must be greater than zero.";
    return;
  }

  errorMessage.textContent = "";
  let imgSrc = await toUploadImage();

  writeUserData(
    imgSrc,
    proname,
    color,
    brand,
    category,
    price,
    stock,
    description
  );
  form.reset();
});

const productsdata = ref(db, "products");
var tbody = document.getElementById("tbody");

function getData() {
  return new Promise((resolve, reject) => {
    onValue(productsdata, async (snapshot) => {
      let productsBacked = await snapshot.val();
      resolve(productsBacked);
    });
  });
}
let test = await getData();
let count = 0;
onValue(productsdata, async (snapshot) => {
  let productsBacked = await snapshot.val();

  tbody.innerHTML = "";

  for (let key in productsBacked) {
    count++;
    tbody.innerHTML += `
                <tr>
                <td>${count}</td>
                <td class="image-cell">
                  <img class="previewImage" src=${productsBacked[key].image}   alt="" />
                </td>
                <td>${productsBacked[key].name}</td>
                <td>${productsBacked[key].color}</td>
                <td>${productsBacked[key].brand}</td>
                <td>${productsBacked[key].category}</td>
                <td>${productsBacked[key].price} EGP</td>
                <td>${productsBacked[key].stock}</td>
                <td><button onclick="updateProFun(${productsBacked[key].id})" class="update-btn">Update</button></td>
                <td><button onclick="deleteproduct(${productsBacked[key].id})" class="delete-btn">Delete</button></td>
              </tr>
      `;
  }
});

let productId;

window.updateProFun = (id) => {
  document.getElementById("add").style.display = "none";
  document.getElementById("update").style.display = "block";
  document.getElementById("productImage").setAttribute("disabled", "true");
  document.getElementById("name").value = test[id].name;
  document.getElementById("color").value = test[id].color;
  document.getElementById("brand").value = test[id].brand;
  document.getElementById("category").value = test[id].category;
  document.getElementById("price").value = test[id].price;
  document.getElementById("stock").value = test[id].stock;
  document.getElementById("description").value = test[id].description;
  productId = id;
};

let updateBtn = document.getElementById("update");

updateBtn.addEventListener("click", () => {
  document.getElementById("productImage").removeAttribute("disabled", "false");
  document.getElementById("add").style.display = "block";
  document.getElementById("update").style.display = "none";
  update(ref(db, "products/" + productId), {
    img: document.getElementById("productImage"),

    name: document.getElementById("name").value,
    color: document.getElementById("color").value,
    brand: document.getElementById("brand").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value), // تأكد من تحويل السعر إلى رقم
    stock: parseInt(document.getElementById("stock").value), // الكمية يجب أن تكون رقم
    description: document.getElementById("description").value,
  })
    .then((respo) => {
      console.log(respo);

      console.log("Product updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
  form.reset();
});
