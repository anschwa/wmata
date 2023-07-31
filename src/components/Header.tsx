export default function Header() {
  return (
    <header className="mb-4 w-full flex gap-2">
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
    </header>
  );
}
