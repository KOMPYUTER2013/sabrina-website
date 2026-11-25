import { useEffect, useState } from "react";
import { defaultContent } from "./site-content.js";

const navItems = [
  ["about", "#about"],
  ["services", "#services"],
  ["why", "#why"],
  ["path", "#path"],
  ["plan", "#plan"],
  ["typing", "#type"],
  ["faq", "#faq"],
  ["contact", "#contact"],
];

function Card({ children, className = "" }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

function TypingTest({ content }) {
  const [value, setValue] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [result, setResult] = useState("");
  const complete = value.length >= content.sample.length;

  function handleChange(event) {
    const nextValue = event.target.value.slice(0, content.sample.length);
    if (startedAt === null && nextValue.length > 0) {
      setStartedAt(Date.now());
    }
    setValue(nextValue);

    if (nextValue.length === content.sample.length) {
      const elapsedSeconds = Math.max((Date.now() - (startedAt ?? Date.now())) / 1000, 1);
      const correct = [...content.sample].reduce(
        (total, character, index) =>
          total + Number(nextValue[index] === character),
        0,
      );
      const wordsPerMinute = Math.round(
        (content.sample.length / 5 / elapsedSeconds) * 60,
      );
      setResult(
        `Tezlik: ${wordsPerMinute} soʻz/daqiqa, aniqlik: ${Math.round(
          (correct / content.sample.length) * 100,
        )}%. ${content.resultPrompt}`,
      );
    } else {
      setResult("");
    }
  }

  function reset() {
    setValue("");
    setStartedAt(null);
    setResult("");
  }

  return (
    <section id="type">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <Card>
        <p id="sample" className="sample" aria-label="Yoziladigan matn">
          {[...content.sample].map((character, index) => {
            const state =
              index >= value.length
                ? ""
                : value[index] === character
                  ? "ok"
                  : "bad";
            return (
              <span className={state} key={`${character}-${index}`}>
                {character}
              </span>
            );
          })}
        </p>
        <textarea
          id="ti"
          rows="2"
          placeholder={content.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label={content.placeholder}
          value={value}
          onChange={handleChange}
          disabled={complete}
        />
        <p role="status" className="res" aria-live="polite">
          {result}
        </p>
        <button className="btn ghost" type="button" onClick={reset}>
          {content.reset}
        </button>
      </Card>
    </section>
  );
}

function WorkPlan({ content }) {
  return (
    <section id="plan">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.title}</h2>
      <div className="stats plan-stats">
        {content.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <a
        className="card plan-pdf-link"
        href={content.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ish rejani PDF hujjatda yangi oynada ochish"
      >
        <span className="plan-pdf-icon" aria-hidden="true">
          📄
        </span>
        <span className="plan-pdf-copy">
          <strong>{content.pdfTitle}</strong>
          <span>{content.pdfDescription}</span>
        </span>
        <span className="plan-pdf-action">{content.pdfAction}</span>
      </a>
    </section>
  );
}

function ContactForm({ content }) {
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setIsSending(true);
    setHasError(false);
    setIsSent(false);
    setStatus(content.sending);

    try {
      const response = await fetch("/.netlify/functions/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Xabar yuborilmadi.");
      }

      form.reset();
      setIsSent(true);
      setStatus(content.sent);
    } catch {
      setIsSent(false);
      setHasError(true);
      setStatus(content.failed);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="card contact-form" onSubmit={handleSubmit}>
      <h3>{content.formTitle}</h3>
      <label className="sr-only" htmlFor="name">
        Ismingiz
      </label>
      <input
        id="name"
        name="name"
        placeholder={content.namePlaceholder}
        required
        maxLength="60"
        autoComplete="name"
      />
      <label className="sr-only" htmlFor="phone">
        Telefon raqamingiz
      </label>
      <input
        id="phone"
        name="phone"
        placeholder={content.phonePlaceholder}
        required
        maxLength="30"
        type="tel"
        autoComplete="tel"
      />
      <label className="sr-only" htmlFor="topic">
        Murojaat mavzusi
      </label>
      <select id="topic" name="topic" defaultValue={content.topicOptions[0]}>
        {content.topicOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="message">
        Savolingiz
      </label>
      <textarea
        id="message"
        name="message"
        placeholder={content.messagePlaceholder}
        rows="3"
        maxLength="800"
      />
      <input
        className="honeypot"
        name="website"
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />
      <button className="btn" type="submit" disabled={isSending}>
        {isSending ? content.sending : content.submitButton}
      </button>
      <p id="st" role="status" aria-live="polite">
        {status}
        {hasError && (
          <>
            {" "}
            <a
              href={content.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.botLinkText}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/.netlify/functions/content")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sayt matnlarini olishda HTTP ${response.status} xatosi.`);
        }
        return response.json();
      })
      .then((value) => {
        if (active) setContent(value);
      })
      .catch((error) => {
        console.error("Sayt matnlarini yangilab boʻlmadi:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let visitorId;
    try {
      visitorId = localStorage.getItem("site-visitor-id");
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("site-visitor-id", visitorId);
      }
    } catch (error) {
      console.error("Tashrif ID’sini saqlab boʻlmadi:", error);
      visitorId = crypto.randomUUID();
    }

    const heartbeat = async () => {
      try {
        const response = await fetch("/.netlify/functions/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });
        if (!response.ok) {
          throw new Error(`Tashrifni qayd etishda HTTP ${response.status} xatosi.`);
        }
      } catch (error) {
        console.error("Tashrifni qayd etib boʻlmadi:", error);
      }
    };

    heartbeat();
    const interval = window.setInterval(heartbeat, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loader" role="status" aria-label="Yuklanmoqda">
          <span className="loader-spinner" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span
                key={index}
                style={{
                  "--i": index,
                  opacity: (index + 1) / 12,
                }}
              />
            ))}
          </span>
        </div>
      )}
      <nav aria-label="Asosiy navigatsiya">
        <div className="wrap nav-content">
          <a className="brand" href="#top">
            {content.brand}
          </a>
          {navItems.map(([, href], index) => (
            <a href={href} key={href}>
              {content.nav[index]}
            </a>
          ))}
        </div>
      </nav>

      <main className="wrap" id="top">
        <header className="hero">
          <span className="tag">{content.hero.badge}</span>
          <div className="keys" aria-hidden="true">
            {"SABRINA".split("").map((letter, index) => (
              <span className="key" style={{ "--i": index }} key={index}>
                {letter}
              </span>
            ))}
          </div>
          <h1>{content.hero.title}</h1>
          <p className="lead">{content.hero.description}</p>
          <div className="btns">
            <a className="btn" href="#contact">
              {content.hero.primaryButton}
            </a>
            <a className="btn ghost" href="#path">
              {content.hero.secondaryButton}
            </a>
          </div>
        </header>

        <section id="about" className="about">
          <p className="eyebrow">{content.about.eyebrow}</p>
          <h2>{content.about.title}</h2>
          <p>{content.about.description}</p>
          <div className="stats">
            {content.about.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services">
          <p className="eyebrow">{content.services.eyebrow}</p>
          <h2>{content.services.title}</h2>
          <div className="grid">
            {content.services.items.map((item) => (
              <Card key={item.title}>
                <div className="ico">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="why">
          <p className="eyebrow">{content.why.eyebrow}</p>
          <h2>{content.why.title}</h2>
          <div className="grid">
            {content.why.items.map((item) => (
              <Card key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="path">
          <p className="eyebrow">{content.path.eyebrow}</p>
          <h2>{content.path.title}</h2>
          <div className="grid">
            {content.path.items.map((item) => (
              <Card key={item.date}>
                <div className="meta">{item.date}</div>
                <h3>
                  {item.title}
                  {item.current && <span className="live">{item.current}</span>}
                </h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <WorkPlan content={content.plan} />

        <TypingTest content={content.typing} />

        <section id="faq">
          <p className="eyebrow">{content.faq.eyebrow}</p>
          <h2>{content.faq.title}</h2>
          {content.faq.items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>

        <section id="contact">
          <p className="eyebrow">{content.contact.eyebrow}</p>
          <h2>{content.contact.title}</h2>
          <div className="grid">
            <Card>
              <h3>{content.contact.locationTitle}</h3>
              <p>{content.contact.locationDescription}</p>
              <p className="telegram-link">
                <a
                  className="btn ghost"
                  href={content.contact.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.contact.telegramButton}
                </a>
              </p>
            </Card>
            <ContactForm content={content.contact} />
          </div>
        </section>

        <footer>{content.footer}</footer>
      </main>
    </>
  );
}
