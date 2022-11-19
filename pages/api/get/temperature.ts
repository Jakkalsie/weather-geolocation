import type { NextApiRequest, NextApiResponse } from "next";

export interface Coord {
    lon: number;
    lat: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

export interface Rain {
    "1h": number;
}

export interface Cloud {
    all: number;
}

export interface Sy {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface RootObject {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    rain: Rain;
    clouds: Cloud;
    dt: number;
    sys: Sy;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ temperature: number }>
) {
    const { lon, lat } = req.body;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherDetails: RootObject = await weatherRes.json();

    return res.status(200).json({ temperature: weatherDetails.main.temp });
}
