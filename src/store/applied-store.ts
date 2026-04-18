import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ContactChannel = "email" | "linkedin"

export interface ContactEntry {
  emailedAt?: string
  linkedInAt?: string
}

interface AppliedState {
  applied: Record<string, ContactEntry>
  clear: () => void
  importBulk: (entries: Record<string, ContactEntry>) => void
  mark: (id: string, channel: ContactChannel, timestamp?: string) => void
  toggle: (id: string, channel: ContactChannel) => void
  unmark: (id: string, channel: ContactChannel) => void
}

const CHANNEL_FIELD = {
  email: "emailedAt",
  linkedin: "linkedInAt",
} as const satisfies Record<ContactChannel, keyof ContactEntry>

function pruneEmpty(
  map: Record<string, ContactEntry>,
  id: string,
  next: ContactEntry
): Record<string, ContactEntry> {
  const { [id]: _removed, ...rest } = map
  if (!(next.emailedAt || next.linkedInAt)) {
    return rest
  }
  return { ...rest, [id]: next }
}

export const useAppliedStore = create<AppliedState>()(
  persist(
    (set) => ({
      applied: {},

      toggle: (id, channel) =>
        set((s) => {
          const field = CHANNEL_FIELD[channel]
          const current = s.applied[id] ?? {}
          const next: ContactEntry = { ...current }
          if (next[field]) {
            delete next[field]
          } else {
            next[field] = new Date().toISOString()
          }
          return { applied: pruneEmpty(s.applied, id, next) }
        }),

      mark: (id, channel, timestamp) =>
        set((s) => {
          const field = CHANNEL_FIELD[channel]
          const current = s.applied[id] ?? {}
          const next: ContactEntry = {
            ...current,
            [field]: timestamp ?? new Date().toISOString(),
          }
          return { applied: pruneEmpty(s.applied, id, next) }
        }),

      unmark: (id, channel) =>
        set((s) => {
          const field = CHANNEL_FIELD[channel]
          const current = s.applied[id]
          if (!current) {
            return s
          }
          const next: ContactEntry = { ...current }
          delete next[field]
          return { applied: pruneEmpty(s.applied, id, next) }
        }),

      clear: () => set({ applied: {} }),

      importBulk: (entries) =>
        set((s) => {
          const merged = { ...s.applied }
          for (const [id, incoming] of Object.entries(entries)) {
            merged[id] = { ...merged[id], ...incoming }
          }
          return { applied: merged }
        }),
    }),
    {
      name: "lmia-tech-finder:applied:v1",
      partialize: (state) => ({ applied: state.applied }),
    }
  )
)
