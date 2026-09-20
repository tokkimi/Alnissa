"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "./Icons";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Nos actions", href: "/nos-actions" },
  { label: "Commerçants", href: "/commerces" },
  { label: "Bénévolat", href: "/benevolat" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ brandName }: { brandName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <div
          className={`flex items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-300 ${
            scrolled ? "glass shadow-lg" : "bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-3" aria-label={brandName}>
            <Image
              src="/logo.png"
              alt={brandName}
              width={48}
              height={48}
              priority
              className="h-11 w-11 rounded-full ring-1 ring-white/60"
            />
            <span className="hidden font-display text-xl tracking-[0.18em] text-plum sm:block">
              AL NISSA
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white/70 text-rose-700"
                      : "text-plum/80 hover:bg-white/50 hover:text-rose-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/faire-un-don" className="btn btn-primary hidden sm:inline-flex">
              <Icon name="heart" width={18} height={18} />
              Faire un don
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/60 text-plum backdrop-blur md:hidden"
            >
              <Icon name="menu" width={22} height={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className="absolute inset-0 bg-plum/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="glass-card absolute right-3 left-3 top-3 overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt={brandName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-display text-lg tracking-[0.18em] text-plum">
                  AL NISSA
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-plum"
              >
                <Icon name="close" width={20} height={20} />
              </button>
            </div>
            <nav className="flex flex-col px-3 pb-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg text-plum transition hover:bg-white/70"
                >
                  {item.label}
                  <Icon name="chevronRight" width={18} height={18} className="text-rose-400" />
                </Link>
              ))}
              <Link href="/faire-un-don" className="btn btn-primary mx-1 mt-2">
                <Icon name="heart" width={18} height={18} />
                Faire un don
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
