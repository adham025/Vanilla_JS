import { firebaseConfig } from "../../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

import {
  getDatabase,
  get,
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

let usersRef = ref(db, "users/");
get(usersRef).then((snapshot) => {
  let data = snapshot.val();
  var usecounter = 0;

  for (let key in data) {
    usecounter++;
  }

  document.getElementById("usercou").innerHTML = usecounter;
});

const categorylist = ref(db, "products");
onValue(categorylist, async (snapshot) => {
  let data = await snapshot.val();
  var bestsaller = [];
  var hotproduct = [];

  let counter = 1;

  for (let key in data) {
    counter++;

    if (data[key].quantity < 6) {
      bestsaller.push(data[key]);
    } else if (data[key].quantity > 6 && data[key].quantity < 11) {
      hotproduct.push(data[key]);
      console.log(hotproduct);
    }
  }

  var listt = document.getElementById("list");

  for (let i = 0; i < hotproduct.length; i++) {
    console.log(hotproduct);

    listt.innerHTML += `
        <div class="display">
      <img class="imgg" src=" ${hotproduct[i].image}" alt="" />
      <span class="des"> ${hotproduct[i].name}</span>
    </div>

`;
  }
  document.getElementById("countprod").innerHTML = counter;

  var list2 = document.getElementById("list2");

  console.log(bestsaller);

  for (let i = 0; i < bestsaller.length; i++) {
    list2.innerHTML += `
                  <div class="display">
                <img class="imgg" src=" ${bestsaller[i].image}" alt="" />
                <span class="des"> ${bestsaller[i].name}</span>

              </div>
  `;
  }
});
