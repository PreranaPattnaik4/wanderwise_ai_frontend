import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: "password" | "google";
};

type StoredUser = User & { passHash?: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (args: { name: string; email: string; password: string }) => Promise<User>;
  signIn: (args: { email: string; password: string }) => Promise<User>;
  signInWithProvider: (provider: "google") => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "ww_users";
const SESSION_KEY = "ww_session";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && (crypto.subtle as any).digest) {
      const data = new TextEncoder().encode(password);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {
    // fallthrough to simple hash
  }
  // Fallback non-cryptographic hash (for environments without SubtleCrypto)
  let h = 5381;
  for (let i = 0; i < password.length; i++) h = (h * 33) ^ password.charCodeAt(i);
  return (h >>> 0).toString(16);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      const uid = localStorage.getItem(SESSION_KEY);
      if (!uid) {
        setLoading(false);
        return;
      }
      const users = readUsers();
      const u = users.find((x) => x.id === uid);
      setUser(u ? { id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl, provider: u.provider } : null);
      setLoading(false);
    };
    init();
  }, []);

  const signUp = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const users = readUsers();
    const e = normalizeEmail(email);
    if (users.some((u) => normalizeEmail(u.email) === e)) {
      throw new Error("An account with this email already exists");
    }
    const passHash = await hashPassword(password);
    const id = (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newUser: StoredUser = { id, name: name.trim(), email: e, passHash, provider: "password" };
    const all = [...users, newUser];
    writeUsers(all);
    setSession(id);
    const publicUser: User = { id, name: newUser.name, email: newUser.email, avatarUrl: newUser.avatarUrl, provider: newUser.provider };
    setUser(publicUser);
    return publicUser;
  }, []);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const users = readUsers();
    const e = normalizeEmail(email);
    const existing = users.find((u) => normalizeEmail(u.email) === e && (u.provider === "password" || u.passHash));
    if (!existing) throw new Error("Account not found");
    const passHash = await hashPassword(password);
    if (!existing.passHash || existing.passHash !== passHash) throw new Error("Invalid credentials");
    setSession(existing.id);
    const publicUser: User = { id: existing.id, name: existing.name, email: existing.email, avatarUrl: existing.avatarUrl, provider: existing.provider };
    setUser(publicUser);
    return publicUser;
  }, []);

  const signInWithProvider = useCallback(async (provider: "google") => {
    const users = readUsers();
    const demoEmail = provider === "google" ? "google_user@example.com" : "user@example.com";
    const e = normalizeEmail(demoEmail);
    let existing = users.find((u) => normalizeEmail(u.email) === e);
    if (!existing) {
      const id = (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      existing = { id, name: "Google User", email: e, provider } as StoredUser;
      writeUsers([...users, existing]);
    }
    setSession(existing.id);
    const publicUser: User = { id: existing.id, name: existing.name, email: existing.email, avatarUrl: existing.avatarUrl, provider: existing.provider };
    setUser(publicUser);
    return publicUser;
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signUp, signIn, signInWithProvider, signOut }),
    [user, loading, signUp, signIn, signInWithProvider, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getInitials(nameOrEmail: string) {
  const src = nameOrEmail.trim();
  if (!src) return "?";
  if (src.includes("@")) return src[0]?.toUpperCase() ?? "?";
  const parts = src.split(/\s+/).filter(Boolean);
  if (!parts.length) return src[0]?.toUpperCase() ?? "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}
