import { firebaseConfig } from "../../config.js";
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

window.deleteProduct = function (id) {
  const db = getDatabase();
  const categoryRef = ref(db, "products/" + id);
  remove(categoryRef);
};
let catego = document.getElementById("category");
let arr = [];
const categoryList = ref(db, "categories/");
onValue(categoryList, async (snapshot) => {
  let data = await snapshot.val();

  for (let key in data) {
    arr.push(data[key].name);
  }
  arr.sort().forEach(function (el) {
    catego.innerHTML += `<option value="${el}">${el}</option>`;
  });
});

document.getElementById("category").addEventListener("change", function () {
  const brandSelect = document.getElementById("brand");
  const selectedCategory = this.value;

  const brands = {
    Headphones: ["Audio", "Bose", "JBL", "Sony"],
    Laptops: ["Acer", "Asus", "Dell", "Lenovo", "MSI"],
    Mobiles: ["Apple", "Huawei", "Oppo", "Realme", "Samsung"],
    Monitors: ["Asus", "Dell", "LG", "Samsung", "Tornado"],
    Smartwatches: ["Apple", "Huawei", "Realme", "Samsung"],
  };

  brandSelect.innerHTML =
    '<option value="" disabled selected>Select The Brand</option>';

  // Populate the new options
  if (brands[selectedCategory]) {
    brands[selectedCategory].forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }
});

function writeUserData(
  imgSrc,
  proname,
  color,
  brand,
  category,
  price,
  quantity,
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
    quantity: quantity,
    description: description,
  });
}
const links = document.querySelectorAll(".sidebar a");
var id;
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    for (let j = 0; j < links.length; j++) {
      links[j].classList.remove("active");
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
  var quantity = document.getElementById("quantity").value;
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
    !quantity ||
    !description
  ) {
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  if (price <= 0) {
    errorMessage.textContent = "Price must be greater than zero.";
    return;
  }
  if (quantity <= 0) {
    errorMessage.textContent = "Stock must be greater than zero.";
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
    quantity,
    description
  );
  form.reset();
});

const productsData = ref(db, "products");
var tbody = document.getElementById("tbody");

function getData() {
  return new Promise((resolve, reject) => {
    onValue(productsData, async (snapshot) => {
      let productsBacked = await snapshot.val();
      resolve(productsBacked);
    });
  });
}
let test = await getData();
let count = 0;
onValue(productsData, async (snapshot) => {
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
                <td>${productsBacked[key].quantity}</td>
                <td><button onclick="updateProFun(${productsBacked[key].id})" class="update-btn">Update</button></td>
                <td><button onclick="deleteProduct(${productsBacked[key].id})" class="delete-btn">Delete</button></td>
              </tr>
      `;
  }
});

let productId;

window.updateProFun = (id) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  document.getElementById("add").style.display = "none";
  document.getElementById("update").style.display = "block";
  document.getElementById("productImage").setAttribute("disabled", "true");
  document.getElementById("name").value = test[id].name;
  document.getElementById("color").value = test[id].color;
  document.getElementById("brand").value = test[id].brand;
  document.getElementById("category").value = test[id].category;
  document.getElementById("price").value = test[id].price;
  document.getElementById("quantity").value = test[id].quantity;
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
    price: parseFloat(document.getElementById("price").value),
    quantity: parseInt(document.getElementById("quantity").value),
    description: document.getElementById("description").value,
  })
    .then(() => {
      console.log("Product updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
  form.reset();
});
