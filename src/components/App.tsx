import { useState, useEffect } from "react";

import DbService from "../services/DbService";
import ApiService, { BusIncidents } from "../services/ApiService";

import Nav from "./Nav";
import Login from "./Login";
import BusPredictions from "./BusPredictions";

const DB = new DbService();
const API_KEY = DB.getApiKey();
const API = API_KEY ? new ApiService(API_KEY) : null;

export default function App() {
  const hasApiKey = !!API_KEY;
  const [incidents, setIncidents] = useState<BusIncidents>(null);

  useEffect(() => {
    if (!hasApiKey) {
      return;
    }

    API!
      .getIncidents()
      .then((results) => setIncidents(results))
      .catch((e) => console.error(e));
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

  return (
    <>
      {hasApiKey && <Nav onLogout={handleLogout} />}

      <div className="px-4 mx-auto max-w-screen-md min-w-min">
        <header className="mb-4 w-full flex gap-2">
          <div className="flex-none py-1 px-2 bg-black rounded-md font-sans font-bold text-white text-center">
            <div className="text-5xl">M</div>
            <div className="text-md -mt-2">metro</div>
          </div>
          <div
            id="headsign"
            className="flex-1 flex items-center justify-center bg-black rounded-md"
          >
            <div className="text-4xl text-amber-500 font-mono font-bold">
              DC BUS LIFE
            </div>
          </div>
        </header>

        <main role="main">
          {hasApiKey ? (
            <BusPredictions incidents={incidents} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </main>
      </div>
    </>
  );
}
