import { create } from 'zustand'

/**
 * Zoom levels:
 *  'universe' — all galaxy cores visible
 *  'galaxy'   — inside one galaxy, planets orbit
 *  'planet'   — close-up of one planet, overlay open
 */
export const useUniverseStore = create((set, get) => ({
  level: 'universe',
  activeGalaxyId: null,
  activePlanetId: null,
  hoveredId: null,
  overlayOpen: false,
  hologramText: 'Welcome to Alireza\'s Universe. Click any galaxy to explore.',

  setLevel: (level) => set({ level }),

  enterGalaxy: (galaxyId, hologramText) =>
    set({
      level: 'galaxy',
      activeGalaxyId: galaxyId,
      activePlanetId: null,
      overlayOpen: false,
      hologramText: hologramText ?? 'Exploring galaxy...',
    }),

  enterPlanet: (planetId, hologramText) =>
    set({
      level: 'planet',
      activePlanetId: planetId,
      overlayOpen: true,
      hologramText: hologramText ?? 'Loading planet data...',
    }),

  goBack: () => {
    const { level } = get()
    if (level === 'planet') {
      set({ level: 'galaxy', activePlanetId: null, overlayOpen: false,
            hologramText: 'Back in the galaxy. Click a planet to explore.' })
    } else if (level === 'galaxy') {
      set({ level: 'universe', activeGalaxyId: null, activePlanetId: null,
            hologramText: 'Back to the universe. Click any galaxy to explore.' })
    }
  },

  setHovered: (id, text) =>
    set({ hoveredId: id, hologramText: text ?? get().hologramText }),

  clearHovered: () =>
    set({ hoveredId: null }),

  closeOverlay: () =>
    set({ overlayOpen: false }),
}))
