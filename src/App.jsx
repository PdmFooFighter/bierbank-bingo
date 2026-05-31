import { useMemo, useState } from "react";
import "./App.css";

const events = [
  { text: '"Reichtum durch sparen!"', xp: 1 },
  { text: '"Je m\\\'appelle Luc"', xp: 1 },
  { text: '"FOLGENDES!"', xp: 3 },
  { text: "Bierbank erschreckt sich", xp: 3 },
  { text: "Bierbank landet auf Windrad", xp: 3 },
  { text: "Nade-Kill", xp: 1 },
  { text: "10er Sub-Bombe", xp: 5 },
  { text: "20er Sub-Bombe", xp: 10 },
  { text: "Pan-Kill", xp: 5 },
  { text: ">500m Kill", xp: 10 },
  { text: "C4-Car-Kill", xp: 10 },
  { text: "Bierbank nutzt ein Wasserfahrzeug", xp: 3 },
  { text: "Quick Math", xp: 1 },
  { text: "Grafikkartengeneration", xp: 3 },
  { text: "Kill mit Gleiter", xp: 5 },
  { text: "50er Sub-Bombe", xp: 20 },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [completed, setCompleted] = useState([]);

  const score = useMemo(
    () => completed.reduce((sum, index) => sum + events[index].xp, 0),
    [completed]
  );

  const toggle = (index) => {
    setCompleted((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  };

  if (!loggedIn) {
    return (
      <main className="page center">
        <section className="card login">
          <div className="tag">Prototype v0.1</div>
          <h1>Bierbank Bingo</h1>
          <p>Wöchentliche 4x4-Bingo-Karte für PUBG-Stream-Momente.</p>
          <button onClick={() => setLoggedIn(true)}>Mit Twitch anmelden</button>
          <small>Demo-Version. Echter Twitch-Login folgt später.</small>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Bierbank Bingo</h1>
          <p>KW 23/2026 · gültig bis Samstag, 23:59 Uhr</p>
        </div>
        <div className="stats">
          <strong>{completed.length}/16</strong>
          <span>Felder</span>
          <strong>{score}</strong>
          <span>XP</span>
        </div>
      </header>

      <section className="grid">
        {events.map((event, index) => (
          <button
            key={event.text}
            className={`tile ${completed.includes(index) ? "done" : ""}`}
            onClick={() => toggle(index)}
          >
            <span>{event.text}</span>
            <b>{event.xp} XP</b>
          </button>
        ))}
      </section>
    </main>
  );
}