import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";

interface Location {
    lon: number;
    lat: number;
}

const Home = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        });
    }, []);

    useEffect(() => {
        if (!location) return;

        const controller = new AbortController();

        const fetchWeatherData = async () => {
            const weatherResponse = await fetch("/api/get/temperature", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lon: location.lon, lat: location.lat }),
                signal: controller.signal,
            });
            const weatherData: { temperature: number } = await weatherResponse.json();
            setTemperature(weatherData.temperature);
        };

        fetchWeatherData();

        return () => {
            controller.abort();
        };
    }, [location]);

    const celsiusTemperature = useMemo(() => {
        if (!temperature) return null;

        return temperature - 273.15;
    }, [temperature]);

    return (
        <>
            <Head>
                <title>Home Page</title>
                <meta name="description" content="Home Page" />
            </Head>

            <main className="absolute inset-0 flex justify-center items-center bg-gray-100">
                <div className="rounded-2xl border border-gray-300 shadow-md p-6 hover:shadow-lg hover:cursor-pointer hover:border-gray-400 duration-75 bg-white">
                    <p className="text-center font-extrabold text-4xl mb-20">{celsiusTemperature?.toFixed(2) || "Unknown"}</p>
                    <div className="flex justify-between gap-24">
                        <p>{location?.lon?.toFixed(2) || "Unknown"}</p>
                        <p>{location?.lat?.toFixed(2) || "Unknown"}</p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
