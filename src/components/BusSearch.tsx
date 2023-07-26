import { useState } from "react";

import DbService from "../services/DbService";
import ApiService, { BusStop, BusIncidents } from "../services/ApiService";

import { BusIcon, SearchIcon, WarningIcon } from "./Icons";

const DB = new DbService();
const API_KEY = DB.getApiKey();
const API = API_KEY ? new ApiService(API_KEY) : null;

type BusSearchProps = {
  onSubmit: (bs: BusStop) => void;
  incidents: BusIncidents;
};

export default function BusSearch(props: BusSearchProps) {
  const [address, setAddress] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BusStop[]>([]);
  const [noResults, setNoResults] = useState(false);

  const checkForIncidents = (bs: BusStop): boolean => {
    return bs.routes.some((r) => props.incidents?.[r]);
  };

  const checkForStopId = (query: string) => {
    return query.split(/\s/).length === 1 && /^#?[0-9]+$/.test(query);
  };

  const handleAddress = (address: string) => {
    setAddress(address);
    setResults([]);
    setNoResults(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur(); // Hide keyboard on iOS
    }

    if (checkForStopId(address)) {
      const busStop: BusStop = {
        stopId: address.replace(/#/, ""),
        stopName: "",
        routes: [],
      };

      props.onSubmit(busStop);
      return;
    }

    setLoading(true);
    setSearchDisabled(true);

    API!
      .findStops(address)
      .then((results) => {
        setResults(results);
        setNoResults(results.length === 0);

        // Soft-throttle searches to 1 per second
        window.setTimeout(() => setSearchDisabled(false), 1000);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-slate-100 rounded-lg shadow">
        <form action="return false;" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              value={address}
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
                  onClick={() => props.onSubmit(busStop)}
                  hasIncident={checkForIncidents(busStop)}
                  {...busStop}
                />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

type BusStopSearchItemProps = {
  stopId: string;
  stopName: string;
  routes: string[];
  hasIncident: boolean;
  onClick: () => void;
};

function BusStopSearchItem(props: BusStopSearchItemProps) {
  return (
    <li
      onClick={props.onClick}
      className="px-1 flex items-center hover:bg-slate-50 hover:cursor-pointer"
    >
      <BusIcon />
      <div className="p-2">
        <div className="uppercase text-base">{props.stopName}</div>
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
