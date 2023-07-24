import { useState } from "react";

import DbService from "../services/DbService";
import ApiService, { BusStop, BusIncidents } from "../services/ApiService";

import { BusIcon, SearchIcon, WarningIcon } from "./Icons";

const API = new ApiService(DbService.getApiKey());

type BusSearchProps = {
  incidents: BusIncidents;
};

export default function BusSearch(props: BusSearchProps) {
  const [address, setAddress] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BusStop[]>([]);
  const [noResults, setNoResults] = useState(false);

  const handleAddress = (address: string) => {
    setAddress(address);
    setNoResults(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur(); // Hide keyboard on iOS
    }

    setLoading(true);
    setSearchDisabled(true);

    API.findStops(address)
      .then((results) => {
        setResults(results);
        setNoResults(results.length === 0);

        // Soft-throttle searches to 1 per second
        window.setTimeout(() => setSearchDisabled(false), 1000);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const checkIncidents = (bs: BusStop): boolean => {
    return bs.routes.some((r) => props.incidents?.[r]);
  };

  return (
    <section>
      <div className="mb-6 p-4 bg-slate-100 rounded-lg shadow">
        <form action="return false;" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              onChange={(e) => handleAddress(e.target.value)}
              disabled={searchDisabled}
              className="flex-1 rounded"
              type="search"
              autoCorrect="off"
              placeholder="Bus Stop or Street Address"
            />

            <button
              type="submit"
              disabled={!address || searchDisabled}
              className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {loading && (
          <progress
            id="bus-stop-search-progress-bar"
            aria-label="Loading bus stop search results…"
            className="w-full"
            style={{ border: "revert" }}
          ></progress>
        )}

        <div
          aria-busy={loading}
          aria-describedby="bus-stop-search-progress-bar"
        >
          {noResults && (
            <div className="mt-4 text-center">
              No bus stops found near "{address}".
            </div>
          )}

          {results.length > 0 && (
            <ol className="mt-4 p-2 bg-white rounded-lg grid grid-cols-1 divide-y">
              {results.map((busStop) => (
                <BusStopSearchItem
                  key={busStop.stopId}
                  stopId={busStop.stopId}
                  name={busStop.name}
                  routes={busStop.routes}
                  hasIncident={checkIncidents(busStop)}
                />
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

type BusStopSearchItemProps = {
  stopId: string;
  name: string;
  routes: string[];
  hasIncident: boolean;
};

function BusStopSearchItem(props: BusStopSearchItemProps) {
  return (
    <li className="px-1 flex items-center hover:bg-slate-50 hover:cursor-pointer">
      <BusIcon />
      <div className="p-2">
        <div className="uppercase text-base">{props.name}</div>
        <div className="text-sm">
          <span>#{props.stopId}</span>
          <span className="mx-1">⋅</span>
          <span>{props.routes.join(", ")}</span>
        </div>
      </div>

      {props.hasIncident && (
        <>
          <div className="flex-1"></div>
          <WarningIcon />
        </>
      )}
    </li>
  );
}
