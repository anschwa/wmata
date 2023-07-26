export function BusIcon({ width = 26, height = 26 }) {
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

export function WarningIcon() {
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

export function SearchIcon() {
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

export function BackIcon() {
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
        d="M15.75 19.5L8.25 12l7.5-7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshIcon() {
  return (
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
  );
}
