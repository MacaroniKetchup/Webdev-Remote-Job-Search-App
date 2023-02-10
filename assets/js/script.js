var searchFormEl = document.getElementById('search-form');
var searchJobEl = document.getElementById('job-parameter');
// var searchShibeEl = document.getElementById("button").addEventListener("click", displayShibe());

// function for event handler (search button) to retrieve user input
function formSubmitHandler(event) {
    event.preventDefault();

    //Grabbing the search of the user and removing the leading and training white spaces from user input
    var userSearch = searchJobEl.value.trim();
    console.log(userSearch);

    //If statement to check if user presses Search without typing anything or without 
    if (userSearch) {
        getJobSearch(userSearch);
        //Empty search box after running the initial search
        searchJobEl.value = '';
    } else {
        alert('Please select a job category');
    }
}

// function for window load event 


// function to fetch first API (job search)
function getJobSearch() {
    // var apiKey = "daed771fd0ad16dbb3a9de8575ba1b7d7160d8d32ea4d206975cbbe4464934ce";
    var apiKey1 = "0baa9fe5f5bebece6a9a3c670885ad97f3625e18b3148bb62e59c4df39a2780a";
    var jobs = "";
    var jobsUrl = 'https://www.themuse.com/api/public/jobs?category=Computer%20and%20IT&category=Software%20Engineer&category=Software%20Engineering&level=Entry%20Level&page=15&descending=true$api_key=' + apiKey1;

    fetch(jobsUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            console.log("job-fetch", data)
            displayResults(data);
        })
}

// console.log

// function to display results
function displayResults(jobs) {

}

// event listener

// local storage

// fetch second API (shibe)
function getShibe() {
    var shibesUrl = 'https://shibe.online/api/shibes?count=[1-100]&urls=[true/false]&httpsUrls=[true/false]'

    fetch(shibesUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log
            console.log("shibe-fetch", data)
            // displayShibe(data);
        })
        return getShibe
}

function displayShibe() {
    var print  = new XMLHttpRequest();
    print.onclick = function() {
      if (true) {
        var data = JSON.parse(this.responseText);
        document.getElementById("myimage").src = data.results[0].picture.large;
      }
    };
    print.open("GET", getShibe());
    return getShibe;

  }


// console.log 

searchFormEl.addEventListener('submit', formSubmitHandler);