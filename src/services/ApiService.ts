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
    return Promise.reject(resp);
  }

  const results = (await resp.json()) as GeoLocation[];
  if (results.length === 0) {
    return null;
  }

  const firstResult = results[0];
  return { lat: firstResult.lat, lon: firstResult.lon };
}

type RouteId = string;

export interface BusStop {
  stopId: string;
  stopName: string;
  routes: RouteId[];
}

async function getBusStops(
  apiKey: string,
  geo: GeoLocation,
): Promise<BusStop[]> {
  const latPercision = geo.lat.split(".")[1];
  const lonPercision = geo.lon.split(".")[1];

  if (latPercision.length < 6 || lonPercision.length < 6) {
    console.error("invalid precision for geo-location", geo);
    return [];
  }

  const url = new URL("https://api.wmata.com/Bus.svc/json/jStops");
  url.searchParams.append("Lat", geo.lat);
  url.searchParams.append("Lon", geo.lon);
  url.searchParams.append("Radius", "200");

  const resp = await fetch(url, { headers: { api_key: apiKey } });

  if (!resp.ok) {
    return Promise.reject(resp);
  }

  interface apiResults {
    Stops: {
      StopID: string;
      Name: string;
      Routes: string[];
    }[];
  }

  const results = (await resp.json()) as apiResults;

  return results.Stops.map((s) => ({
    stopId: s.StopID,
    stopName: s.Name,
    routes: s.Routes.filter((route) => !/[^A-Z1-9]/.test(route)),
  }));
}

export type BusPredictions = {
  stopName: string;
  predictions: BusPrediction[];
};

export interface BusPrediction {
  routeId: string;
  headsign: string;
  minutes: number;
}

async function getBusPredictions(
  apiKey: string,
  stopId: string,
): Promise<BusPredictions> {
  if (!stopId) {
    return { stopName: "", predictions: [] };
  }

  const url = new URL(
    "https://api.wmata.com/NextBusService.svc/json/jPredictions",
  );
  url.searchParams.append("StopID", stopId);

  const resp = await fetch(url, { headers: { api_key: apiKey } });
  if (!resp.ok) {
    return Promise.reject(resp);
  }

  interface apiResults {
    StopName: string;
    Predictions: {
      DirectionText: string;
      Minutes: number;
      RouteID: string;
    }[];
  }

  const results = (await resp.json()) as apiResults;
  return {
    stopName: results.StopName,
    predictions: results.Predictions.map((p) => ({
      routeId: p.RouteID,
      headsign: p.DirectionText,
      minutes: p.Minutes,
    })),
  };
}

export type BusIncident = {
  description: string;
  incidentType: string;
  updatedAt: Date;
};

export type BusIncidents = Record<RouteId, BusIncident[]> | null;

async function getBusIncidents(apiKey: string): Promise<BusIncidents> {
  interface apiResults {
    BusIncidents: {
      DateUpdated: Date;
      Description: string;
      IncidentID: string;
      IncidentType: string;
      RoutesAffected: string[];
    }[];
  }

  const url = new URL("https://api.wmata.com/Incidents.svc/json/BusIncidents");
  const resp = await fetch(url, { headers: { api_key: apiKey } });

  const results = (await resp.json()) as apiResults;

  const incidents: BusIncidents = {};
  for (const incident of results.BusIncidents) {
    const newIncident = {
      description: incident.Description,
      incidentType: incident.IncidentType,
      updatedAt: new Date(incident.DateUpdated),
    };

    for (const routeId of incident.RoutesAffected) {
      const record = incidents[routeId];
      if (record) {
        record.push(newIncident);
        continue;
      }

      incidents[routeId] = [newIncident];
    }
  }

  return incidents;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  const url = new URL("https://api.wmata.com/Misc/Validate");
  const resp = await fetch(url, {
    headers: { api_key: apiKey },
  });

  return resp.ok;
}

interface BusApi {
  findStops: (address: string) => Promise<BusStop[]>;
  getPredictions: (stopId: string) => Promise<BusPredictions>;
  getIncidents: () => Promise<BusIncidents>;
}

export default class Api implements BusApi {
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

  async getPredictions(stopId: string): Promise<BusPredictions> {
    return getBusPredictions(this.apiKey, stopId);
  }

  async getIncidents(): Promise<BusIncidents> {
    return getBusIncidents(this.apiKey);
  }
}
