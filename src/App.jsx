import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

const RARITY = {
  common: { xp: 1 },
  mid: { xp: 3 },
  rare: { xp: 5 },
  superRare: { xp: 10 },
  legendary: { xp: 20 },
};

// Twitch-Namen immer kleingeschrieben eintragen.
// Weitere Mods können später einfach ergänzt werden.
const ADMIN_TWITCH_NAMES = ["pdmfoofighter", "bierbankb"];
const MOD_TWITCH_NAMES = [];
const RULES_VERSION = "alpha-1";

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

  return shuffle([
    ...pickByRarity("common", 7),
    ...pickByRarity("mid", 5),
    ...pickByRarity("rare", hasLegendary ? 2 : 3),
    ...pickByRarity("superRare", 1),
    ...(hasLegendary ? pickByRarity("legendary", 1) : []),
  ]);
}

function getIsoWeekData(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);

  return {
    year: utcDate.getUTCFullYear(),
    week,
  };
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

  return lines.filter((line) =>
    line.every((index) => completedIndexes.includes(index))
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [card, setCard] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [eventLog, setEventLog] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminSort, setAdminSort] = useState("xp-desc");
  const [justDrawn, setJustDrawn] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [acceptingRules, setAcceptingRules] = useState(false);
  const [rulesConfirmed, setRulesConfirmed] = useState(false);
  const [message, setMessage] = useState("");

  const { year, week } = useMemo(() => getIsoWeekData(), []);

  useEffect(() => {
    async function initializeAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(`Login konnte nicht geprüft werden: ${error.message}`);
      }

      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRulesAccepted(false);
      setRulesLoading(false);
      return;
    }

    async function loadRuleAcceptance() {
      setRulesLoading(true);

      const { data, error } = await supabase
        .from("rule_acceptances")
        .select("rules_version")
        .eq("user_id", user.id)
        .eq("rules_version", RULES_VERSION)
        .maybeSingle();

      if (error) {
        setMessage(`Regelbestätigung konnte nicht geprüft werden: ${error.message}`);
        setRulesAccepted(false);
      } else {
        setRulesAccepted(Boolean(data));
      }

      setRulesLoading(false);
    }

    loadRuleAcceptance();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCard(null);
      setCompleted([]);
      return;
    }

    async function loadWeeklyData() {
      setCardLoading(true);
      setProgressLoading(true);
      setMessage("");

      const { data: cardData, error: cardError } = await supabase
        .from("weekly_cards")
        .select("card")
        .eq("user_id", user.id)
        .eq("year", year)
        .eq("week", week)
        .maybeSingle();

      if (cardError) {
        setMessage(`Wochenkarte konnte nicht geladen werden: ${cardError.message}`);
        setCardLoading(false);
        setProgressLoading(false);
        return;
      }

      const loadedCard = cardData?.card ?? null;
      setCard(loadedCard);
      setCardLoading(false);

      if (!loadedCard) {
        setCompleted([]);
        setProgressLoading(false);
        return;
      }

      const { data: progressData, error: progressError } = await supabase
        .from("card_progress")
        .select("event_id")
        .eq("user_id", user.id)
        .eq("year", year)
        .eq("week", week);

      if (progressError) {
        setMessage(`Fortschritt konnte nicht geladen werden: ${progressError.message}`);
      } else {
        const completedEventIds = new Set(
          (progressData ?? []).map((entry) => entry.event_id)
        );

        const completedIndexes = loadedCard
          .map((event, index) =>
            completedEventIds.has(event.id) ? index : null
          )
          .filter((index) => index !== null);

        setCompleted(completedIndexes);
      }

      setProgressLoading(false);
    }

    loadWeeklyData();
  }, [user, year, week]);

  async function acceptRules() {
    if (!user || !rulesConfirmed || acceptingRules) return;

    setAcceptingRules(true);
    setMessage("");

    const { error } = await supabase.from("rule_acceptances").upsert(
      {
        user_id: user.id,
        rules_version: RULES_VERSION,
      },
      {
        onConflict: "user_id,rules_version",
      }
    );

    if (error) {
      setMessage(`Regeln konnten nicht bestätigt werden: ${error.message}`);
    } else {
      setRulesAccepted(true);
    }

    setAcceptingRules(false);
  }

  async function loginWithTwitch() {
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "twitch",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(`Twitch-Login fehlgeschlagen: ${error.message}`);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setCard(null);
    setCompleted([]);
  }

  async function drawWeeklyCard() {
    if (!user || cardLoading) return;

    setCardLoading(true);
    setMessage("");

    const newCard = createCard();

    const { data, error } = await supabase
      .from("weekly_cards")
      .insert({
        user_id: user.id,
        year,
        week,
        card: newCard,
      })
      .select("card")
      .single();

    if (error) {
      if (error.code === "23505") {
        const { data: existingCard, error: reloadError } = await supabase
          .from("weekly_cards")
          .select("card")
          .eq("user_id", user.id)
          .eq("year", year)
          .eq("week", week)
          .single();

        if (reloadError) {
          setMessage(`Vorhandene Karte konnte nicht geladen werden: ${reloadError.message}`);
        } else {
          setCard(existingCard.card);
        }
      } else {
        setMessage(`Karte konnte nicht gezogen werden: ${error.message}`);
      }
    } else {
      setCard(data.card);
    }

    setCardLoading(false);
  }

  async function triggerEvent(eventId) {
    if (!card || !user) return;

    const matchingIndexes = card
      .map((event, index) => (event.id === eventId ? index : null))
      .filter((index) => index !== null);

    const newIndexes = matchingIndexes.filter(
      (index) => !completed.includes(index)
    );

    const event = EVENTS.find((item) => item.id === eventId);
    const time = new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (newIndexes.length === 0) {
      setEventLog((previous) =>
        [
          {
            text: event.text,
            time,
            hit: false,
          },
          ...previous,
        ].slice(0, 8)
      );
      return;
    }

    const { error } = await supabase.from("card_progress").insert({
      user_id: user.id,
      year,
      week,
      event_id: eventId,
    });

    if (error && error.code !== "23505") {
      setMessage(`Fortschritt konnte nicht gespeichert werden: ${error.message}`);
      return;
    }

    setCompleted((previous) => {
      const merged = new Set([...previous, ...newIndexes]);
      return [...merged].sort((a, b) => a - b);
    });

    setEventLog((previous) =>
      [
        {
          text: event.text,
          time,
          hit: true,
        },
        ...previous,
      ].slice(0, 8)
    );
  }


  async function undoLastTrigger() {
    if (!user || !card) return;

    setMessage("");

    const { data: latest, error: loadError } = await supabase
      .from("card_progress")
      .select("id, event_id, completed_at")
      .eq("user_id", user.id)
      .eq("year", year)
      .eq("week", week)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (loadError) {
      setMessage(`Letzter Trigger konnte nicht gefunden werden: ${loadError.message}`);
      return;
    }

    if (!latest) {
      setMessage("Es gibt keinen gespeicherten Trigger zum Rückgängigmachen.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("card_progress")
      .delete()
      .eq("id", latest.id);

    if (deleteError) {
      setMessage(`Trigger konnte nicht rückgängig gemacht werden: ${deleteError.message}`);
      return;
    }

    const removedIndexes = card
      .map((event, index) => (event.id === latest.event_id ? index : null))
      .filter((index) => index !== null);

    setCompleted((previous) =>
      previous.filter((index) => !removedIndexes.includes(index))
    );

    const removedEvent = EVENTS.find((event) => event.id === latest.event_id);

    setEventLog((previous) => [
      {
        text: `${removedEvent?.text ?? latest.event_id} rückgängig gemacht`,
        time: new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        hit: false,
      },
      ...previous,
    ].slice(0, 8));
  }


  const twitchName =
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.name ||
    user?.email ||
    "Twitch User";

  const twitchAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.profile_image_url ||
    null;

  const normalizedTwitchName = twitchName.toLowerCase();
  const isAdmin = ADMIN_TWITCH_NAMES.includes(normalizedTwitchName);
  const isMod = MOD_TWITCH_NAMES.includes(normalizedTwitchName);
  const canTriggerEvents = isAdmin || isMod;

  const filteredAdminEvents = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();

    const filtered = EVENTS.filter((event) =>
      event.text.toLowerCase().includes(query)
    );

    return [...filtered].sort((a, b) => {
      const xpA = RARITY[a.rarity].xp;
      const xpB = RARITY[b.rarity].xp;

      if (adminSort === "xp-asc") return xpA - xpB || a.text.localeCompare(b.text);
      if (adminSort === "alpha") return a.text.localeCompare(b.text);
      return xpB - xpA || a.text.localeCompare(b.text);
    });
  }, [adminSearch, adminSort]);

  const hasLegendaryField = Boolean(
    card?.some((event) => event.rarity === "legendary")
  );

  const score = useMemo(() => {
    if (!card) return 0;

    return completed.reduce(
      (sum, index) => sum + RARITY[card[index].rarity].xp,
      0
    );
  }, [completed, card]);

  const lines = useMemo(
    () => getCompletedLines(completed),
    [completed]
  );

  const fullBingo = Boolean(card) && completed.length === 16;

  if (loading) {
    return (
      <main className="page center">
        <section className="card login">
          <h1>Bierbank Bingo</h1>
          <p>Login wird geprüft...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page center">
        <section className="card login">
          <div className="tag">Ultimate Alpha</div>
          <h1>Bierbank Bingo</h1>
          <p>
            Ziehe deine persönliche Wochenkarte und sammle während der Streams
            automatisch ausgelöste Bingo-Felder.
          </p>

          {message && <p className="error-message">{message}</p>}

          <button onClick={loginWithTwitch}>Mit Twitch anmelden</button>
          <small>Login über Twitch und Supabase.</small>
        </section>
      </main>
    );
  }

  if (cardLoading || progressLoading || rulesLoading) {
    return (
      <main className="page center">
        <section className="card login">
          <div className="tag">Alpha</div>
          <h1>Bierbank Bingo</h1>
          <p>Deine Wochenkarte und dein Fortschritt werden geladen...</p>
        </section>
      </main>
    );
  }

  if (!rulesAccepted) {
    return (
      <main className="page center rules-gate-page">
        <section className="card rules-gate">
          <div className="tag">Ultimate Alpha</div>
          <p className="eyebrow">Teilnahmebedingungen</p>
          <h1>Fair spielen. Stream genießen.</h1>
          <p className="rules-intro">
            Das Bingo soll den Stream unterhaltsamer machen, ohne BierbankBs
            Spielweise oder die Community negativ zu beeinflussen.
          </p>

          <div className="mandatory-rules">
            <article>
              <strong>Keine automatischen Trigger</strong>
              <span>
                Felder werden ausschließlich durch den Ersteller des Bingos oder
                freigeschaltete Mods ausgelöst.
              </span>
            </article>

            <article>
              <strong>Kein Backseat Gaming</strong>
              <span>
                BierbankB spielt wie immer. Keine Taktiken, Orte, Waffen oder
                Aktionen verlangen, nur um ein Bingofeld zu erfüllen.
              </span>
            </article>

            <article>
              <strong>Keine Support-Aufforderungen</strong>
              <span>
                Keine Spenden, Subs, Sub-Bomben oder andere Community-Events
                fordern. Entweder man hat Glück oder übt sich in Geduld.
              </span>
            </article>

            <article>
              <strong>Konsequenzen bei Missbrauch</strong>
              <span>
                Verstöße können zum Ausschluss aus der App, zur Account-Sperre
                oder zu einem Twitch-Ban führen. Wiederholter Missbrauch kann
                zur Einstellung des Bingos führen.
              </span>
            </article>
          </div>

          <label className="rules-checkbox">
            <input
              type="checkbox"
              checked={rulesConfirmed}
              onChange={(event) => setRulesConfirmed(event.target.checked)}
            />
            <span>
              Ich habe die Regeln gelesen und werde weder Backseat Gaming
              betreiben noch Events, Subs, Spenden oder Aktionen einfordern.
            </span>
          </label>

          {message && <p className="error-message">{message}</p>}

          <button
            className="primary-button"
            onClick={acceptRules}
            disabled={!rulesConfirmed || acceptingRules}
          >
            {acceptingRules ? "Wird gespeichert..." : "Regeln bestätigen"}
          </button>

          <button className="secondary-button rules-logout" onClick={logout}>
            Logout
          </button>
        </section>
      </main>
    );
  }

  if (!card) {
    return (
      <main className="page center">
        <section className="card draw-card">
          <div className="tag">Ultimate Alpha</div>
          <p className="eyebrow">
            KW {week}/{year}
          </p>
          <h1>Neue Wochenkarte verfügbar</h1>
          <p>
            Ziehe jetzt deine persönliche 4×4-Karte. Sie gilt bis Samstag,
            23:59 Uhr. Vergangene Stream-Ereignisse werden nicht rückwirkend
            gewertet.
          </p>

          {message && <p className="error-message">{message}</p>}

          <div className="draw-preview" aria-hidden="true">
            <span>?</span><span>?</span><span>?</span><span>?</span>
          </div>

          <button className="primary-button draw-button" onClick={drawWeeklyCard}>
            Wochenkarte öffnen
          </button>

          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <div className="brand-line">
            <span className="alpha-badge">Ultimate Alpha</span>
            <h1>Bierbank Bingo</h1>
          </div>

          <p>
            KW {week}/{year} · gültig bis Samstag, 23:59 Uhr
          </p>
          <div className="user-line">
            {twitchAvatar ? (
              <img
                className="twitch-avatar"
                src={twitchAvatar}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="avatar-fallback">
                {twitchName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <strong>{twitchName}</strong>
            {canTriggerEvents && (
              <span className="role-badge">{isAdmin ? "Admin" : "Mod"}</span>
            )}
          </div>
        </div>

        <div className="header-actions">
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

          <div className="header-button-row">
            <button
              className="secondary-button compact"
              onClick={() => setShowRules((value) => !value)}
            >
              {showRules ? "Regeln schließen" : "Regeln"}
            </button>
            <button className="secondary-button compact" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {showRules && (
        <section className="rules-panel">
          <div className="section-heading">
            <span className="alpha-badge">Regeln</span>
            <h2>Bierbank spielt wie immer – das Bingo bleibt im Hintergrund.</h2>
          </div>

          <div className="rules-grid">
            <div>
              <strong>Keine automatischen Trigger</strong>
              <span>Nur der Bingo-Ersteller und freigeschaltete Mods lösen Felder aus.</span>
            </div>
            <div>
              <strong>Kein Backseat Gaming</strong>
              <span>Keine Spielzüge oder Aktionen verlangen, um Felder zu erfüllen.</span>
            </div>
            <div>
              <strong>Kein Betteln nach Support</strong>
              <span>Keine Subs, Spenden, Raids oder Sub-Bomben einfordern.</span>
            </div>
            <div>
              <strong>Fair bleiben</strong>
              <span>Missbrauch kann zum App-Ausschluss, zur Sperre oder zum Ban führen.</span>
            </div>
          </div>
        </section>
      )}

      {justDrawn && (
        <section className={`draw-result ${hasLegendaryField ? "legendary-result" : ""}`}>
          <strong>
            {hasLegendaryField
              ? "Legendary-Karte gezogen!"
              : "Deine neue Wochenkarte ist bereit!"}
          </strong>
          <span>
            {hasLegendaryField
              ? "Auf deiner Karte befindet sich ein seltenes Legendary-Feld."
              : "Ab jetzt können passende Stream-Ereignisse gesammelt werden."}
          </span>
        </section>
      )}

      {message && (
        <section className="status-message">
          <p>{message}</p>
        </section>
      )}

      <section className="grid">
        {card.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className={`tile xp-${RARITY[event.rarity].xp} ${
              completed.includes(index) ? "done" : ""
            } ${justDrawn ? "tile-reveal" : ""}`}
            style={justDrawn ? { animationDelay: `${index * 65}ms` } : undefined}
          >
            <span>{event.text}</span>
            <b>{RARITY[event.rarity].xp} XP</b>
          </div>
        ))}
      </section>

      {canTriggerEvents && (
        <section className="admin-panel">
          <div className="admin-heading">
            <div>
              <span className="alpha-badge">{isAdmin ? "Admin" : "Mod"}</span>
              <h2>Event-Trigger</h2>
            </div>
            <p>
              Dieser Bereich ist ausschließlich für freigeschaltete Twitch-
              Accounts sichtbar. Treffer werden dauerhaft gespeichert.
            </p>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search">
              <label htmlFor="admin-search">Bingofeld suchen</label>
              <input
                id="admin-search"
                type="search"
                placeholder="z. B. Gleiter, Sub-Bombe oder Pan-Kill"
                value={adminSearch}
                onChange={(event) => setAdminSearch(event.target.value)}
              />
              <span>{filteredAdminEvents.length} Treffer</span>
            </div>

            <div className="admin-sort">
              <label htmlFor="admin-sort">Sortierung</label>
              <select
                id="admin-sort"
                value={adminSort}
                onChange={(event) => setAdminSort(event.target.value)}
              >
                <option value="xp-desc">XP: hoch nach niedrig</option>
                <option value="xp-asc">XP: niedrig nach hoch</option>
                <option value="alpha">Alphabetisch</option>
              </select>
            </div>

            <button className="undo-button" onClick={undoLastTrigger}>
              Letzten Trigger rückgängig
            </button>
          </div>

          {filteredAdminEvents.length === 0 ? (
            <p className="no-results">Kein passendes Bingofeld gefunden.</p>
          ) : (
          <div className="admin-grid">
            {filteredAdminEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => triggerEvent(event.id)}
                className="admin-trigger"
              >
                <span>{event.text}</span>
                <small>{RARITY[event.rarity].xp} XP</small>
              </button>
            ))}
          </div>
          )}

          <div className="event-log">
            <h3>Eventlog</h3>

            {eventLog.length === 0 ? (
              <p>Noch keine Events ausgelöst.</p>
            ) : (
              eventLog.map((event, index) => (
                <div
                  key={`${event.time}-${event.text}-${index}`}
                  className={event.hit ? "event-hit" : "event-undo"}
                >
                  {event.time} · {event.text}{" "}
                  {event.hit ? "✓" : "— nicht auf dieser Karte"}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}