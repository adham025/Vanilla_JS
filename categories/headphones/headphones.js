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

let selectedBrands = new Set();
let selectedColors = new Set();
let maxPrice = null;

function getHeadphones() {
  let productsRef = ref(db, "products/");
  get(productsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let products = snapshot.val();
        console.log(products);

        let filteredProducts = Object.keys(products).filter((productId) => {
          let product = products[productId];
          let matchesCategory = product.category === "Headphones";

          let matchesBrand =
            selectedBrands.size === 0 || selectedBrands.has(product.brand);
          let matchesColor =
            selectedColors.size === 0 || selectedColors.has(product.color);
          let matchesPrice = maxPrice === null || product.price <= maxPrice;

          return (
            matchesCategory && matchesBrand && matchesColor && matchesPrice
          );
        });

        displayProducts(filteredProducts.map((id) => products[id]));
      } else {
        document.querySelector(".products").innerHTML =
          "<p>No products found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

document.getElementById("sort").addEventListener("change", (e) => {
  let productsContainer = document.querySelector(".products");
  if (productsContainer) {
    let productElements = Array.from(productsContainer.children);
    let products = productElements.map((e) => ({
      id: e
        .querySelector(".card-btn")
        .getAttribute("onclick")
        .match(/'([^']+)'/)[1],
      name: e.querySelector(".product-title").textContent,
      color: e.querySelector(".product-color").textContent,
      price: parseFloat(
        e.querySelector(".product-price").textContent.replace(" EGP", "")
      ),
      image: e.querySelector(".product-image").src,
    }));
    if (e.target.value === "lowest") {
      products.sort((a, b) => a.price - b.price);
      displayProducts(products);
    } else {
      products.sort((a, b) => b.price - a.price);
      displayProducts(products);
    }
  }
});

function displayProducts(products) {
  const productsContainer = document.querySelector(".products");
  if (products.length === 0) {
    console.log(products);

    productsContainer.innerHTML = "<p>No products match your filters.</p>";
    return;
  }

  let card = "";
  products.forEach((product) => {
    card += `
      <div class="item">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h2 class="product-title">${product.name}</h2>
        <p class="product-color">${product.color}</p>
        <p class="product-price">${product.price} EGP</p>
        <button data-click="0" onclick="addCart('${product.id}', this)" class="card-btn">
          <i class="fa-solid fa-cart-shopping"></i>
        </button>
        <button class="card-btn"><i class="fa-regular fa-heart"></i></button>
        <a href="../productDetails/productDetails.html?id=${product.id}" target="_blank">View more</a>
      </div>
    `;
  });

  productsContainer.innerHTML = card;
}

document.querySelectorAll(".brand-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectedBrands.add(event.target.value);
      console.log(selectedBrands);
    } else {
      selectedBrands.delete(event.target.value);
    }
    getHeadphones();
  });
});

document.querySelectorAll(".color-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectedColors.add(event.target.value);
    } else {
      selectedColors.delete(event.target.value);
    }
    getHeadphones();
  });
});

document.getElementById("priceRange").addEventListener("input", (event) => {
  document.getElementById("priceRangeValue").textContent = event.target.value;
});

document.getElementById("applyPriceFilter").addEventListener("click", () => {
  maxPrice = parseInt(document.getElementById("priceRange").value);
  getHeadphones();
});

window.onload = getHeadphones;
