const LOCAL_STORAGE_PLAYER_ID_KEY = 'playerId'

const DEFAULT_PLAYER_ID = 'jason'

export function getPlayerId(): string {
  const stored = localStorage.getItem(LOCAL_STORAGE_PLAYER_ID_KEY)
  return stored
    ? stored
    : DEFAULT_PLAYER_ID
}

export function setPlayerId(id: string): void {
  localStorage.setItem(LOCAL_STORAGE_PLAYER_ID_KEY, id)
}
