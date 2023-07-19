import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <nav className="mx-2 flex justify-end gap-2 hidden">
          <div id="user" className="w-6 h-6">
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <button
            onClick={() => null}
            name="logout"
            className="underline"
          >Logout</button>
        </nav>

        <div className="p-2 w-full flex gap-2">
          <div className="flex-none py-1 px-2 bg-black rounded-md font-sans font-bold text-white text-center">
            <div className="text-5xl">M</div>
            <div className="text-md -mt-2">metro</div>

          </div>
          <div id="headsign" className="flex-1 flex items-center justify-center bg-black rounded-md">
            <div
              className="text-4xl text-amber-500 font-mono font-bold"
            >DC BUS LIFE</div>
          </div>
        </div>
      </header>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
