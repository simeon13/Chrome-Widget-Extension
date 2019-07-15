// EVENT LISTENERS FOR 3 BUTTONS ON THE MAIN SCREEN
document.getElementById("back").addEventListener("click", backFunction)
document.getElementById("websites").addEventListener("click", webFunction, {
    once: true
});
document.getElementById("weather").addEventListener("click", weatherFunction, {
    once: true
});


// ON "BACK", GO BACK TO WIDGET.HTML
function backFunction(){
    window.location='widget.html';
}


// ON "MOST VISITED WEBSITES", GRAB MOST VISITED URL's -> then create Event Listeners for each link
function webFunction(){
    var button = document.getElementById('weather');
    button.parentNode.removeChild(button);
    chrome.topSites.get(makeLinksList);
}
function makeLinksList(mostVisitedURLs){
    var popupDiv = document.getElementById('mostVisited_div');
    popupDiv.innerHTML += '<br>';
    popupDiv.innerHTML += '<hr>';
    var ol = popupDiv.appendChild(document.createElement('ol'));
    for (var i = 0; i < mostVisitedURLs.length; i++) {
        var li = ol.appendChild(document.createElement('li'));
        var a = li.appendChild(document.createElement('a'));
        a.href = mostVisitedURLs[i].url;
        a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
        a.addEventListener('click', onClick);
    }
}
function onClick(event) {
    chrome.tabs.create({ url: event.srcElement.href });
    return false;
  }


// ON "WEATHER INFORMATION", Add button to submit location -> grab data from XMl file
function weatherFunction(){
    // remove button
    var button = document.getElementById('websites');
    button.parentNode.removeChild(button);
    // add location
    var d = document.getElementById('weather_div');
    d.innerHTML += '<br>';
    d.innerHTML += '<hr>';
    d.innerHTML += '<br><input size=56 type="text" id="location" placeholder="Please Enter A City (USA only)"><br/><br><button class="normal" id="testButton" >Submit</button>';
    document.getElementById("testButton").addEventListener("click", createXML, {
        once: true
    });
}
function createXML(){
    // delete previous buttons
    console.log('here');
    var location = document.getElementById('location').value;
    console.log(location);
    var textbox = document.getElementById('location');
    textbox.parentNode.removeChild(textbox);
    var button = document.getElementById('testButton');
    button.parentNode.removeChild(button);

    // on submit, create XML HTTP Request
    var xmlDoc;
    const xhr = new XMLHttpRequest();
    let weatherAPIKey = '679ad99df011acec23d1bd5bef4cc156';
    var link = `https://api.openweathermap.org/data/2.5/weather?q=${location},us&mode=xml&appid=${weatherAPIKey}`;
    xhr.open("GET", link, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            actOnWeatherData(data);
        }
        else {
            alert("Invalid City (OpenWeatherMapAPI)");
            window.location='widget.html';
        }
    };
    xhr.send();
}

function actOnWeatherData(data){
    document.body.mostVisited_div = '';
    var popupDiv = document.getElementById('weather_div');
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(data,"text/xml");
    console.log(xmlDoc);

    // grab information
    var city = xmlDoc.getElementsByTagName("city")[0].getAttribute('name');
    var country = xmlDoc.getElementsByTagName("country")[0].childNodes[0].nodeValue;
    var longitude = xmlDoc.getElementsByTagName("coord")[0].getAttribute('lon');
    var latitude = xmlDoc.getElementsByTagName("coord")[0].getAttribute('lat');
    var current_temp = xmlDoc.getElementsByTagName("temperature")[0].getAttribute('value');
    var min_temp = xmlDoc.getElementsByTagName("temperature")[0].getAttribute('min');
    var max_temp = xmlDoc.getElementsByTagName("temperature")[0].getAttribute('max');
    current_temp = ((current_temp - 273.15) * 1.8 + 32).toFixed(2);
    min_temp = ((min_temp - 273.15) * 1.8 + 32).toFixed(2);
    max_temp = ((max_temp - 273.15) * 1.8 + 32).toFixed(2);
    var humidity = xmlDoc.getElementsByTagName("humidity")[0].getAttribute('value'); //%
    var pressure = xmlDoc.getElementsByTagName("pressure")[0].getAttribute('value'); //hPa
    var wind_info = xmlDoc.getElementsByTagName("speed")[0].getAttribute('name');
    var wind_direction = xmlDoc.getElementsByTagName("direction")[0].getAttribute('code');
    var cloud_status = xmlDoc.getElementsByTagName("clouds")[0].getAttribute('name');

    var d = document.getElementById('weather_div');
    d.innerHTML = '<br>';
    d.innerHTML += '<hr>';
    d.innerHTML += '<h1>Current Weather Information</h1>';
    d.innerHTML += `<p>Location: ${city}, ${country}</p>`;
    d.innerHTML += `<p>Geographic Coordinates: ${latitude}, ${longitude}</p>`;
    d.innerHTML += `<p>Temperature: ${current_temp}&#176;F</p>`;
    d.innerHTML += `<p>Temperature Range: ${min_temp}&#176;F - ${max_temp}&#176;F</p>`;
    d.innerHTML += `<h2>*Depending on size of city, temperature can vary.</h2>`;
    d.innerHTML += `<p>Humidity: ${humidity}%</p>`;
    d.innerHTML += `<p>Pressure: ${pressure} hPa</p>`;
    d.innerHTML += `<p>Wind: ${wind_info}</p>`;
    d.innerHTML += `<p>Direction: ${wind_direction}</p>`;
    d.innerHTML += `<p>Clouds: ${cloud_status}</p>`;
    d.innerHTML += '<hr>';
    d.innerHTML += `<h2>*Information provided by OpenWeatherAPI`;
}