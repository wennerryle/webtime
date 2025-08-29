export const POCKETBASE_URL_KEY = "local:pocketbase_url";
export const POCKETBASE_USER = "local:pocketbase_user";
export const POCKETBASE_PASSWORD = "local:pocketbase_password";

export function getPocketbaseURL() {
  return storage.getItem(POCKETBASE_URL_KEY, {
    fallback: "http://127.0.0.1:8090/_",
  });
}

export function setPocketbaseURL(url: string) {
  return storage.setItem(POCKETBASE_URL_KEY, url);
}

export function getPocketbaseUser() {
  return storage.getItem<string>(POCKETBASE_USER);
}

export function setPocketbaseUsername(username: string) {
  return storage.setItem(POCKETBASE_USER, username);
}

export function getPocketbasePassword() {
  return storage.getItem<string>(POCKETBASE_PASSWORD);
}

export function setPocketbasePassword(password: string) {
  return storage.setItem(POCKETBASE_PASSWORD, password);
}

interface PocketBaseCredentials {
  username: string;
  password: string;
}

export async function getCredentials(): Promise<PocketBaseCredentials | null> {
  const [username, password] = await Promise.all([
    getPocketbaseUser(),
    getPocketbasePassword(),
  ]);

  if (username !== null && password !== null) {
    return {
      password,
      username,
    };
  } else {
    return null;
  }
}
