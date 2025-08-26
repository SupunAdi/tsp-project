export type ProfileUser = {
  id: number | string;
  name: string;
  email: string;
  email_verified_at: string | null;
};

const KEY = "mock_profile_user";
const defaultUser: ProfileUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  email_verified_at: null
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function read(): ProfileUser {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(raw) as ProfileUser;
  } catch {
    localStorage.setItem(KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
}
function write(u: ProfileUser) { localStorage.setItem(KEY, JSON.stringify(u)); }

export async function getMe(): Promise<ProfileUser> {
  await delay(250);
  return read();
}

export async function updateProfile(input: { name: string; email: string })
: Promise<{ ok: true; user: ProfileUser } | { ok: false; errors: Record<string,string> }> {
  await delay(500);
  const errors: Record<string,string> = {};
  if (!input.name || input.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Enter a valid email.";
  if (Object.keys(errors).length) return { ok: false, errors };
  const updated = { ...read(), name: input.name.trim(), email: input.email.trim() };
  write(updated);
  return { ok: true, user: updated };
}

export async function resendVerification(): Promise<{ ok: true }> {
  await delay(300);
  localStorage.setItem("mock_verification_sent_at", String(Date.now()));
  return { ok: true };
}

export async function deleteUser(password: string)
: Promise<{ ok: true } | { ok: false; errors: Record<string,string> }> {
  await delay(500);
  if (!password || password.length < 4) {
    return { ok: false, errors: { password: "Password is required (demo: any 4+ chars)." } };
  }
  localStorage.removeItem(KEY);
  return { ok: true };
}
