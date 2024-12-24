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

function getMonitors() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();
        let filteredProducts = Object.keys(products).filter((productId) => {
          let lapProduct = products[productId].category === "Monitors";
          return lapProduct;
        });
        console.log(products);
        let card = "";
        filteredProducts.forEach((productId) => {
          let product = products[productId];
          card += `
              <div class = "item">
              <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h2 class="product-title">${product.name}</h2>
                <p class="product-color">${product.color}</p>
                <p class="product-price">${product.price} EGP</p>
                <button class="card-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="card-btn"><i class="fa-regular fa-heart"></i></button>
                <a href="../productDetails/productDetails.html?id=${product.id}">View more</a>
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
  getMonitors();
};
