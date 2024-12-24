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

let container = document.querySelector(".container");
let data;
async function getIdsOfProducts() {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem("userId_iti") != null) {
      let userId = localStorage.getItem("userId_iti");
      let usersRef = ref(db, "cart/" + userId);
      get(usersRef).then(async (snapshot) => {
        data = await snapshot.val();
        resolve(data);
      });
    }
  });
}

async function displayCartProducts() {
  let productsIDS = await getIdsOfProducts();
  let promiseArr = [];
  for (let product in productsIDS) {
    let usersRef = ref(db, "products/" + product);
    let promise = get(usersRef).then((snapshot) => snapshot.val());
    promiseArr.push(promise);
  }
  return [Promise.all(promiseArr),productsIDS];
}
let productsIDS
async function displayProducts() {
  let result = await displayCartProducts();
  let resultArr = await result[0];
  productsIDS = await result[1];
    console.log(productsIDS);
    
  let box = "";

  for (let i = 0; i < resultArr.length; i++) {
    box += `
        <div class = "item">
            <div class="left">
                <img src="${resultArr[i].image}" alt="${
      resultArr[i].name
    }" class="product-image" />
            </div>
            <div class="right">
                <div class="title-flex">
                    <h2 class="product-title">${resultArr[i].name}</h2>
                    <h2 class="product-price">${resultArr[i].price} EGP</h2>
                </div>
                <p class="product-color"><span style="background-color: ${
                  resultArr[i].color
                }" class="divColor"></span>${resultArr[i].color}</p>
                <p class="product-desc">${resultArr[i].description} EGP</p>
                <div class="increment-flex">
                    <button onclick="deleteActualProduct('${resultArr[i].id}')" class="card-btn"><i class="fa-solid fa-trash-can"></i></button>
                    <div class="quantity">
                        <button onclick="minusFun('${productsIDS[resultArr[i].id].count}','${
                          resultArr[i].id
                        }')" class="minus">-</button>
                        <input type="number" value="${
                          productsIDS[resultArr[i].id].count
                        }" min="1" />
                        <button onclick="plusFun('${productsIDS[resultArr[i].id].count}','${
                          resultArr[i].id
                        }')" class="plus">+</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  }
  container.innerHTML = box;
}
displayProducts();

window.minusFun = (countVal, id) => {
  let userId = localStorage.getItem("userId_iti");

  if (+countVal > 1) {
    update(ref(db, `cart/${userId}/` + id), {
      count: +countVal - 1,
    })
      .then((data) => {
        displayProducts();
        sweetCountProduct("product's quantity decreased successfully!","success")

      })
      .catch((error) => {
        console.log(error);
      });
  }else if(+countVal == 1){
    sweetCountProduct("product's quantity must be 1 or more","warning")
  }
};

window.plusFun = (countVal, id) => {
  let userId = localStorage.getItem("userId_iti");

  if (+countVal > 0) {
    update(ref(db, `cart/${userId}/` + id), {
      count: +countVal + 1,
    })
      .then((data) => {
        displayProducts();
        sweetCountProduct("product's quantity increased successfully!","success")
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

window.deleteActualProduct = async (id) => {
  let userId = localStorage.getItem("userId_iti");
  let usersRef = ref(db, `cart/${userId}/${id}`);
  console.log(productsIDS);
  
  remove(usersRef)
    .then(() => {
      delete productsIDS[id];
      displayProducts();
      sweetCountProduct("product removed successfully!","success")
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
};


function sweetCountProduct(msg , icon) {
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
    icon: icon,
    title: msg,
  });
}
