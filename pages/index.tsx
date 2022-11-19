import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

interface Location {
  lon: number;
  lat: number;
}

const Home = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
    });
  }, [])

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    const fetchWeatherData = async () => {
      const weatherResponse = await fetch("/api/get/temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lon: location.lon, lat: location.lat }),
        signal: controller.signal,
      })
      const weatherData: { temperature: number } = await weatherResponse.json();
      setTemperature(weatherData.temperature)
    }

    fetchWeatherData();

    return () => {
      controller.abort();
    }
  }, [location])

  const celsiusTemperature = useMemo(() => {
    if (!temperature) return null;

    return temperature - 273.15;
  }, [temperature])

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page" />
      </Head>

      <main>
        <p>
          Longitude: {location?.lon || "Unknown"}
        </p>
        <p>
          Latitude: {location?.lat || "Unknown"}
        </p>
        <p>
          Temperature: {celsiusTemperature || "Unknown"}
        </p>
      </main>
    </>
  )
}

export default Home;