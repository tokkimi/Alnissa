import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  isLoggedIn: boolean;
}

const rawSecret = process.env.SESSION_SECRET || "";
// iron-session exige un secret d'au moins 32 caractères.
const password =
  rawSecret.length >= 32
    ? rawSecret
    : (rawSecret + "al-nissa-fallback-secret-please-configure-session-secret").slice(
        0,
        64,
      );

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "alnissa_admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  return session;
}

/** Renvoie la session si l'utilisateur est connecté, sinon null. */
export async function requireAuth(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) return null;
  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    isLoggedIn: true,
  };
}
