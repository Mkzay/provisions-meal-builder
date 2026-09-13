type SessionLike = {
  user?: {
    ownerName?: string | null;
    name?: string | null;
  } | null;
} | null | undefined;

export function getSessionOwner(session: SessionLike): string | null {
  const owner = session?.user?.ownerName ?? session?.user?.name;
  const normalized = owner?.trim();
  return normalized || null;
}

export function pageBelongsToOwner(pageOwner: string | null | undefined, owner: string): boolean {
  const normalized = pageOwner?.trim();
  return Boolean(normalized) && normalized === owner;
}
