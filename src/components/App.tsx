import { useState } from "react";

import Nav from "./Nav";
import Login from "./Login";
import BusPredictions from "./BusPredictions";

const DB = {
  getApiKey() {
    return localStorage.getItem("apiKey");
  },
  setApiKey(apiKey: string) {
    localStorage.setItem("apiKey", apiKey);
  },
  deleteApiKey() {
    localStorage.removeItem("apiKey");
  },
};

function App() {
  const [hasApiKey, setHasApiKey] = useState(!!DB.getApiKey());
  const handleLogin = (apiKey: string) => {
    DB.setApiKey(apiKey);

    setHasApiKey(true);
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
      <header>
        {hasApiKey ? <Nav onLogout={handleLogout} /> : null}

        <div className="p-2 w-full flex gap-2">
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
        </div>
      </header>

      <main role="main" className="min-w-min">
        {!hasApiKey ? <Login onLogin={handleLogin} /> : <BusPredictions />}
      </main>
    </>
  );
}

export default App;
