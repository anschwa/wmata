import Nav from "./Nav";
import Login from "./Login";

const getApiKey = () => localStorage.getItem("apiKey");
// const setApiKey = (apiKey: string) => localStorage.setItem("apiKey", apiKey);
// const deleteApiKey = () => localStorage.removeItem("apiKey");

function App() {
  const apiKey = getApiKey();

  const logout = () => {
    if (!window.confirm("Delete API Key and logout?")) {
      return;
    }

    window.location.reload();
  };

  return (
    <>
      <header>
        {apiKey ? <Nav logoutFn={logout} /> : null}

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

      {!apiKey ? <Login /> : null}
    </>
  );
}

export default App;
