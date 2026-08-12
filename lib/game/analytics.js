/* ============================================================
   Analytics de producto (PRD §2) — Plausible, sin cookies.
   Eventos: game_start · setup_complete · turn_decision ·
   game_end · share_open · share_complete · seed_replay ·
   parlyx_activado · outbound_parlyx.
   track() jamás puede romper el juego: si el script no cargó
   (dev, adblock, sandbox) encola en window.plausible.q y sigue.
   ============================================================ */

export function track(evento, props) {
  try {
    if (typeof window === "undefined") return;
    const w = window;
    w.plausible =
      w.plausible ||
      function () {
        (w.plausible.q = w.plausible.q || []).push(arguments);
      };
    w.plausible(evento, props ? { props } : undefined);
  } catch {
    /* nunca interrumpe el juego */
  }
}
