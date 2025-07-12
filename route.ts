import { type NextRequest, NextResponse } from "next/server"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type NormalisedWeather = {
  current: {
    temp: number
    condition: string
    icon: string | null
    humidity: number
    windSpeed: number
    windDirection: number
    pressure: number | null
    visibility: number | null
    uvIndex: number | null
    feelsLike: number
  }
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  hourly: Array<{
    time: string
    temp: number
    condition: string
    icon: string | null
    precipitation: number
  }>
  daily: Array<{
    date: string
    tempMax: number
    tempMin: number
    condition: string
    icon: string | null
    precipitation: number
    humidity: number | null
  }>
}

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const WEATHERAPI_BASE = "https://api.weatherapi.com/v1"

// Open-Meteo converts WMO weather codes → short text.
// We’ll create a minimal lookup for common codes.
const wmoLookup = (code: number): string => {
  const m: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Rain: slight",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Snow fall: slight",
    73: "Snow fall",
    75: "Heavy snow fall",
    80: "Rain showers: slight",
    81: "Rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    99: "Thunderstorm with hail",
  }
  return m[code] ?? "Unknown"
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("location") // city name or "lat,lon"
    let data: NormalisedWeather

    if (WEATHER_API_KEY) {
      const weatherApiResult = await tryWeatherApi(q)
      if (weatherApiResult.ok) {
        data = weatherApiResult.value
      } else {
        data = await useOpenMeteo(q)
      }
    } else {
      data = await useOpenMeteo(q)
    }

    return NextResponse.json(data satisfies NormalisedWeather)
  } catch (err) {
    console.error("Weather route fatal error:", err)
    return NextResponse.json({ error: "Unable to fetch weather" }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// WeatherAPI.com branch
// ---------------------------------------------------------------------------

async function tryWeatherApi(
  locationQuery: string | null,
): Promise<{ ok: true; value: NormalisedWeather } | { ok: false }> {
  try {
    const query =
      locationQuery ??
      // WeatherAPI supports "auto:ip"
      "auto:ip"

    const [cur, fc] = await Promise.all([
      fetch(`${WEATHERAPI_BASE}/current.json?key=${WEATHER_API_KEY}&q=${query}&aqi=no`),
      fetch(`${WEATHERAPI_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=7&aqi=no&alerts=no`),
    ])

    if (!cur.ok || !fc.ok) return { ok: false }

    const currentData = await cur.json()
    const forecastData = await fc.json()

    const normalised: NormalisedWeather = {
      current: {
        temp: currentData.current.temp_c,
        condition: currentData.current.condition.text,
        icon: currentData.current.condition.icon,
        humidity: currentData.current.humidity,
        windSpeed: currentData.current.wind_kph,
        windDirection: currentData.current.wind_degree,
        pressure: currentData.current.pressure_mb,
        visibility: currentData.current.vis_km,
        uvIndex: currentData.current.uv,
        feelsLike: currentData.current.feelslike_c,
      },
      location: {
        name: currentData.location.name,
        country: currentData.location.country,
        lat: currentData.location.lat,
        lon: currentData.location.lon,
      },
      hourly: forecastData.forecast.forecastday[0].hour.slice(0, 24).map((h: any) => ({
        time: h.time,
        temp: h.temp_c,
        condition: h.condition.text,
        icon: h.condition.icon,
        precipitation: h.precip_mm,
      })),
      daily: forecastData.forecast.forecastday.map((d: any) => ({
        date: d.date,
        tempMax: d.day.maxtemp_c,
        tempMin: d.day.mintemp_c,
        condition: d.day.condition.text,
        icon: d.day.condition.icon,
        precipitation: d.day.totalprecip_mm,
        humidity: d.day.avghumidity,
      })),
    }

    return { ok: true, value: normalised }
  } catch {
    return { ok: false }
  }
}

// ---------------------------------------------------------------------------
// Open-Meteo fallback branch (no API key required)
// ---------------------------------------------------------------------------

async function useOpenMeteo(location: string | null): Promise<NormalisedWeather> {
  // 1. Determine coordinates
  let lat: number
  let lon: number
  let name = "Unknown"
  let country = ""

  if (location && /-?\d+(\.\d+)?,-?\d+(\.\d+)?/.test(location)) {
    // already "lat,lon"
    const [la, lo] = location.split(",").map(Number)
    lat = la
    lon = lo
  } else if (location) {
    // use free geocoding
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
    ).then((r) => r.json())

    if (!geo.results?.length) throw new Error("Geocoding failed")
    lat = geo.results[0].latitude
    lon = geo.results[0].longitude
    name = geo.results[0].name
    country = geo.results[0].country
  } else {
    // as last resort use client IP via open-meteo’s ip-based endpoint
    const ipRes = await fetch("https://ipapi.co/json/").then((r) => r.json())
    lat = ipRes.latitude
    lon = ipRes.longitude
    name = ipRes.city
    country = ipRes.country_name
  }

  // 2. Fetch forecast
  const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`
  const meteo = await fetch(meteoUrl).then((r) => r.json())

  const now = new Date()
  const currentIdx = meteo.hourly.time.findIndex((t: string) => new Date(t).getTime() > now.getTime()) - 1

  const normalised: NormalisedWeather = {
    current: {
      temp: meteo.current_weather.temperature,
      condition: wmoLookup(meteo.current_weather.weathercode),
      icon: null,
      humidity: meteo.hourly.relative_humidity_2m[currentIdx] ?? 0,
      windSpeed: meteo.current_weather.windspeed,
      windDirection: meteo.current_weather.winddirection,
      pressure: null,
      visibility: null,
      uvIndex: null,
      feelsLike: meteo.current_weather.temperature,
    },
    location: { name, country, lat, lon },
    hourly: meteo.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time,
      temp: meteo.hourly.temperature_2m[i],
      condition: wmoLookup(meteo.hourly.weathercode[i]),
      icon: null,
      precipitation: meteo.hourly.precipitation_probability[i] ?? 0,
    })),
    daily: meteo.daily.time.map((date: string, i: number) => ({
      date,
      tempMax: meteo.daily.temperature_2m_max[i],
      tempMin: meteo.daily.temperature_2m_min[i],
      condition: wmoLookup(meteo.daily.weathercode[i]),
      icon: null,
      precipitation: meteo.daily.precipitation_probability_max[i] ?? 0,
      humidity: null,
    })),
  }

  return normalised
}
