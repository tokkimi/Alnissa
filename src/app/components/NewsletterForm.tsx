"use client";

import { useState } from "react";
import { Icon } from "./Icons";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-rose-100">
        <Icon name="check" width={18} height={18} />
        Merci ! Vous êtes bien inscrit·e.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre e-mail"
        className="w-full rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/60"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="btn shrink-0 rounded-full bg-white px-5 py-2.5 font-semibold text-rose-700 hover:bg-rose-50"
      >
        {state === "loading" ? "…" : "S'inscrire"}
      </button>
    </form>
  );
}
