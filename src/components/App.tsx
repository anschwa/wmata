import { useState, useEffect } from "react";

import DbService from "../services/DbService";
import ApiService, { BusStop, BusIncident } from "../services/ApiService";

import Nav from "./Nav";
import Login from "./Login";
import Header from "./Header";
import BusSearch from "./BusSearch";
import BusPredictions from "./BusPredictions";
import BusIncidentComponent from "./BusIncident";
import { BackIcon, BusIcon, StarIconOutline, StarIconSolid } from "./Icons";

const DB = new DbService();
const API_KEY = DB.getApiKey();
const API = API_KEY ? new ApiService(API_KEY) : null;
const FAVORITES = DB.getFavorites();

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

// Handle stopId via URL
const URLParams = new URLSearchParams(document.location.search);
const URLStopId = URLParams.get("id") || "";
const URLBusStop = URLStopId
  ? { stopId: URLStopId, stopName: "", routes: [] }
  : null;

export default function App() {
  const hasApiKey = !!API_KEY;
  const [busStop, setBusStop] = useState<BusStop | null>(URLBusStop);
  const [favorites, setFavorites] = useState<BusStop[]>(FAVORITES);
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

  useEffect(() => {
    DB.setFavorites(favorites);
  }, [favorites]);

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

  const handleBusStop = (bs: BusStop | null) => {
    if (!bs) {
      const url = new URLSearchParams(location.search);
      url.delete("id");
      history.replaceState(null, "", `?${url.toString()}`);
    }

    setBusStop(bs);
  };

  const toggleFavorite = (stop: BusStop) => {
    if (isFavorite(stop.stopId)) {
      setFavorites(favorites.filter((x) => x.stopId !== stop.stopId));
    } else {
      setFavorites([...favorites, stop]);
    }
  };

  const isFavorite = (stopId: string) => {
    return favorites.filter((x) => x.stopId === stopId).length > 0;
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
                  <div className="flex items-center justify-between">
                    <button
                      className="inline-flex items-center gap-2"
                      onClick={() => handleBusStop(null)}
                    >
                      <BackIcon />
                      <span className="underline">Back</span>
                    </button>

                    <button
                      className="inline-flex items-center gap-2"
                      onClick={() => toggleFavorite(busStop)}
                    >
                      {isFavorite(busStop.stopId) ? (
                        <StarIconSolid />
                      ) : (
                        <StarIconOutline />
                      )}
                    </button>
                  </div>

                  <BusPredictions
                    incidents={routeIncidents}
                    stopId={busStop.stopId}
                    stopName={busStop.stopName}
                    onResults={setBusStop}
                  />
                </div>
              )}

              {!busStop && (
                <details className="py-2">
                  <summary className="text-xl cursor-pointer">
                    Favorites ({favorites.length})
                  </summary>

                  <div className="my-8 rounded-lg shadow">
                    <ul className="p-4 grid grid-cols-1 divide-y gap-2">
                      {favorites.map((fav) => (
                        <li
                          key={fav.stopId}
                          className="px-1 flex items-center hover:bg-slate-50 hover:cursor-pointer"
                          onClick={() => handleBusStop(fav)}
                        >
                          <div className="flex-none">
                            <BusIcon />
                          </div>
                          <div className="p-2">
                            <div className="uppercase text-base">
                              {fav.stopName}
                            </div>
                            <div className="text-sm">
                              <span>#{fav.stopId}</span>
                            </div>
                          </div>
                        </li>
                      ))}

                      {favorites.length === 0 && (
                        <li className="text-center">No favorites yet.</li>
                      )}
                    </ul>
                  </div>
                </details>
              )}

              {!busStop && (
                <details className="py-2">
                  <summary className="text-xl cursor-pointer">
                    Incidents and Alerts (
                    {loadingIncidents ? "..." : incidents.length})
                  </summary>
                  <div className="my-8 rounded-lg shadow">
                    <ul className="p-4 grid grid-cols-1 divide-y gap-2">
                      {incidents.map((incident) => (
                        <li key={incident.updatedAt.getTime()}>
                          <BusIncidentComponent {...incident} />
                        </li>
                      ))}

                      {incidents.length === 0 && (
                        <li className="text-center">No Incidents to report.</li>
                      )}
                    </ul>
                  </div>
                </details>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
