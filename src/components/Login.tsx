function Login() {
  return (
    <form className="p-4 flex flex-col gap-4">
      <label className="flex flex-col">
        <div className="mb-1">API Key</div>
        <input
          className="rounded"
          name="apiKey"
          type="text"
          placeholder="abcdef0123456789fedcba9876543210"
        />
      </label>

      <button
        type="submit"
        disabled
        className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </form>
  );
}

export default Login;
