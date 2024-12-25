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

function getMobiles() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();
        let filteredProducts = Object.keys(products).filter((productId) => {
          return products[productId].category === "Mobiles";
        });
        let card = "";
        filteredProducts.forEach((productId) => {
          let product = products[productId];
          card += `
              <div class = "item">
              <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h2 class="product-title">${product.name}</h2>
                <p class="product-color">${product.color}</p>
                <p class="product-price">${product.price} EGP</p>
                <button data-click="0" onclick="addCart('${product.id}', this)" class="card-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="card-btn"><i class="fa-regular fa-heart"></i></button>
                <a href="../productDetails/productDetails.html?id=${product.id}" target="blank">View more</a>
              </div>
            `;
          document.querySelector(".products").innerHTML = card;
        });
      } else {
        console.log("No products found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

window.onload = function () {
  getMobiles();
};

let count = 0;
window.addCart = async (id, element) => {
  console.log(id);
  if (localStorage.getItem("userId_iti") != null) {
    let userId = localStorage.getItem("userId_iti");

    if (element.getAttribute("data-click") == "0") {
      count = 1;
      element.setAttribute("data-click", count);
    } else {
      count = +element.getAttribute("data-click") + 1;
      element.setAttribute("data-click", count);
    }

    addToCart(id, userId, count);
    sweetAdd();
  } else {
    let result = await sweetValidLogin();
    if (result.isConfirmed) {
      window.location.href = "../registration/login/login.html";
    }
  }
};

function addToCart(id, userID, countVal) {
  update(ref(db, `cart/${userID}/` + id), {
    productId: id,
    count: countVal,
  }).then((data) => {});
}

async function sweetValidLogin() {
  const result = await Swal.fire({
    title: "You are not registrated?",
    text: "If you want to make this action, please registered Now!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Login Now!",
  });
  return result;
}

function sweetAdd() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Product added successfully to your cart",
  });
}
