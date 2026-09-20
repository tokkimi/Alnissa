"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

export interface AddressValue {
  address: string;
  postalCode: string;
  city: string;
  lat: number | null;
  lng: number | null;
}

interface Feature {
  properties: { label: string; postcode?: string; city?: string; name?: string };
  geometry: { coordinates: [number, number] };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Commencez à taper votre adresse…",
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: AddressValue) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelected = useRef(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&autocomplete=1`,
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSuggestions(data.features || []);
        setOpen((data.features || []).length > 0);
        setActive(-1);
      } catch {
        // API indisponible : on garde la saisie libre.
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  function choose(f: Feature) {
    justSelected.current = true;
    const [lng, lat] = f.geometry.coordinates;
    onChange(f.properties.label);
    onSelect({
      address: f.properties.name || f.properties.label,
      postalCode: f.properties.postcode || "",
      city: f.properties.city || "",
      lat,
      lng,
    });
    setOpen(false);
    setSuggestions([]);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rose-400">
        <Icon name="mapPin" width={18} height={18} />
      </span>
      <input
        className="field pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">…</span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="glass-card absolute z-20 mt-1.5 max-h-64 w-full overflow-auto p-1.5"
        >
          {suggestions.map((f, i) => (
            <li key={i} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(f)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                  i === active ? "bg-rose-100" : "hover:bg-white/70"
                }`}
              >
                <Icon name="mapPin" width={16} height={16} className="mt-0.5 shrink-0 text-rose-500" />
                <span className="text-sm text-plum">{f.properties.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-muted">
        Suggestions d'adresses françaises. Vous pouvez aussi saisir votre adresse manuellement.
      </p>
    </div>
  );
}
