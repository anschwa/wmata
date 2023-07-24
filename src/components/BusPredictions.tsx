import BusSearch from "./BusSearch";
import { WarningIcon } from "./Icons";

import { BusIncidents } from "../services/ApiService";

type BusPredictionsProps = {
  incidents: BusIncidents;
};

export default function BusPredictions(props: BusPredictionsProps) {
  return (
    <div>
      <BusSearch incidents={props.incidents} />
      <ol className="grid grid-cols-1 divide-y rounded-lg shadow">
        <li className="p-4">
          <div className="font-bold text-xl mb-1">8 min</div>

          <div className="flex gap-4 items-center">
            <div className="text-2xl">B30</div>
            <div className="flex-1 text-base text-center">
              North to Bwi - Thurgood Marshall Airport
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <WarningIcon />
            <div className="flex-1 text-sm">
              Some trips may be delayed due to operator availability.
            </div>
          </div>
        </li>

        <li className="p-4">
          <div className="flex gap-2 items-center">
            <div className="font-bold text-xl mb-1">37 min</div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-2xl">B30</div>
            <div className="flex-1 text-base text-center">
              South to Greenbelt Station
            </div>
          </div>
        </li>

        <li className="p-4">
          <div className="font-bold text-xl mb-1">77 min</div>

          <div className="flex gap-4 items-center">
            <div className="text-2xl">B30</div>
            <div className="flex-1 text-base text-center">
              North to Bwi - Thurgood Marshall Airport
            </div>
          </div>
        </li>
      </ol>

      <div className="my-4 flex justify-center">
        <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-1 px-2 rounded inline-flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <div className="my-8 text-center text-sm">
        <span>Get more real-time bus info for this stop at: </span>
        <a
          className="underline"
          href="https://buseta.wmata.com/m/index?q=1000709"
        >
          https://buseta.wmata.com/m/index?q=1000709
        </a>
      </div>
    </div>
  );
}
