let body = document.querySelector("body");
let allPetsLeftSide = document.querySelector(".allPetsLeftSide");
let loader = document.querySelector(".loader");
let categories = document.querySelector(".category");
let sortBtn = document.querySelector(".sortBtn");
let favouritePet = document.querySelector(".favouritePet");
let petsArray;
let sortedAnimal;
let adoptModal = document.querySelector(".adoptModal");
let detailsModal = document.querySelector(".detailsModal");
let loaderDiv = document.querySelector(".loaderDiv");

function addPets(pets) {
  allPetsLeftSide.innerHTML += `
  
      <div id="${pets.petId}" class="pet p-5 border border-gray-400 rounded-lg">
                <img class="mb-5" src=${pets.image} alt="" />
                <h6 class="font-bold text-xl mb-3">${pets.pet_name}</h6>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/card.png" alt="" /> Breed:
                  ${pets.breed}
                </p>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/calendar.png" alt="" />
                  Birth: ${pets.date_of_birth}
                </p>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/femenine.png" alt="" />
                  Gender: ${pets.gender}
                </p>
                <p class="flex mb-2">
                  <img
                    class="w-5 mr-2"
                    src="../images/dollar-sign.png"
                    alt=""
                  />Price : ${pets.price}$
                </p>
                <div class="flex justify-around items-center mt-10">
                  <button class ="like">
                    <img class="w-5" src="../images/like.png" alt="" />
                  </button>
                  <button class="adopt font-bold text-lg text-[#0E7A81]">Adopt</button>
                  <button class="details font-bold text-lg text-[#0E7A81]">
                    Details
                  </button>
                </div>
              </div>
      `;
}

// getting all the pets
let allPets = async () => {
  loader.style.display = "flex";
  try {
    await new Promise((res) => {
      setTimeout(res, 2000);
    });
    let gettingPetsData = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    let petData = await gettingPetsData.json();
    petsArray = petData.pets;
    petsArray.map((pets) => {
      addPets(pets);
    });
    likeAdoptDetails();
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
};

window.addEventListener("load", () => {
  allPets();
});
// window.onload = allPets();
// getting all the category
let category = async () => {
  let getCategory = await fetch(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );
  let categoryData = await getCategory.json();
  let category = categoryData.categories;
  category.map((item) => {
    categories.innerHTML += `
  <div
            id-"${item.id}"
            class="flex cursor-pointer active:bg-[rgb(14,122,129,.2)] justify-center h-[50px] md:h-[104px] items-center w-[100px] md:w-[312px] gap-2 md:gap-4  rounded-full border border-[#0E7A81]"
          >
            <img class="w-[20px] md:w-auto" src=${item.category_icon} alt="" />
            <h4 class="font-bold text-lg md:text-2xl">${item.category}</h4>

          </div>
  `;
  });
  let categoriesDiv = document.querySelectorAll(".category div");

  // choosing pets by category
  categoriesDiv.forEach((div) => {
    div.addEventListener("click", async (e) => {
      categoriesDiv.forEach((val) => {
        val.style.background = "transparent";
        val.style.color = "black";
      });
      div.style.background = "#0E7A81";
      div.style.color = "white";

      loader.style.display = "flex";
      try {
        let cateName = e.currentTarget.querySelector("h4").innerHTML;
        allPetsLeftSide.innerHTML = "";
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        let getAnimals = await fetch(
          `https://openapi.programming-hero.com/api/peddy/category/${cateName}`
        );
        let animalsData = await getAnimals.json();
        sortedAnimal = animalsData.data;
        if (animalsData.data.length !== 0) {
          sortedAnimal.map((pets) => {
            addPets(pets);
            likeAdoptDetails();
          });
        } else {
          allPetsLeftSide.innerHTML = `
        <h1 class=' text-4xl font-bold text-center'>There are no available pets</h1>
        `;
        }
      } catch (error) {
        console.log(error);
      } finally {
        loader.style.display = "none";
      }
    }); //there
  });
};

window.onload = category();

// sorting pets by price
let sortingPets = async () => {
  loader.style.display = "flex";
  allPetsLeftSide.classList.add("hidden");
  try {
    await new Promise((res) => {
      setTimeout(res, 2000);
    });
    allPetsLeftSide.classList.toggle("hidden");
    petsArray.sort(function (a, b) {
      return b.price - a.price;
    });
    allPetsLeftSide.innerHTML = "";
    petsArray.forEach((pet) => {
      addPets(pet);
    });

    sortedAnimal.sort(function (a, b) {
      return b.price - a.price;
    });
    allPetsLeftSide.innerHTML = "";
    sortedAnimal.forEach((pet) => {
      addPets(pet);
    });
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
};

sortBtn.addEventListener("click", sortingPets);

function likeAdoptDetails() {
  let like = document.querySelectorAll(".like");
  let adopt = document.querySelectorAll(".adopt");
  let details = document.querySelectorAll(".details");

  addLike(like);
  addAdopt(adopt);
  addDetails(details);
}

function addLike(likes) {
  likes.forEach((like) => {
    like.addEventListener("click", (e) => {
      parentOfLike = e.target.closest(".pet");
      let petImg = parentOfLike.querySelector("img").src;
      let petName = parentOfLike.querySelector("h6").innerText;
      let petBreed = parentOfLike.querySelector("p").innerText.split(":")[1];
      let petId = parentOfLike.id;
      if (e.target.src.includes("like.png")) {
        e.target.src = "../images/like_1.png";
        addFavourite(petImg, petName, petBreed, petId);
      } else {
        e.target.src = "../images/like.png";
        let divFromFav = favouritePet.querySelectorAll("div");
        divFromFav.forEach((div) => {
          if (petId === div.id) {
            div.classList.add("hidden");
          }
        });
      }
    });
  });
  function addFavourite(petImg, petName, petBreed, petId) {
    favouritePet.innerHTML += `
  <div id=${petId} class="text-center">
    <img src=${petImg} alt="" />
    <h6 class="font-bold text-lg mt-2">${petName}</h6>
    <p class="text-sm">${petBreed}</p>
  </div>
  `;
  }
}

function addAdopt(adopt) {
  adopt.forEach((val) => {
    val.addEventListener("click", (e) => {
      adoptModal.classList.toggle("hidden");
      let count = 3;
      isAdopted = true;
      adoptModal.innerHTML = `
      <div
        class=" fixed inset-0 bg-black/50 h-full flex justify-center items-center"
      >
        <div
          class="flex flex-col items-center pt-14 rounded-xl bg-white w-[400px] h-[200px]"
        >
          <h1 class="font-black text-2xl">The Adoption is Processing</h1>
          <h2 id="timer" class="font-bold text-xl">${count}s</h2>
        </div>
        </div>
        
        `;
      let timer = document.getElementById("timer");
      for (let i = 2; i >= 0; i--) {
        setTimeout(() => {
          timer.innerText = `${i}s`;
          if (i === 0) {
            e.target.innerText = "Adopted";
            adoptModal.classList.add("hidden");
          }
        }, (3 - i) * 1000);
      }
    });
  });
}

function addDetails(detail) {
  detail.forEach((info) => {
    info.addEventListener("click", async (e) => {
      let currentId = e.target.closest(".pet").id;
      let getPet = await fetch(
        `https://openapi.programming-hero.com/api/peddy/pet/${currentId}`
      );
      let petData = await getPet.json();
      let pets = petData.petData;
      detailsModal.classList.toggle("hidden");
      console.log([pets]);
      detailsModal.innerHTML = `
      <div
          class="fixed inset-0 bg-black/50 h-full flex justify-center items-center "
        >
       <div id="${pets.petId}" class="pet p-5 border border-gray-400 rounded-lg bg-white w-2xl flex flex-col items-center h-[70%] overflow-auto">
                <img class="mb-5 w-[80%]" src=${pets.image} alt="" />
                <h6 class="font-bold text-xl mb-3">${pets.pet_name}</h6>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/card.png" alt="" /> Breed:
                  ${pets.breed}
                </p>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/calendar.png" alt="" />
                  Birth: ${pets.date_of_birth}
                </p>
                <p class="flex mb-2">
                  <img class="w-5 mr-2" src="../images/femenine.png" alt="" />
                  Gender: ${pets.gender}
                </p>
                <p class="flex mb-2">
                  <img
                    class="w-5 mr-2"
                    src="../images/dollar-sign.png"
                    alt=""
                  />Price : ${pets.price}$
                </p>
                <p>${pets.pet_details}</p>
                <button class="detailCloseBtn bg-emerald-400 text-white font-bold text-xl w-full h-[40px] rounded-xl mt-3">Close</button>
              </div>
              </div>

      `;
      body.classList.add("overflow-hidden");
      let detailBtn = document.querySelector(".detailCloseBtn");
      detailBtn.addEventListener("click", () => {
        detailsModal.classList.toggle("hidden");
        body.classList.toggle("overflow-hidden");
      });
    });
  });
}
