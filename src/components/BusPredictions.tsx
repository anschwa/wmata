import { useState } from "react";

type BusPredictionsProps = {};

function BusPredictions(props: BusPredictionsProps) {
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

            <input
              className="flex-1 rounded"
              name="stopId"
              type="text"
              placeholder="Bus Stop ID"
            />
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
          {/* <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full"> */}
          {/*   #3000821 */}
          {/* </button> */}
          {/* <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full"> */}
          {/*   #3000822 */}
          {/* </button> */}
          {/* <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full"> */}
          {/*   #5001104 */}
          {/* </button> */}
          {/* <button className="px-3 py-1 text-sm text-semibold border border-slate-500 rounded-full"> */}
          {/*   #5001105 */}
          {/* </button> */}
        </div>
      </div>

      <div className="m-4 rounded shadow-md">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">8 min</div>

          <div className="text-lg">
            [B30] North to Bwi - Thurgood Marshall Airport
          </div>
        </div>
      </div>

      <div className="m-4 rounded shadow-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl mb-2">37 min</div>
            <div className="w-8 h-8">
              <svg
                className="text-amber-500"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-lg">[B30] South to Greenbelt Station</div>
        </div>
      </div>

      <div className="m-4 rounded shadow-md">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">77 min</div>

          <div className="text-lg">
            [B30] North to Bwi - Thurgood Marshall Airport
          </div>
        </div>
      </div>
    </>
  );
}

export default BusPredictions;
