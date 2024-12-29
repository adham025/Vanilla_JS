// import { firebaseConfig } from "../config.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
// import {
//   getDatabase,
//   ref,
//   set,
//   get,
//   remove,
//   update,
// } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getDatabase();
// let productsRef = ref(db, "products/");
// get(productsRef)
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       let products = snapshot.val();
//       console.log(products);
//      const productCard=document.getElementById("card")
//      Object.entries(products).forEach(([key,product])=> {
//     //    const product=products[key];
//     //    const {image,category}=product
//     //    const cardItem=document.createElement("div")
//     //    const img=document.createElement("img")
//     //    img.src=image
//     //    img.className='product-img'
//     //    const categoryElement=document.createElement("p")
//     //    categoryElement.textContent=`${category}`
//     //    cardItem.appendChild(img)
//     //    cardItem.appendChild(categoryElement)
//     //    productCard.appendChild(cardItem)

//      });
//     }else{
//         console.log("No products found.");
 
//     }
//       })
//   .catch((error) => {
//     console.error("Error fetching products:", error);
//   });
const categoryArr=[
    {img:"https://klbtheme.com/machic/wp-content/uploads/2021/09/product-3-400x400.jpg", category:"Laptops"},
    {img:"https://klbtheme.com/machic/wp-content/uploads/2021/09/product-10-400x400.jpg", category:"Mobiles"},
    {img:"https://klbtheme.com/machic/wp-content/uploads/2021/09/category-2.jpg", category:"Headphones"},
    {img:"https://i.pinimg.com/736x/a1/5f/5e/a15f5e01bb323bf7d68b5336d644a24c.jpg", category:"Monitors"}
]
const productCard=document.querySelector(".productsCards")
categoryArr.forEach(({img,category})=>{
const card=document.createElement("div")
    card.className='product-card'
const image=document.createElement("img")
    image.src=img
    image.className='product-img'
    const categoryElement=document.createElement("p")
    categoryElement.textContent=`${category}`
    card.appendChild(image)
    card.appendChild(categoryElement)
    productCard.appendChild(card)
})
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function showNextSlide() {
    slides[currentIndex].classList.remove('active'); // Hide the current slide
    currentIndex = (currentIndex + 1) % slides.length; // Move to the next slide
    slides[currentIndex].classList.add('active'); // Show the next slide
}

// Change slide every 5 seconds
setInterval(showNextSlide, 5000);
function startDecoratedCountdown(duration) {
    let timer = duration;
  
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');
  
    setInterval(() => {
      const hours = Math.floor(timer / 3600);
      const minutes = Math.floor((timer % 3600) / 60);
      const seconds = timer % 60;
  
      hoursElem.textContent = hours < 10 ? "0" + hours : hours;
      minutesElem.textContent = minutes < 10 ? "0" + minutes : minutes;
      secondsElem.textContent = seconds < 10 ? "0" + seconds : seconds;
  
      if (--timer < 0) {
        timer = duration; // Reset if you want it to loop; remove this line to stop at 0
      }
    }, 1000);
  }
  
  window.onload = () => {
    const duration = 72 * 60 * 60; // 72 hours in seconds
    startDecoratedCountdown(duration);
  };
  