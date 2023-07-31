import { useState, useEffect } from "react";

import DbService from "../services/DbService";
import ApiService, { BusStop, BusIncident } from "../services/ApiService";

import Nav from "./Nav";
import Login from "./Login";
import Header from "./Header";
import BusSearch from "./BusSearch";
import BusPredictions from "./BusPredictions";
import BusIncidentComponent from "./BusIncident";
import { BackIcon } from "./Icons";

const DB = new DbService();
const API_KEY = DB.getApiKey();
const API = API_KEY ? new ApiService(API_KEY) : null;

type RouteId = string;
export type RouteIncidents = Record<RouteId, BusIncident[]>;

function getRouteIncidents(busIncidents: BusIncident[]): RouteIncidents {
  const incidents: Record<RouteId, BusIncident[]> = {};

  for (const incident of busIncidents) {
    const newIncident = { ...incident };

    for (const routeId of incident.routesAffected) {
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

export default function App() {
  const hasApiKey = !!API_KEY;
  const [busStop, setBusStop] = useState<BusStop | null>(null);
  const [incidents, setIncidents] = useState<BusIncident[]>([]);
  const [routeIncidents, setRouteIncidents] = useState<RouteIncidents>({});
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  useEffect(() => {
    if (!hasApiKey) {
      return;
    }

    setLoadingIncidents(true);

    API!
      .getIncidents()
      .then((results) => {
        setIncidents(results);
        setRouteIncidents(getRouteIncidents(results));
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingIncidents(false));
  }, [hasApiKey]);

  const handleLogin = (apiKey: string) => {
    DB.setApiKey(apiKey);
    window.location.reload();
  };

  const handleLogout = () => {
    if (!window.confirm("Delete API Key and logout?")) {
      return;
    }

    DB.deleteApiKey();
    window.location.reload();
  };

  const handleBusStop = (bs: BusStop) => {
    setBusStop(bs);
  };

  return (
    <>
      {hasApiKey && <Nav onLogout={handleLogout} />}

      <div className="px-4 mx-auto max-w-screen-md min-w-min">
        <Header />

        <main role="main">
          {!hasApiKey && <Login onLogin={handleLogin} />}

          {hasApiKey && (
            <>
              <div className={busStop ? "hidden" : ""}>
                <BusSearch
                  incidents={routeIncidents}
                  onSubmit={handleBusStop}
                />
              </div>

              {busStop && (
                <div className="pt-4">
                  <button
                    className="inline-flex items-center gap-2"
                    onClick={() => setBusStop(null)}
                  >
                    <BackIcon />
                    <span className="underline">Back</span>
                  </button>

                  <BusPredictions
                    incidents={routeIncidents}
                    stopId={busStop.stopId}
                    stopName={busStop.stopName}
                  />
                </div>
              )}

              {!busStop && !loadingIncidents && (
                <aside className="my-8 rounded-lg shadow">
                  <ul className="p-4 grid grid-cols-1 divide-y gap-2">
                    {incidents.map((incident) => (
                      <li key={incident.updatedAt.getTime()}>
                        <BusIncidentComponent {...incident} />
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
