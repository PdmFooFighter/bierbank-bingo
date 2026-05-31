import { useMemo, useState } from "react";
import "./App.css";

const RARITY = {
  common: { xp: 1 },
  mid: { xp: 3 },
  rare: { xp: 5 },
  superRare: { xp: 10 },
  legendary: { xp: 20 },
};

const EVENTS = [
  { id: "bridge", text: "Brückencamping (volle Blockade)", rarity: "rare" },
  { id: "sparen", text: '"Reichtum durch sparen!"', rarity: "common" },
  { id: "chicken10", text: ">10-Kill Chicken Dinner", rarity: "mid" },
  { id: "beleidigung", text: "In Game Beleidigung", rarity: "mid" },
  { id: "essen", text: "!essen wird vorgesungen", rarity: "rare" },
  { id: "erschreckt", text: "Bierbank erschreckt sich", rarity: "mid" },
  { id: "mast_land", text: "Bierbank landet auf Mast", rarity: "common" },
  { id: "mast_dead", text: "Bierbank wird vom Mast geholt (dead)", rarity: "mid" },
  { id: "glider_kill", text: "Kill mit Gleiter", rarity: "rare" },
  { id: "last_christmas", text: 'Bierbank singt "Last Christmas"', rarity: "mid" },
  { id: "flash_final", text: "Letzter Gegner bekommt min. 5 Flash Nades", rarity: "mid" },
  { id: "windrad", text: "Bierbank landet auf Windrad", rarity: "mid" },
  { id: "gatka", text: "King Of Gatka", rarity: "mid" },
  { id: "kill500", text: ">500m Kill", rarity: "superRare" },
  { id: "auto_hide", text: "Bierbank versteckt sich in einem Auto", rarity: "superRare" },
  { id: "pan", text: "Pan-Kill", rarity: "rare" },
  { id: "luc", text: '"Je m\\\'appelle Luc"', rarity: "common" },
  { id: "mass_attack", text: "Mass Attack Viewer Attack", rarity: "common" },
  { id: "gpu", text: "Grafikkartengeneration", rarity: "mid" },
  { id: "sub5", text: "5er Sub-Bombe", rarity: "mid" },
  { id: "sub10", text: "10er Sub-Bombe", rarity: "rare" },
  { id: "sub20", text: "20er Sub-Bombe", rarity: "superRare" },
  { id: "sub50", text: "50er Sub-Bombe", rarity: "legendary" },
  { id: "raid50", text: "Raid >50 Viewer", rarity: "superRare" },
  { id: "fist", text: "Fist Fight Win", rarity: "rare" },
  { id: "nade", text: "Nade-Kill", rarity: "common" },
  { id: "brdm", text: "BRDM Call", rarity: "rare" },
  { id: "pistol", text: "Pistol-Kill", rarity: "superRare" },
  { id: "c4car", text: "C4-Car-Kill", rarity: "superRare" },
  { id: "emote", text: "Bierbank macht PUBG-Emote nach", rarity: "rare" },
  { id: "busch", text: "Bierbank versteckt sich in einem Busch", rarity: "rare" },
  { id: "quick_math", text: "Quick Math - Bierbank rechnet etwas vor", rarity: "common" },
  { id: "vss", text: "Bierbank erfreut sich über seine VSS-Kills", rarity: "mid" },
  { id: "airfight", text: "Luftkampf - Battle gegen anderen Gleiter", rarity: "rare" },
  { id: "airdrops3", text: "3 Airdrops in einer Runde looten", rarity: "superRare" },
  { id: "subgoal", text: "Sub-Goal wird erreicht", rarity: "rare" },
  { id: "no_ar", text: "keine AR-Muni im Endgame", rarity: "rare" },
  { id: "c4_dinner", text: "C4-Car-Dinner", rarity: "legendary" },
  { id: "eps2", text: "2 EPs in einer Runde genutzt", rarity: "rare" },
  { id: "s12k", text: "S12K-Kill", rarity: "mid" },
  { id: "armbrust", text: "Armbrust-Kill", rarity: "rare" },
  { id: "mg3_5", text: "5 MG3-Kills in einer Runde", rarity: "mid" },
  { id: "dbs_5", text: "5 DBS-Kills in einer Runde", rarity: "rare" },
  { id: "folg", text: '"FOLGENDES!"', rarity: "mid" },
  { id: "molo", text: "Molotov-Kill", rarity: "common" },
  { id: "blue_dead", text: "Bierbank stirbt an der Blue Zone", rarity: "rare" },
  { id: "no_weapon", text: "keine Waffe im ersten Gebäude", rarity: "mid" },
  { id: "sr_no_scope", text: "SR-Kill ohne Visier", rarity: "rare" },
  { id: "driveby", text: "Sniper-Driveby-Kill", rarity: "mid" },
  { id: "panzerfaust", text: "Panzerfaust-Kill", rarity: "common" },
  { id: "secret_room", text: "Secret-Room ohne Level 3 Gear", rarity: "common" },
  { id: "pickaxe_cover", text: "Bierbank nutzt die Pickaxe um Cover zu haben", rarity: "mid" },
  { id: "diner", text: "Fight im Diner in Severny", rarity: "common" },
  { id: "wasserfahrzeug", text: "Bierbank nutzt ein Wasserfahrzeug", rarity: "mid" },
  { id: "5er_dmr", text: "Kill mit 5er-DMR", rarity: "mid" },
  { id: "streamer_kill", text: "Bierbank killt bekannten Streamer", rarity: "rare" },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickByRarity(rarity, count) {
  return shuffle(EVENTS.filter((event) => event.rarity === rarity)).slice(0, count);
}

function createCard() {
  const hasLegendary = Math.random() < 0.05;

  const card = [
    ...pickByRarity("common", 7),
    ...pickByRarity("mid", 5),
    ...pickByRarity("rare", hasLegendary ? 2 : 3),
    ...pickByRarity("superRare", 1),
    ...(hasLegendary ? pickByRarity("legendary", 1) : []),
  ];

  return shuffle(card);
}

function getCompletedLines(completedIndexes) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  return lines.filter((line) => line.every((index) => completedIndexes.includes(index)));
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [card, setCard] = useState(() => createCard());
  const [completed, setCompleted] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [eventLog, setEventLog] = useState([]);

  const score = useMemo(
    () => completed.reduce((sum, index) => sum + RARITY[card[index].rarity].xp, 0),
    [completed, card]
  );

  const lines = useMemo(() => getCompletedLines(completed), [completed]);
  const fullBingo = completed.length === 16;

  function triggerEvent(eventId) {
    const matchingIndexes = card
      .map((event, index) => (event.id === eventId ? index : null))
      .filter((index) => index !== null);

    const newIndexes = matchingIndexes.filter((index) => !completed.includes(index));

    if (newIndexes.length > 0) {
      setCompleted((prev) => [...prev, ...newIndexes]);
    }

    const event = EVENTS.find((item) => item.id === eventId);
    setEventLog((prev) => [
      {
        text: event.text,
        time: new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        hit: newIndexes.length > 0,
      },
      ...prev,
    ].slice(0, 8));
  }

  if (!loggedIn) {
    return (
      <main className="page center">
        <section className="card login">
          <div className="tag">Prototype v0.2</div>
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
          <strong>{lines.length}</strong>
          <span>Reihen</span>
          <strong>{fullBingo ? "Ja" : "Nein"}</strong>
          <span>Bingo</span>
        </div>
      </header>

      <section className="grid">
        {card.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className={`tile ${completed.includes(index) ? "done" : ""}`}
          >
            <span>{event.text}</span>
            <b>{RARITY[event.rarity].xp} XP</b>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: 1100, margin: "24px auto 0" }}>
        <button
          style={{
            padding: "12px 16px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.2)",
            background: adminMode ? "#7c3aed" : "rgba(255,255,255,.06)",
            color: "white",
            fontWeight: 700,
          }}
          onClick={() => setAdminMode(!adminMode)}
        >
          {adminMode ? "Admin-Modus ausblenden" : "Admin-Modus anzeigen"}
        </button>
      </section>

      {adminMode && (
        <section style={{ maxWidth: 1100, margin: "18px auto 0" }}>
          <h2>Admin-Trigger</h2>
          <p style={{ color: "#a1a1aa" }}>
            Später nur sichtbar für dich und freigeschaltete Mods.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {EVENTS.map((event) => (
              <button
                key={event.id}
                onClick={() => triggerEvent(event.id)}
                style={{
                  minHeight: 52,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.06)",
                  color: "white",
                  textAlign: "left",
                }}
              >
                {event.text}
              </button>
            ))}
          </div>

          <h3>Eventlog</h3>
          {eventLog.map((event, index) => (
            <div key={index} style={{ color: event.hit ? "#a7f3d0" : "#a1a1aa" }}>
              {event.time} · {event.text} {event.hit ? "✓" : "— nicht auf Karte"}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}