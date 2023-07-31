import { useState, useEffect, useCallback } from "react";

import DbService from "../services/DbService";
import ApiService, { RoutePrediction } from "../services/ApiService";

import { RouteIncidents } from "./App";
import BusIncident from "./BusIncident";
import { BusIcon, RefreshIcon } from "./Icons";

type BusPredictionsProps = {
  stopId: string;
  stopName: string;
  incidents: RouteIncidents;
};

const DB = new DbService();
const API_KEY = DB.getApiKey();
const API = API_KEY ? new ApiService(API_KEY) : null;

export default function BusPredictions(props: BusPredictionsProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(new Date());

  const [stopName, setStopName] = useState(props.stopName);
  const [routePredictions, setRoutePredictions] = useState<RoutePrediction[]>(
    [],
  );

  const urlForStopId = `https://buseta.wmata.com/m/index?q=${props.stopId}`;

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshDisabled(true);

      const results = await API!.getPredictions(props.stopId);

      setStopName(results.stopName);
      setRoutePredictions(results.predictions);
      setRefreshedAt(new Date());
    } catch (e) {
      console.error(e);
      setErrorMsg(`Unable to find Bus Stop ID #${props.stopId}`);
    } finally {
      setLoading(false);
      window.setTimeout(() => setRefreshDisabled(false), 5000); // Soft-throttle requests
    }
  }, [props.stopId]);

  useEffect(() => {
    if (!props.stopId) {
      return;
    }

    void fetchPredictions();
  }, [props.stopId, fetchPredictions]);

  if (errorMsg) {
    return (
      <div className="my-4 p-2 bg-red-50 text-center rounded">
        <div className="font-bold text-red-800">{errorMsg}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-4 p-4 flex items-center justify-center gap-4 bg-slate-100 rounded-lg">
        <BusIcon width={48} height={48} />
        <div>
          <div>#{props.stopId}</div>
          <div className="font-bold text-2xl">{stopName}</div>
        </div>
      </div>

      {loading && (
        <progress
          id="bus-predictions-progress-bar"
          aria-label="Loading bus stop search results…"
          className="w-full"
          style={{ border: "revert" }}
        ></progress>
      )}

      <div
        aria-busy={loading}
        aria-describedby="bus-predictions-progress-bar"
        className={loading ? "hidden" : "grid grid-cols-1 gap-8"}
      >
        {routePredictions.map(({ routeId, headsign, predictions }) => (
          <div key={`${routeId}:${headsign}`} className="p-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{routeId}</span>
              <span className="flex-1 text-center text-xl">{headsign}</span>
            </div>
            <ol key={routeId} className="mt-4 grid grid-cols-1 divide-y gap-2">
              {predictions.map(({ minutes }) => (
                <BusPredictionsItem
                  key={`${routeId}-${minutes}`}
                  minutes={minutes}
                />
              ))}
            </ol>
            {(props.incidents?.[routeId] || []).map((incident) => (
              <BusIncident key={incident.updatedAt.getTime()} {...incident} />
            ))}
          </div>
        ))}

        <div className="my-4 text-center">
          <button
            onClick={() => void fetchPredictions()}
            disabled={refreshDisabled}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold py-1 px-2 rounded inline-flex items-center"
          >
            <RefreshIcon />
            <span>Refresh</span>
          </button>

          <div className="mt-4 text-sm">
            <span className="mr-1">Last updated:</span>
            <span className="ml-1">{refreshedAt.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="my-8 text-center text-sm">
          <span>Get more real-time bus info for this stop at: </span>
          <a className="underline" href={urlForStopId}>
            {urlForStopId}
          </a>
        </div>
      </div>
    </div>
  );
}

type BusPredictionsItemProps = {
  minutes: number;
};

function BusPredictionsItem(props: BusPredictionsItemProps) {
  const arrivingSoon = props.minutes < 10;

  return (
    <li className="py-2">
      <div className="text-xl">
        <span className={arrivingSoon ? "font-bold" : "font-normal"}>
          {props.minutes} min
        </span>
      </div>
    </li>
  );
}
