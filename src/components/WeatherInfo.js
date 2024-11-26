import React, { useState, useEffect } from "react";
import "../Style/Clima.css";

const WeatherInfo = () => {
    const [clima, setClima] = useState({ temperature: null, precipitationProbability: null });
    const [time, setTime] = useState("");

    // Llamada a la API para obtener el clima
    useEffect(() => {
        const fetchClima = async () => {
            try {
                const responseGeocoding = await fetch(
                    "https://geocoding-api.open-meteo.com/v1/search?name=Tacuarembo&count=1&language=es&format=json"
                );
                const geocodingData = await responseGeocoding.json();
                const { latitude, longitude } = geocodingData.results[0];

                const responseWeather = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=precipitation_probability_mean&timezone=America/Montevideo`
                );
                const weatherData = await responseWeather.json();

                setClima({
                    temperature: weatherData.current_weather.temperature,
                    precipitationProbability: weatherData.daily.precipitation_probability_mean[0],
                });
            } catch (error) {
                console.error("Error al obtener los datos del clima:", error);
            }
        };

        fetchClima();
    }, []);

    // Actualizar el reloj
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("es-ES", { timeZone: "America/Montevideo" }));
        };
        const intervalId = setInterval(updateClock, 1000);

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
    }, []);

    return (
        <div className="weather-container">
            <h2>Clima de Tacuarembó</h2>
            {clima.temperature !== null ? (
                <>
                    <p>
                        <span className="weather-emoji">🌡️</span>Temp:{" "}
                        <span>{clima.temperature}°C</span>
                    </p>
                    <p>
                        <span className="weather-emoji">🌧️</span>Lluvia:{" "}
                        <span>{clima.precipitationProbability}%</span>
                    </p>
                </>
            ) : (
                <p>Obteniendo clima...</p>
            )}
             <p >
                <span className="weather-emoji">🕒</span>Hora:{" "}                
                <span>{time}</span>
            </p>
        </div>
    );
};

export default WeatherInfo;
