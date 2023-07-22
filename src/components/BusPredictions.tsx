import { useState, useEffect } from "react";

import DB from "../services/DbService";
import BusApi from "../services/ApiService";

const API = new BusApi(DB.getApiKey());

function BusIcon({ width = 26, height = 26 }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 -960 960 960"
      >
        <path d="M249-120q-13 0-23-7.5T216-147v-84q-29-16-42.5-46T160-341v-397q0-74 76.5-108T481-880q166 0 242.5 34T800-738v397q0 34-13.5 64T744-231v84q0 12-10 19.5t-23 7.5h-19q-14 0-24-7.5T658-147v-55H302v55q0 12-10 19.5t-24 7.5h-19Zm232-644h259-520 261Zm177 293H220h520-82Zm-438-60h520v-173H220v173Zm106 219q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16Zm308 0q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16ZM220-764h520q-24-26-92-41t-167-15q-118 0-181 13.5T220-764Zm82 502h356q35 0 58.5-27t23.5-62v-120H220v120q0 35 23.5 62t58.5 27Z" />
      </svg>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg
      className="w-6 h-6 text-yellow-500"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BusPredictions() {
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    document.activeElement.blur(); // Hide keyboard on iOS

    setSearchDisabled(true); // Prevent redundant searches

    // API.findStops(address);
    debugger;

    setSearchDisabled(false);
  }

  return (
    <div>
      <div className="mt-4 mb-6 p-4 bg-slate-100 rounded-lg shadow">
        <form action="return false;" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              onChange={(e) => setAddress(e.target.value)}
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

        <ol className="mt-4 p-2 bg-white rounded-lg grid grid-cols-1 divide-y">
          <li className="px-1 flex items-center hover:bg-slate-50 hover:cursor-pointer">
            <BusIcon />
            <div className="p-2">
              <div className="uppercase text-base">potomac ave + 13th st</div>
              <div className="text-sm">
                <span>#1000544</span>
                <span className="mx-1">⋅</span>
                <span>V7, V8, V9</span>
              </div>
            </div>

            <div className="flex-1"></div>
            <WarningIcon />
          </li>

          <li className="px-1 flex items-center hover:bg-slate-50 hover:cursor-pointer">
            <BusIcon />
            <div className="p-2">
              <div className="uppercase text-base">
                PENNSYLVANIA AVE SE + 13TH ST SE
              </div>
              <div className="text-sm">
                <span>#1000587</span>
                <span className="mx-1">⋅</span>
                <span>30N, 30S, 32, 34, 36</span>
              </div>
            </div>
          </li>
        </ol>
      </div>

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
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-bold py-1 px-2 rounded inline-flex items-center">
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
    </div>
  );
}
