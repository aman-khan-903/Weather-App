const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[weather-container]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable need ????  

let oldTab = userTab; 
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage(); 

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab"); 
        oldTab=newTab; 
        oldTab.classList.add("current-tab"); 
    }

    if(!searchForm.classList.contains("active")){
        // kya search form wala container is invisible , if yes than make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active"); 
        searchForm.classList.add("active"); 
    }
    else{
        // main pehle search wale tab pe tha ab your weather visible krna hai
        searchForm.classList.remove("active"); 
        userInfoContainer.classList.remove("active"); 
        // ab me your weather tab me aa gya hu, toh weather bhi display krna pdega, so check local storage first 
        // for coordinates if we have saved them there
        getfromSessionStorage(); 
    }
}

// ek kaam or pending hai ??????
userTab.addEventListener('click', ()=>{
    // pass clicked event as input parameter
    switchTab(userTab); 
}); 

searchTab.addEventListener('click', ()=>{
    // pass clicked event as input parameter
    switchTab(searchTab); 
});

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const coordinates = JSON.parse(localCoordinates); 
        fetchUserWeatherInfo(coordinates); 
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}= coordinates; 
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active"); 
    // make loader visible
    loadingScreen.classList.add("active"); 

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);  

        const data = await response.json(); 
        loadingScreen.classList.remove("active"); 
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data); 
    }
    catch(error){
        loadingScreen.classList.remove("active"); 
        //HW
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element
    const cityName= document.querySelector('[data-city-name]'); 
    const countryIcon = document.querySelector('[data-countryIcon]'); 
    const weatherDesc = document.querySelector('[data-weatherDesc]'); 
    const weatherIcon = document.querySelector('[data-weatherIcon]'); 
    const temp = document.querySelector('[data-temp]'); 
    const windSpeed = document.querySelector('[data-windSpeed]'); 
    const humidity = document.querySelector('[data-humidity]'); 
    const cloudiness = document.querySelector('[data-cloudiness]'); 

    // fetch values from weatherObject 
    cityName.innerText = weatherInfo?.name; 
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText =`${weatherInfo?.weather?.[0]?.main}`   ; 
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText= `${weatherInfo?.main?.temp}°C`; 
    windSpeed.innerText= `${weatherInfo?.wind?.speed} m/s`; 
    humidity.innerText= `${weatherInfo?.main?.humidity} %`; 
    cloudiness.innerText= `${weatherInfo?.clouds?.all}%`; 
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else{
        alert("navigation feature not available in your system"); 
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); 

    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener('click', getLocation); 


const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener('submit', (e)=>{
      e.preventDefault(); 
      let cityName= searchInput.value; 

      if(cityName== ''){
        return; 
      }

      else{
        fetchSearchWeatherInfo(cityName); 
      }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active"); 
    userInfoContainer.classList.remove("active"); 
    grantAccessContainer.classList.remove("active"); 

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active'); 
        userInfoContainer.classList.add('active'); 
        renderWeatherInfo(data); 
    }
    catch(err){

    }
}