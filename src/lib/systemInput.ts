export function parseSystemInput(value: unknown): { name: string } | null {
  if (typeof value !== "object" || value === null || !("name" in value)) return null;
  const { name } = value;
  if (typeof name !== "string") return null;

  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length > 500) return null;
  return { name: trimmedName };
}
