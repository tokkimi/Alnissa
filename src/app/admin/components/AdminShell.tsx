"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "../../components/Icons";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export default function AdminShell({
  children,
  userName,
  badges,
}: {
  children: React.ReactNode;
  userName: string;
  badges: { messages: number; volunteers: number; commerces: number };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { label: "Tableau de bord", href: "/admin", icon: "dashboard" },
    { label: "Dons", href: "/admin/dons", icon: "euro" },
    { label: "Donateurs", href: "/admin/donateurs", icon: "users" },
    { label: "Messagerie", href: "/admin/messages", icon: "inbox", badge: badges.messages },
    { label: "Bénévoles", href: "/admin/benevoles", icon: "handHeart", badge: badges.volunteers },
    { label: "Commerçants", href: "/admin/commerces", icon: "box", badge: badges.commerces },
    { label: "Campagnes", href: "/admin/campagnes", icon: "megaphone" },
    { label: "Planning", href: "/admin/evenements", icon: "calendar" },
    { label: "Paramètres", href: "/admin/parametres", icon: "settings" },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavList = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-white text-rose-700 shadow-sm"
              : "text-plum/75 hover:bg-white/60 hover:text-rose-700"
          }`}
        >
          <Icon name={item.icon} width={20} height={20} />
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="grid min-w-6 place-items-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
              {item.badge}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Sidebar desktop */}
      <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-72 flex-col p-5 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-3">
          <Image src="/logo.png" alt="Al Nissa" width={44} height={44} className="h-11 w-11 rounded-full ring-1 ring-white/60" />
          <div>
            <p className="font-display text-xl leading-none tracking-[0.14em] text-plum">AL NISSA</p>
            <p className="text-xs text-muted">Administration</p>
          </div>
        </Link>
        <NavList />
        <div className="mt-4 border-t border-white/50 pt-4">
          <div className="mb-2 flex items-center gap-3 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-plum">{userName}</p>
              <Link href="/" className="text-xs text-rose-600 hover:underline">
                Voir le site →
              </Link>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-plum/75 transition hover:bg-white/60 hover:text-rose-700"
          >
            <Icon name="logout" width={20} height={20} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Topbar mobile */}
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-plum"
        >
          <Icon name="menu" width={22} height={22} />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Al Nissa" width={32} height={32} className="h-8 w-8 rounded-full" />
          <span className="font-display text-lg tracking-[0.14em] text-plum">AL NISSA</span>
        </div>
        <button onClick={logout} aria-label="Déconnexion" className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-plum">
          <Icon name="logout" width={20} height={20} />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-plum/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="glass absolute inset-y-0 left-0 flex w-72 flex-col p-5 animate-fade-up">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Al Nissa" width={40} height={40} className="h-10 w-10 rounded-full" />
                <span className="font-display text-lg tracking-[0.14em] text-plum">AL NISSA</span>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-plum">
                <Icon name="close" width={18} height={18} />
              </button>
            </div>
            <NavList />
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border-t border-white/50 px-4 pt-4 text-sm font-medium text-plum/75"
            >
              <Icon name="logout" width={20} height={20} />
              Se déconnecter
            </button>
          </aside>
        </div>
      )}

      {/* Contenu */}
      <div className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
