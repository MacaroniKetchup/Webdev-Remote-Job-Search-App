var searchFormEl = document.getElementById('search-form');
var searchJobEl = document.getElementById('categories');
var jobsContainerEl = document.getElementById('jobs-container');
var jobCardEl = document.getElementById('job-cards');
var jobButtonsEl = document.getElementById('job-buttons');
var searchCategory;
// var shibePrintEl = document.getElementById('print-shibes');

// var api = 'https://www.themuse.com/api/public/jobs?q=';
// var jobSearch = "";
// var pageLoad = '&page=1&descending=true';
// var apiKey = "daed771fd0ad16dbb3a9de8575ba1b7d7160d8d32ea4d206975cbbe4464934ce";
var apiKey1 = "&api_key=0baa9fe5f5bebece6a9a3c670885ad97f3625e18b3148bb62e59c4df39a2780a";

// function for event handler (search button) to retrieve user input
function formSubmitHandler(event) {
    event.preventDefault();

    //Grabbing the search of the user and removing the leading and training white spaces from user input
    var userSearch = searchJobEl.options[searchJobEl.selectedIndex].text;
    searchCategory = userSearch;
    console.log(userSearch);

    //If statement to check if user presses Search without typing anything or without 
    if (userSearch) {
        getJobSearch(userSearch);
        //Empty search box after running the initial search
        searchJobEl.value = '';
        jobsContainerEl.innerHTML = '';
    }
}

// function to fetch first API (job search)
function getJobSearch(userJobs) {

    //    var jobsUrl = api + userJobs + pageLoad + apiKey1
    var jobsUrl = `https://www.themuse.com/api/public/jobs?category=${userJobs}&page=1&descending=true` + apiKey1

    fetch(jobsUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (jobsData) {
                    console.log(jobsData);
                    displayResults(jobsData);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to reach jobs url');
        })
}

// function to display results
function displayResults(jobResults) {
    //If user typed incorrect entry, return 
    if (jobResults.length === 0) {
        return;
    }

    var titleEl = document.createElement('h2');
    titleEl.innerHTML = 'Search results: ' + searchCategory;
    jobsContainerEl.appendChild(titleEl);

    for (var i = 0; i < 10; i++) {
        //if statement to deal with errors if there are less than 10 results
        if (jobResults.results[i]) {
            //Create a new div for all the results, in order to add a border and style the list
            var resultsList = document.createElement('div');

            var jobTitle = document.createElement('p');
            var jobCompany = document.createElement('p');
            var jobDate = document.createElement('p');
            var jobCategory = document.createElement('p');
            var jobLevel = document.createElement('p');
            var jobDescription = document.createElement('p');
            var truncatedDescription = document.createElement('p');

            var titleData = jobResults.results[i].name;
            jobTitle.innerHTML = 'Job Title: ' + titleData;

            var companyData = jobResults.results[i].company.name;
            jobCompany.innerHTML = 'Company: ' + companyData;

            var newDate = new Date(jobResults.results[i].publication_date);
            jobDate.innerHTML = 'Posting Date: ' + newDate.toLocaleDateString();

            var categoryData = jobResults.results[i].categories[0].name;
            for (var j = 1; j < jobResults.results[i].categories.length; j++) {
                categoryData = categoryData + ', ' + jobResults.results[i].categories[j].name;
            }
            jobCategory.innerHTML = 'Job Category: ' + categoryData;

            var levelData = jobResults.results[i].levels[0].name;
            jobLevel.innerHTML = 'Level: ' + levelData;

            var descriptionData = jobResults.results[i].contents;
            jobDescription.innerHTML = 'Job Description: ' + descriptionData;
            jobDescription.setAttribute('id', "longDesc" + i);
            jobDescription.setAttribute("hidden", true);

            var shortDescriptionData = jobResults.results[i].contents;
            truncatedDescription.innerHTML = 'Job Description: ' + shortDescriptionData.substring(0, 200);
            truncatedDescription.setAttribute('id', "shortDesc" + i);

            var showMore = document.createElement('a');
            showMore.setAttribute('id', "toggleButton" + i);
            showMore.innerText = 'Show more ...';

            resultsList.append(jobTitle, jobCompany, jobDate, jobCategory, jobLevel, jobDescription, truncatedDescription, showMore);

            //toggle between no display and display block. If my display is block, make it none; if it's none, make it block
            //this function runs after the results are displayed, to show short description and allow the user to expand it if the Show more ...button is clicked
            showMore.onclick = function (event) {
                console.log(event);
                //Create a variable that contains the Show more... you clicked on 
                var toggleButton = event.target;
                console.log(toggleButton);
                var toggleIdentifier = toggleButton.id.substring(12);
                console.log(toggleIdentifier);
                var longDescription = document.getElementById('longDesc' + toggleIdentifier);
                console.log(longDescription);
                var shortDescription = document.getElementById('shortDesc' + toggleIdentifier);
                console.log(shortDescription);

                if (window.getComputedStyle(shortDescription).display === 'none') {
                    shortDescription.style.display = 'block';
                    longDescription.style.display = 'none';
                    toggleButton.innerText = "Show more ...";
                } else {
                    shortDescription.style.display = 'none';
                    longDescription.style.display = 'block';
                    toggleButton.innerText = "Show less ...";
                    storeSearch(toggleButton.parentElement);
                }
            };

            //Added border for results and append new div to the job-cards div
            resultsList.classList.add('card', 'border');
            jobsContainerEl.appendChild(resultsList);
        }
    }
}

//Function to store any searches that the user clicks Show more ... on
function storeSearch(resultsList) {
    //Create a variable that stores the job title that the user looked at (show more)
    var viewedTitle = resultsList.children[0].innerHTML;
    //Create a variable that checks if that title already exists in local storage
    var titleExists = localStorage.getItem(viewedTitle);
    //if the title already exists, do nothing; if not, set item in local storage
    //if there are 5 titles, delete the first
    if (titleExists) {
    } else {
        if (localStorage.key(4)) {
            localStorage.removeItem(localStorage.key(4));
        }
        localStorage.setItem(viewedTitle, JSON.stringify(resultsList.outerHTML));
        jobButtonsEl.innerHTML = '';

        //Create a button for stored and displayed searches
        for (var i = 0; i < localStorage.length; i++) {
            var searchButton = document.createElement('a');
            searchButton.textContent = localStorage.key(i);
            searchButton.classList.add('btn');
            jobButtonsEl.appendChild(searchButton);
            jobButtonsEl.addEventListener('click', storedSearchHandler);
        }
    }
}

function retrieveSearch(viewedTitle) {
    var storedItem = localStorage.getItem(viewedTitle);
    storedItem = JSON.parse(storedItem);
    var resultsList = document.createElement('div');
    jobsContainerEl.append(resultsList);
    resultsList.outerHTML = storedItem;
    console.log(jobsContainerEl);
    var newToggle = jobsContainerEl.getElementsByTagName('a');
    console.log(newToggle);
    newToggle[newToggle.length - 1].style.display = 'none';
}

//Button for the stored and displayed search item
function storedSearchHandler(event) {
    console.log(event);
    jobsContainerEl.innerHTML = '';
    var retrievedSearch = event.path[0].innerText;
    retrieveSearch(retrievedSearch);
}

// fetch second API (shibe)
function getShibe(event) {
    console.log("getting shibe!")
    if (event) {
        event.preventDefault()
        event.stopPropogation()
    }

    var shibesUrl = 'http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true'

    fetch(shibesUrl)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            // console.log
            console.log("shibe-fetch", data)
            // displayShibe(data[0])
            document.getElementById("my-image").src = data[0];

        })
    // return getShibe()
}

// function displayShibe(data) {
//     console.log("displaying shibe")
//     console.log(data)
//     var print = new XMLHttpRequest();
//     print.onclick = function(event) {
//         console.log(event)
//         if (true) {
//             var data = JSON.parse(this.responseText);
//             // data.results[0].picture.large;
//         }
//         print.open("GET", getShibe());
//         return getShibe();
//     }
// }

// event listener
searchFormEl.addEventListener('submit', formSubmitHandler);
document.addEventListener('onload', getShibe)
