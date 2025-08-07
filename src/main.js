let allPetsLeftSide = document.querySelector(".allPetsLeftSide");
let loader = document.querySelector(".loader");
let categories = document.querySelector(".category");
let sortBtn = document.querySelector(".sortBtn");

let petsArray;
let sortedAnimal;

function addPets(pets) {
  allPetsLeftSide.innerHTML += `
      <div id="${pets.petId}" class="p-5 border border-gray-400 rounded-lg">
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
                  <button>
                    <img class="w-5" src="../images/like.png" alt="" />
                  </button>
                  <button class="font-bold text-lg text-[#0E7A81]">Adopt</button>
                  <button class="font-bold text-lg text-[#0E7A81]">
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
      console.log("from all pets", pets);

      addPets(pets);
    });
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
};
window.onload = allPets();
// getting all the category
let category = async () => {
  let getCategory = await fetch(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );
  let categoryData = await getCategory.json();
  let category = categoryData.categories;
  console.log(category);
  category.map((item) => {
    categories.innerHTML += `
  <div
            id-"${item.id}"
            class="flex cursor-pointer active:bg-[rgb(14,122,129,.2)] justify-center h-[104px] items-center w-[312px] gap-4  rounded-full border border-[#0E7A81]"
          >
            <img src=${item.category_icon} alt="" />
            <h4 class="font-bold text-2xl">${item.category}</h4>

          </div>
  `;
  });
  let categoriesDiv = document.querySelectorAll(".category div");

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

let sortingPets = async () => {
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
};

sortBtn.addEventListener("click", sortingPets);
