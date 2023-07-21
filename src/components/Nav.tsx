type NavProps = {
  onLogout: () => void;
};

function Nav(props: NavProps) {
  return (
    <nav className="mx-2 flex justify-end gap-2">
      <div id="user" className="w-6 h-6">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>

      <button onClick={props.onLogout} className="underline">
        Logout
      </button>
    </nav>
  );
}

export default Nav;
