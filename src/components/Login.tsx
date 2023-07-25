import { useState } from "react";

import { validateApiKey } from "../services/ApiService";

type LoginProps = {
  onLogin: (apiKey: string) => void;
};

function Login(props: LoginProps) {
  const [apiKey, setApiKey] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loginDisabled, setLoginDisabled] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginDisabled(true); // Soft-throttle requests

    validateApiKey(apiKey)
      .then((valid) => {
        if (!valid) {
          setErrorMsg("Invalid API Key for WMATA");
          return;
        }

        props.onLogin(apiKey);
      })
      .catch((e) => console.error(e));
  };

  const handleInput = (apiKey: string) => {
    setApiKey(apiKey);
    setLoginDisabled(apiKey.length === 0);
    setErrorMsg("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      {errorMsg && (
        <div className="p-2 bg-red-50 text-center rounded">
          <div className="font-bold text-red-800">{errorMsg}</div>
        </div>
      )}

      <label className="flex flex-col">
        <div className="mb-1">API Key</div>
        <input
          onChange={(e) => handleInput(e.target.value)}
          onBlur={() => setLoginDisabled(apiKey.length === 0)}
          className="rounded"
          name="apiKey"
          type="text"
          placeholder="abcdef0123456789fedcba9876543210"
        />
      </label>

      <button
        type="submit"
        disabled={loginDisabled}
        className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </form>
  );
}

export default Login;
