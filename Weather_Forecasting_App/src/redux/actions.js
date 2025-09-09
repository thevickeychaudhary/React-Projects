import axios from "axios";
import { weatherAppAPI } from "../helpers/API";
import { myToast } from "../helpers/extraFunctions";
import { setItem } from "../helpers/sessionStorage";
import { GET_DATA_ERROR, GET_DATA_LOADING, GET_DATA_SUCCESS } from "./actionTypes";

export const getDataLoading = () => {
    return { type: GET_DATA_LOADING };
}

export const getDataSuccess = (payload) => {
    return { type: GET_DATA_SUCCESS, payload };
}

export const getDataError = () => {
    return { type: GET_DATA_ERROR };
}

export const getWeatherByLocation = (toast) => (dispatch) => {

    const success = async (position) => {
        try {
            let { latitude, longitude } = position.coords;
            console.log("Location obtained:", { latitude, longitude });
            console.log("Using API key:", weatherAppAPI);
            console.log("Making API call to:", `/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAppAPI}`);
            
            dispatch(getDataLoading());
            let weatherData = await axios.get(`/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAppAPI}`);
            console.log("Weather API response:", weatherData.data);
            
            weatherData = weatherData.data;
            let forcastData = await axios.get(`/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${weatherAppAPI}`);
            console.log("Forecast API response:", forcastData.data);
            
            forcastData = forcastData.data.daily;
            let payload = { weatherData, forcastData }
            dispatch(getDataSuccess(payload));
            setItem("weather", payload);
            myToast(toast, "Your location weather updated", "success")
        } catch (err) {
            console.error("Weather API Error Details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText,
                config: {
                    url: err.config?.url,
                    method: err.config?.method,
                    headers: err.config?.headers
                }
            });
            dispatch(getDataError());
            myToast(toast, `Weather API Error: ${err.response?.data?.message || err.message}`, "error");
        }
    }

    const error = (err) => {
        console.warn(`Geolocation Error (${err.code}): ${err.message}`);
        let errorMessage = "Please turn on your location";
        if (err.code === 1) {
            errorMessage = "Location access denied. Please allow location access.";
        } else if (err.code === 2) {
            errorMessage = "Location unavailable. Please try again.";
        } else if (err.code === 3) {
            errorMessage = "Location request timeout. Please try again.";
        }
        myToast(toast, errorMessage, "error");
        dispatch(getDataError());
    }

    console.log("Starting geolocation request...");
    navigator.geolocation.getCurrentPosition(success, error, {
        timeout: 10000,
        enableHighAccuracy: true
    });
}

export const getWeatherByCity = (city, toast) => async (dispatch) => {
    if (!city || city.trim() === "") {
        myToast(toast, "Please enter a city name", "warning");
        return;
    }
    
    try {
        dispatch(getDataLoading());
        console.log("Fetching weather for city:", city);
        let weatherData = await axios.get(`/weather?q=${city}&appid=${weatherAppAPI}`);
        weatherData = weatherData.data;
        let { lon, lat } = weatherData.coord;
        let forcastData = await axios.get(`/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAppAPI}`);
        forcastData = forcastData.data.daily;
        let payload = { weatherData, forcastData };
        dispatch(getDataSuccess(payload));
        setItem("weather", payload);
        myToast(toast, "City weather data updated", "success");

    } catch (err) {
        console.error("City Weather API Error:", err.response?.data || err.message);
        dispatch(getDataError());
        
        let errorMessage = "City weather data doesn't exist";
        if (err.response?.status === 404) {
            errorMessage = `City "${city}" not found. Please check the spelling.`;
        } else if (err.response?.status === 401) {
            errorMessage = "API key error. Please contact support.";
        } else if (err.response?.status === 429) {
            errorMessage = "API rate limit exceeded. Please try again later.";
        } else if (err.response?.status >= 500) {
            errorMessage = "Weather service temporarily unavailable. Please try again.";
        }
        
        myToast(toast, errorMessage, "error");
    }
}

export const syncData = (city, toast) => async (dispatch) => {
    try {
        let weatherData = await axios.get(`/weather?q=${city}&appid=${weatherAppAPI}`);
        weatherData = weatherData.data;
        let { lon, lat } = weatherData.coord;
        let forcastData = await axios.get(`/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAppAPI}`);
        forcastData = forcastData.data.daily;
        let payload = { weatherData, forcastData };
        dispatch(getDataSuccess(payload));
        setItem("weather", payload);
        myToast(toast, "Data sync successfully", "success");
    } catch (err) {
        console.error("Sync Data Error:", err.response?.data || err.message);
        dispatch(getDataError());
        myToast(toast, "City weather data doesn't exist", "error");
    }
}

