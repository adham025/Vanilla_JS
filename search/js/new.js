import { firebaseConfig } from "../../config.js";
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

const productsRef = ref(db, "products/");
get(productsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      let products = snapshot.val();

      const searchDiv = document.getElementById("searchgg");
      let searchIcon = document.getElementById("searchBtn");
      const productData = document.querySelector("#searchLayout");
      searchIcon.addEventListener("click", () => {
        const searchVal = searchDiv.value;
        console.log(products);

        const matchedProducts = Object.entries(products).filter(
          ([key, product]) => {
            console.log(key);
            console.log(product);

            return (
              product.name.toLowerCase().includes(searchVal.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchVal.toLowerCase())
            );
          }
        );

        productData.innerHTML = "";
        if (matchedProducts.length > 0) {
          let container = null;
          matchedProducts.forEach(([key, product]) => {
            container = `
              <div class="productCard">
                <h2>${product.name}</h2>
                <p>${product.price}EGP</p>
                <img src="${product.image}">
              </div>
            `;
            productData.innerHTML += container;
          });
        } else {
          productData.innerHTML = "No products found";
        }
      });
    }
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
