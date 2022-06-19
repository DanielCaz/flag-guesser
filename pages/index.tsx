import Link from "next/link";

export default function Home() {
  return (
    <div className="container text-center py-4">
      <h1 className="mb-3">Flag Guesser</h1>
      <Link type="button" href="/singleplayer/game/">
        <a className="btn btn-primary mx-3">Single Player</a>
      </Link>
      <button type="button" className="btn btn-primary mx-3">
        Multiplayer
      </button>
    </div>
  );
}
