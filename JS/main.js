$(document).ready(function(){
  // Initialize WOW.js
  new WOW().init();
  clear();
  mainMeals()

$(".sidebar-toggle").click(function(){
toggleSideBar();
  // if ($ul.hasClass("wow")) {
  //     $ul.attr("data-wow-iteration", "10");
  //     $ul.attr("data-wow-duration", "4s");
  // } else {
  //     $ul.removeAttr("data-wow-iteration");
  //     $ul.removeAttr("data-wow-duration");
  // }
})

});
function clear() {
  $(".areas").html(null);
  $(".cats").html(null);
  $(".ingres").html(null);
  $(".mealsArea").html(null);
  $(".mainMeals").html(null);
  $(".theMealdetail").html(null);
  $(".catMeals").html(null);
}


// AREAS
async function showAllAreas() {
  try {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let areaData = await res.json();
    let allAreas = areaData.meals;
    allAreas.forEach((area) => {
      $(".areas").append(`
        <div class="area" areaIS=${area.strArea}>
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <p>${area.strArea}</p>
        </div>
      `);
    });
  } catch (error) {
    console.error("Error fetching area data:", error);
  }
}

$("#areas").click(() => {
  clear();
  toggleSideBar();
  showAllAreas();
  // $(".sidebar").toggleClass("sidebar-show");
  // $(".menu").toggleClass("menu-show");
  // $(".fas").toggleClass("fa-bars fa-times");
});

//CATEGORIES

async function showAllCat() {
  let res = await fetch(
    // "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let catData = await res.json();
  console.log("well");
  let allcat = catData.categories;
  console.log(catData);
  console.log(allcat);
  allcat.forEach((cat) => {
    let part = cat.strCategoryDescription.split(' ').slice(0,20).join(" ");
    $(".cats").append(`
          <div class="cat" cat-is=${cat.strCategory}>
            <img src=${cat.strCategoryThumb}>
            <div class="cat-view">
              <h2>${cat.strCategory}</h2>
              <p>${part}</p>
            </div>
        </div>
    `);
  });
}

$("#cats").click(() => {
  clear();
  toggleSideBar()
  showAllCat();
});

$(".cats").on("click",".cat",function(){
  clear();
  let cat = $(this).attr("cat-is");
  console.log(cat);
  let API = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;
  // mealsOfCat(cat)
  mealsOfParent(API);
})



//INGREDIENTS
async function showAllIngre(){
  let result = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  let ingreData = await result.json();
  let allIngreData = ingreData.meals;
  console.log(allIngreData);
  let counter =0;
  // allIngreData.forEach((ingre, index, arr)=>{
    allIngreData.forEach((ingre)=>{ //.slice(0, 20)
    let part = '';
    // if(counter>=20){
    //   arr.length = index + 1; // Behaves like `break`
    // }
    if (ingre.strDescription) {
      part = ingre.strDescription.split(" ").slice(0, 20).join(" ");
    }
    $(".ingres").append(`
      <div class="ingre" ingreIs=${ingre.strIngredient}>
      <i class="fa-solid fa-drumstick-bite"></i>
      <h2>${ingre.strIngredient}</h2>
      <p>${part}</p>
      </div>
      `)
      counter++;
  })
}
$("#ingre").click(()=>{
  clear();
  toggleSideBar();
  showAllIngre();
  })



//show all meals associated with specific area
//Event Delegation
$(".areas").on("click", ".area", function () {
  clear(); 
  let area = $(this).attr("areaIS");
  console.log("Clicked on area:", area);
  showAllMealsUArea(area);
});

  async function showAllMealsUArea(area){
  let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let allData = await result.json();
  let allMeals = allData.meals;
  allMeals.forEach((meal)=>{
    $(".mealsArea").append(`
      <div class="mealofarea" idIS=${meal.idMeal}>

      <img src="${meal.strMealThumb}" >
      <p>${meal.strMeal}</p>

      </div>
      `)
  })
}
$(".mealsArea").on("click", ".mealofarea", function () {
  clear();
  let id = $(this).attr("idIS");
  console.log("Clicked on id:", id);
  singleMeal(id);
})



//main view
async function mainMeals(){
  let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood&Pasta`);
  let allMealsData = await result.json();
  let mainmeal = allMealsData.meals;
  mainmeal.forEach((meal)=>{
    $(".mainMeals").append(`
      <div class="mainmeal" idIS="${meal.idMeal}">
      <img src="${meal.strMealThumb}" > 
      <p>${meal.strMeal}</p>
      </div>
      `)
  })
}

  $(".mainMeals").on("click", ".mainmeal", function () {
  clear();
  let id = $(this).attr("idIS");
  console.log("Clicked on id:", id);
  singleMeal(id);
})

//singleMeal
async function singleMeal(id){
  let result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let mealData = await result.json();
  let meal = mealData.meals[0];
  
    $('.theMealdetail').append(`
      <div class="singleMeal">
      <div class="img-Container">
      <img src="${meal.strMealThumb}" >
      <h2>${meal.strMeal}</h2>
      </div>
      <div class="mealInfo">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h2>Area : <span>${meal.strArea}</span> </h2>
      <h2>Category : <span>${meal.strCategory}</span> </h2>
      <h2>Recipes : </h2>
      <div class="Recipes">
      </div>
      <h2>Tags : </h2>
      <div class="btns">
      <a href="${meal.strSource}" target="_blank" class="btn btn-info">
      Source</a>
      <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">
      Youtube</a>
      </div>
      </div>
      </div>
      `)
      for(i=0;i<=19;i++){
        if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
          $(".Recipes").append(`
            <span>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</span><br>
          `);
          console.log(meal[`strIngredient${i}`], meal[`strMeasure${i}`]);
        }
      }
  // })
}

//getAllMealsOfCategory
// async function mealsOfCat(cat){
//   let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
//   let allData = await result.json();
//   let allMeals = allData.meals;
//   allMeals.forEach((meal)=>{
//     $(".mealsArea").append(`
//       <div class="mealofarea" idIS=${meal.idMeal}>

//       <img src="${meal.strMealThumb}" >
//       <p>${meal.strMeal}</p>

//       </div>
//       `)
//   })
// }


 //getAllMealsOfCategory
//getAllMealsOfIngredient
$(".ingres").on("click",".ingre",function(){
  clear();
  let ingre = $(this).attr("ingreIs");
  console.log(ingre)
  let api = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingre}`
  mealsOfParent(api)
})
function mealsOfParent(API){
  $.post(API,function(data){
    console.log(data)
    let allMeals = data.meals;
  allMeals.forEach((meal)=>{
    $(".mealsArea").append(`
      <div class="mealofarea" idIS=${meal.idMeal}>
      <img src="${meal.strMealThumb}" >
      <p>${meal.strMeal}</p>
      </div>
      `)
  })
  })
}
 
// function mealsOfCat(cat){
//   $.post(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`,function(data){
//     console.log(data)
//     let allMeals = data.meals;
//   allMeals.forEach((meal)=>{
//     $(".mealsArea").append(`
//       <div class="mealofarea" idIS=${meal.idMeal}>

//       <img src="${meal.strMealThumb}" >
//       <p>${meal.strMeal}</p>

//       </div>
//       `)
//   })
//   })
// }

//make only one div and one function for all APIS , and to differ the styles , add or remove classes
async function allAPIS(api,keyAPI,keyImg,key2,contentToLoad){
  let result = await fetch(api);
  let mydata = await result.json();
  let dataRun = mydata.keyAPI;
  dataRun.forEach((content)=>{})
}


// function to dynamically toggle the sidebar
function toggleSideBar(){
  $(".sidebar").toggleClass("sidebar-show");
  $(".menu").toggleClass("menu-show");
  $(".bt").toggleClass("fa-bars fa-times");
  $("ul").toggleClass("animate__animated animate__backInUp");
}