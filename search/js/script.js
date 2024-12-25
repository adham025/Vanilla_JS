const toTopBtn = document.getElementById("toTopBtn");

window.onscroll = function () {
  // console.log(this.scrollY);
  if (this.scrollY >= 100) {
    toTopBtn.classList.add("show");
  } else {
    toTopBtn.classList.remove("show");
  }
};

toTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const mobileBtn = document.getElementById("mobile-Btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeBtn = document.getElementById("close-btn");
mobileBtn.addEventListener("click", function () {
  mobileMenu.style.left = 0;
});

closeBtn.addEventListener("click", function () {
  mobileMenu.style.left = "-100%";
});

const clickSearch = document.getElementById("clickSearch");
const showSearch = document.getElementById("showSearch");

clickSearch.addEventListener("click", () => {
  const isHidden = getComputedStyle(showSearch).display === "none";

  if (isHidden) {
    showSearch.style.display = "flex";
    clickSearch.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    showSearch.style.display = "none";
    clickSearch.innerHTML = '<i class="fa-solid fa-search"></i>';
  }
});

// Good luck