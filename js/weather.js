// fetching weather api
fetch('https://api.open-meteo.com/v1/forecast?latitude=36.16&longitude=-85.5&hourly=temperature_2m,uv_index&current=weather_code,precipitation,temperature_2m,relative_humidity_2m,apparent_temperature&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit')
.then(response => {
    if(!response.ok){ 
        throw new Error('Bad HTTP Response') // throw error if we do not get a response
    }
    return response.json() // else turn our response into json object
})
.then(data => {
    // Setting variables pulled from our JSON
    // Pulling the current temperature, current humidity, current weather code, and apparent temp
    const current_temp = data.current.temperature_2m
    const current_humidity = data.current.relative_humidity_2m
    const current_conditions = data.current.weather_code
    const current_time = data.current.time
    const apparent_temp = data.current.apparent_temperature
    const precipitation = data.current.precipitation

    // Setting HTML with current time, current temperature, current humidity, apparent temperature, UV Index, Precipitation
    document.getElementById("h1Time").innerHTML = "Cookeville " + `${current_time}`.substring(11,16)
    document.getElementById("h2Current_temp").innerHTML = `${current_temp}` + "℉"
    document.getElementById("h3Apparent_temp").innerHTML = "Feels Like " + `${apparent_temp}` + "℉"
    document.getElementById("h5Current_humidity").innerHTML = `${current_humidity}` + "℉"
    document.getElementById("h5Precipitation").innerHTML = `${precipitation}` + "mm"

    // Pulling the current time, hourly time array
    const hours = data.hourly.time

    // Hourly temperature for the next 4 hours including our current temperature
    // Must find the index of which our current hour is at:
     for (let i = 0; i < hours.length; i++){
        if (hours[i].substring(11,13) === current_time.substring(11,13)){
            current_hour_index = i
            break
        }
    } 

    const uv = data.hourly.uv_index[current_hour_index]
    console.log(data.hourly.uv_index[current_hour_index])
    document.getElementById("h5UV").innerHTML = `${uv}`


    // Pulling hourly temperature array
    const hourly_temps = data.hourly.temperature_2m
    // Displaying the current temperature and upcoming 4 hourly temperatures
    for(let i = 0; i < 5; i++){
        document.getElementById(`hour${i}`).innerHTML = hours[current_hour_index + i].substring(11,13) + ":00"
        document.getElementById(`hour${i}Temp`).innerHTML = hourly_temps[current_hour_index + i] + "℉"

    }
    

    // This function will find the weather icon and text that matches the current weather code
    // Ex: Rain weather code will return a rain symbol and "Rain" text
        function getWeatherCodeClass(current_conditions){
        let class_name = ""
        let text = ""
        if(current_conditions == 0){ // Weather code 0
            class_name = "bi bi-brightness-high-fill"
            text = "Clear Sky"
        }
        else if(current_conditions >= 1 && current_conditions <= 3){ // Weather code 1,2,3
            class_name = "bi bi-cloud-sun-fill"
            if(current_conditions == 1){
                text = "Mainly Clear"
            }
            else if(current_conditions == 2){
                text ="Partly Cloudy"
            }
            else if(current_conditions == 3){
                text="Overcast"
                class_name = "bi bi-cloud-fill"
            }
        }
        else if(current_conditions == 45 || current_conditions == 48){ // Weather code 45,48
            text="Fog"
            class_name ="bi bi-cloud-fog2"
        }
        else if(current_conditions == 51 || current_conditions == 53 || current_conditions == 55){ // Weather code 51,53,55
            class_name = "bi bi-cloud-drizzle-fill"
            text = "Drizzle"
        }
        else if(current_conditions == 56 || current_conditions == 57){ // Weather code 56,57
            class_name = "bi bi-cloud-drizzle-fill"
            text = "Freezing Drizzle"
        }
        else if(current_conditions == 61 || current_conditions == 63 || current_conditions == 65){ // Weather code 61, 63, 65
            text = "Rain"
            class_name = "bi bi-cloud-rain-fill"
        }
        else if(current_conditions == 66 || current_conditions == 67){ // Weather code 66, 67
            class_name = "bi bi-cloud-rain-fill"
            text = "Freezing Rain"
        }
        else if(current_conditions == 71 || current_conditions == 73 || current_conditions == 75){ // Weather code 71,73,75
            class_name = "bi bi-snow"
            text = "Snow fall"
        }
        else if(current_conditions == 77){ // Weather code 77
             class_name = "bi bi-snow2"
            text = "Snow grains"
        }
        else if(current_conditions == 80 || current_conditions == 81 || current_conditions == 82){ // Weather code 80,81,82
            class_name = "bi bi-cloud-rain-heavy-fill"
            text = "Rain Showers"
        }
        else if(current_conditions == 85 || current_conditions == 86){ // Weather code 85,86
            class_name = "bi bi-cloud-snow-fill"
            text = "Snow Showers"
        }
        else if(current_conditions == 95){ // Weather code 95
            class_name = "bi bi-cloud-lightning-rain-fill"
            text = "Thunderstorm"
        }
        else if(current_conditions == 96 || current_conditions == 99){ // Weather code 96,99
            class_name = "bi bi-cloud-lightning-rain-fill"
            text = "Thunderstorm with hail"
        }
        return {class_name, text}
    }
    // Displaying the weather code with its respective text in HTML
    const {class_name, text} = getWeatherCodeClass(current_conditions)
    document.querySelector('#weatherCodeIcon').className = class_name
    document.querySelector('#h2WeatherConditions').innerHTML = text

})


/* Use of ChatGPT: 

- Understanding how to find just the hour of our current time so that my hourly temperatures are by the exact hour
  - ChatGPT returned: const current_time = data.current.time.substring(0,13) + ":00"
  - I asked it to explain how it works and changed it to .substring(11, 13) since I don't want the date
- Understanding the head content which turns out website into a PWA
    - Head content tells the phone how treat your website when it is launched from the home screen
    - When someone visits the website on a phone and taps "Add to Home Screen," phone reads metadata and:
        - uses apple-touch-icon as the icon
        - uses the titale as the app name
        - launches in standalone fullscreen mode
*/
