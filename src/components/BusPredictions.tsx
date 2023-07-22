import { useState } from "react";

interface GeoLocation {
  readonly lat: string;
  readonly lon: string;
}

async function getGeoLocationApi(
  streetAddress: string,
): Promise<GeoLocation | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search.php");
  url.searchParams.append("street", streetAddress);
  url.searchParams.append("street", streetAddress);
  url.searchParams.append("city", "washington");
  url.searchParams.append("country", "usa");
  url.searchParams.append("format", "jsonv2");

  const resp = await fetch(url);
  if (!resp.ok) {
    console.error(resp);
    return null;
  }

  const results = (await resp.json()) as GeoLocation[];
  if (results.length === 0) {
    return null;
  }

  const firstResult = results[0];
  const geo = { lat: firstResult.lat, lon: firstResult.lon };

  return geo;
}

interface BusStop {
  readonly StopID: string;
  readonly Name: string;
}
async function getBusStopsApi(
  apiKey: string,
  geo: GeoLocation,
): Promise<BusStop[] | null> {
  const url = new URL("https://api.wmata.com/Bus.svc/json/jStops");
  url.searchParams.append("Lat", geo.lat);
  url.searchParams.append("Lon", geo.lon);
  url.searchParams.append("Radius", "200");

  const resp = await fetch(url, { headers: { api_key: apiKey } });

  if (!resp.ok) {
    console.error(resp);
    return null;
  }

  const results = (await resp.json()) as BusStop[];

  console.log(results);
  return results;
}

async function okayThen(apiKey: string, address: string) {
  const geo = await getGeoLocationApi(address);
  if (!geo) {
    return;
  }

  const stops = await getBusStopsApi(apiKey, geo);

  debugger;
}

type BusPredictionsProps = {
  apiKey: string;
};

function BusPredictions(props: BusPredictionsProps) {
  const [disableSearch, setDisableSearch] = useState(false);
  const [busStopAddress, setBusStopAddress] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisableSearch(true);

    okayThen(props.apiKey, busStopAddress);
  }

  return (
    <>
      <div className="mx-4">
        <div className="my-4 p-4 bg-slate-100 rounded">
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 -960 960 960"
              >
                <path d="M249-120q-13 0-23-7.5T216-147v-84q-29-16-42.5-46T160-341v-397q0-74 76.5-108T481-880q166 0 242.5 34T800-738v397q0 34-13.5 64T744-231v84q0 12-10 19.5t-23 7.5h-19q-14 0-24-7.5T658-147v-55H302v55q0 12-10 19.5t-24 7.5h-19Zm232-644h259-520 261Zm177 293H220h520-82Zm-438-60h520v-173H220v173Zm106 219q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16Zm308 0q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16ZM220-764h520q-24-26-92-41t-167-15q-118 0-181 13.5T220-764Zm82 502h356q35 0 58.5-27t23.5-62v-120H220v120q0 35 23.5 62t58.5 27Z" />
              </svg>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                onChange={(e) => setBusStopAddress(e.target.value)}
                disabled={disableSearch}
                className="flex-1 rounded"
                name="stopId"
                type="text"
                placeholder="Bus Stop or Street Address"
              />
            </form>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-center">
          <button className="px-3 py-1 text-sm text-semibold text-white bg-slate-700 border border-slate-700 rounded-full">
            #6000234
          </button>
          <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full">
            #6000235
          </button>
          <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full">
            #3000820
          </button>
        </div>
      </div>

      <div className="m-2 rounded-lg shadow-md divide-y">
        <div className="m-2">
          <div className="py-4 px-2">
            <div className="font-bold text-xl mb-1">8 min</div>

            <div className="flex gap-4 items-center">
              <div className="text-2xl">B30</div>
              <div className="flex-1 text-base text-center">
                North to Bwi - Thurgood Marshall Airport
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <div className="w-6 h-6">
                <svg
                  className="text-yellow-500"
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
              </div>

              <div className="flex-1 text-sm">
                Some trips may be delayed due to operator availability.
              </div>
            </div>
          </div>
        </div>

        <div className="m-2 divide-y">
          <div className="py-4 px-2">
            <div className="flex gap-2 items-center">
              <div className="font-bold text-xl mb-1">37 min</div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="text-2xl">B30</div>
              <div className="flex-1 text-base text-center">
                South to Greenbelt Station
              </div>
            </div>
          </div>
        </div>

        <div className="m-2 divide-y">
          <div className="py-4 px-2">
            <div className="font-bold text-xl mb-1">77 min</div>

            <div className="flex gap-4 items-center">
              <div className="text-2xl">B30</div>
              <div className="flex-1 text-base text-center">
                North to Bwi - Thurgood Marshall Airport
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusPredictions;
