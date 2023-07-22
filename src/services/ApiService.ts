interface GeoLocation {
  readonly lat: string;
  readonly lon: string;
}

async function getGeoLocation(
  streetAddress: string,
): Promise<GeoLocation | null> {
  if (!streetAddress) {
    return null;
  }

  const url = new URL("https://nominatim.openstreetmap.org/search.php");
  url.searchParams.append("street", streetAddress);
  url.searchParams.append("city", "washington");
  url.searchParams.append("country", "usa");
  url.searchParams.append("limit", "1");
  url.searchParams.append("format", "jsonv2");

  const resp = await fetch(url);
  if (!resp.ok) {
    console.error(resp);
    return null;
  }

  const results = (await resp.json()) as GeoLocation[];
  if (results.length === 0) {
    return null;
  }

  const firstResult = results[0];
  return { lat: firstResult.lat, lon: firstResult.lon };
}

interface BusStop {
  readonly StopID: string;
  readonly Name: string;
  readonly Routes: string[];
}

async function getBusStops(
  apiKey: string,
  geo: GeoLocation,
): Promise<BusStop[]> {
  const url = new URL("https://api.wmata.com/Bus.svc/json/jStops");
  url.searchParams.append("Lat", geo.lat);
  url.searchParams.append("Lon", geo.lon);
  url.searchParams.append("Radius", "200");

  const resp = await fetch(url, { headers: { api_key: apiKey } });

  if (!resp.ok) {
    console.error(resp);
    return [];
  }

  const results = (await resp.json()) as BusStop[];
  return results;
}

interface BusPrediction {
  DirectionText: string;
  Minutes: number;
  RouteID: string;
}

async function getBusPredictions(
  apiKey: string,
  stopId: string,
): Promise<BusPrediction[]> {
  if (!stopId) {
    return null;
  }

  const url = new URL(
    "https://api.wmata.com/NextBusService.svc/json/jPredictions",
  );
  url.searchParams.append("StopID", stopId);

  const resp = await fetch(url, { headers: { api_key: apiKey } });
  if (!resp.ok) {
    console.error(resp);
    return [];
  }

  const results = (await resp.json()) as { Stops: BusPrediction[] };
  return results.Stops;
}

interface BusApi {
  findStops: (address: string) => Promise<BusStop[]>;
  getPredictions: (stopId: string) => Promise<BusPrediction[]>;
}

export default class busApi implements BusApi {
  readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("apiKey cannot be empty");
    }

    this.apiKey = apiKey;
  }

  async findStops(address: string): Promise<BusStop[]> {
    const geo = await getGeoLocation(address);
    if (!geo) {
      return [];
    }

    return getBusStops(this.apiKey, geo);
  }

  async getPredictions(stopId: string): Promise<BusPrediction[]> {
    return getBusPredictions(this.apiKey, stopId);
  }
}
