// Global username registry stored in localStorage
// Maps lowercase username -> principalId

const REGISTRY_KEY = "nexus_username_registry";

function getRegistry(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || "{}");
  } catch {
    return {};
  }
}

export function isUsernameTaken(username: string, excludeId?: string): boolean {
  const registry = getRegistry();
  const ownerId = registry[username.toLowerCase()];
  return ownerId !== undefined && ownerId !== excludeId;
}

export function registerUsername(username: string, principalId: string): void {
  const registry = getRegistry();
  registry[username.toLowerCase()] = principalId;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

export function releaseUsername(username: string): void {
  const registry = getRegistry();
  delete registry[username.toLowerCase()];
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

export function getAvatarForGender(
  gender: "he" | "she" | "binary",
  seed: string,
): string {
  switch (gender) {
    case "he":
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&gender=male`;
    case "she":
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&gender=female`;
    case "binary":
      return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
  }
}
