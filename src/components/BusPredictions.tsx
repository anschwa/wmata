import { useState, useEffect, useCallback } from "react";

import { BusIcon, WarningIcon, RefreshIcon } from "./Icons";

import DbService from "../services/DbService";
import ApiService, {
  BusIncidents,
  BusIncident,
  BusPrediction,
} from "../services/ApiService";

type BusPredictionsProps = {
  stopId: string;
  stopName: string;
  incidents: BusIncidents;
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
  const [predictions, setPredictions] = useState<BusPrediction[]>([]);

  const urlForStopId = `https://buseta.wmata.com/m/index?q=${props.stopId}`;

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshDisabled(true);
      setPredictions([]);

      const results = await API!.getPredictions(props.stopId);
      setStopName(results.stopName);
      setPredictions(results.predictions);
      setRefreshedAt(new Date());
      setLoading(false);
    } catch (e) {
      console.error(e);
      setErrorMsg(`Bus Stop ID #${props.stopId} does not exist`);
    } finally {
      window.setTimeout(() => setRefreshDisabled(false), 5000); // Soft-throttle requests
    }
  }, [props.stopId]);

  useEffect(() => {
    if (!props.stopId) {
      return;
    }

    void fetchPredictions();
  }, [props.stopId, fetchPredictions]);

  return (
    <div>
      {errorMsg && (
        <div className="my-4 p-2 bg-red-50 text-center rounded">
          <div className="font-bold text-red-800">{errorMsg}</div>
        </div>
      )}

      <div className="py-8 flex-1 flex items-center justify-center gap-4">
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
        className={loading ? "hidden" : ""}
      >
        <ol className="grid grid-cols-1 divide-y rounded-lg shadow">
          {predictions.map((p) => (
            <BusPredictionsItem
              key={`${p.routeId}-${p.minutes}`}
              incidents={props.incidents?.[p.routeId] || []}
              {...p}
            />
          ))}
        </ol>

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
            <span>Last updated at:</span>
            <span>{refreshedAt.toLocaleTimeString()}</span>
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

interface BusPredictionsItemProps {
  routeId: string;
  headsign: string;
  minutes: number;
  incidents: BusIncident[];
}

function BusPredictionsItem(props: BusPredictionsItemProps) {
  return (
    <li className="p-4">
      <div className="font-bold text-xl mb-1">{props.minutes} min</div>

      <div className="flex gap-4 items-center text-xl">
        <div className="">{props.routeId}</div>
        <div className="flex-1 text-center">{props.headsign}</div>
      </div>

      {props.incidents.map((incident) => (
        <Incident key={incident.updatedAt.getTime()} {...incident} />
      ))}
    </li>
  );
}

interface IncidentProps {
  incidentType: string;
  description: string;
  updatedAt: Date;
}

function Incident(props: IncidentProps) {
  const updatedAt = props.updatedAt.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="mt-4 flex gap-2">
      <WarningIcon />
      <div className="flex-1 text-sm">
        <div className="text-sm text-left">{props.description}</div>
        <div className="text-sm text-right">{updatedAt}</div>
      </div>
    </div>
  );
}
