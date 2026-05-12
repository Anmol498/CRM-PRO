/**
 * BookingDetails.tsx — Airport Code Label Patch
 * ─────────────────────────────────────────────────────────────────────────────
 * Apply these changes to: frontend/src/pages/BookingDetails.tsx
 *
 * WHAT CHANGES:
 *   1. Import `getAirportLabel` from the new utility.
 *   2. Add the `AirportCodeLabel` helper component (inline — no new file needed).
 *   3. Drop `<AirportCodeLabel code="DXB" />` below each airport code span
 *      in the Flight Details card (both segments[] and legacy flightFrom/flightTo).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 1 — Add this import near your other utility imports
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   import { getAirportLabel } from '@/utils/airportLookup';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 2 — Add the helper component (paste once, anywhere before your page component)
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface AirportCodeLabelProps {
  code: string | null | undefined;
}

/**
 * Renders "City, Country" below an airport code in the Flight Details card.
 * Matches the existing segment label style: text-[9px] font-bold text-slate-400 uppercase
 * Shows nothing if the code is empty or unknown.
 */
function AirportCodeLabel({ code }: AirportCodeLabelProps) {
  if (!code) return null;
  const label = getAirportLabel(code);
  if (!label) return null;

  return (
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
      {label}
    </span>
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 3 — Update the Flight Details card JSX  (approx. lines 545–600)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * BEFORE (departure side — typical pattern in your card):
 * ────────────────────────────────────────────────────────
 *
 *   <div className="flex flex-col items-start">
 *     <span className="text-2xl font-extrabold text-blue-700 uppercase">
 *       {segment.flightFrom}          ← or traveler.flightFrom for legacy
 *     </span>
 *     <span className="text-[9px] font-bold text-slate-400 uppercase">
 *       Departure
 *     </span>
 *   </div>
 *
 * AFTER:
 * ────────────────────────────────────────────────────────
 *
 *   <div className="flex flex-col items-start">
 *     <span className="text-2xl font-extrabold text-blue-700 uppercase">
 *       {segment.flightFrom}
 *     </span>
 *     <span className="text-[9px] font-bold text-slate-400 uppercase">
 *       Departure
 *     </span>
 *     {/* ✅ NEW: resolves code → "Dubai, UAE" */}
 *     <AirportCodeLabel code={segment.flightFrom} />
 *   </div>
 *
 * ──────────────────────────────────────────────────────
 * Same pattern for the destination side:
 * ──────────────────────────────────────────────────────
 *
 * BEFORE:
 *   <div className="flex flex-col items-end">
 *     <span className="text-2xl font-extrabold text-blue-700 uppercase">
 *       {segment.flightTo}
 *     </span>
 *     <span className="text-[9px] font-bold text-slate-400 uppercase">
 *       Destination
 *     </span>
 *   </div>
 *
 * AFTER:
 *   <div className="flex flex-col items-end">
 *     <span className="text-2xl font-extrabold text-blue-700 uppercase">
 *       {segment.flightTo}
 *     </span>
 *     <span className="text-[9px] font-bold text-slate-400 uppercase">
 *       Destination
 *     </span>
 *     {/* ✅ NEW */}
 *     <AirportCodeLabel code={segment.flightTo} />
 *   </div>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LEGACY SUPPORT — if traveler.flightFrom / traveler.flightTo is still used
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   {/* inside the legacy traveler card, same pattern: */}
 *   <AirportCodeLabel code={traveler.flightFrom} />
 *   <AirportCodeLabel code={traveler.flightTo} />
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VISUAL RESULT (matches screenshot design):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   DXB                         CLA
 *   DEPARTURE                   DESTINATION
 *   Dubai, UAE                  Comilla, Bangladesh   ← new line, same gray style
 *
 *   SFD                         THS
 *   DEPARTURE                   DESTINATION
 *   San Fernando De Apure, Venezuela    Sukhothai, Thailand
 */

// ─── Full self-contained example (copy this whole block if you prefer) ────────

/*
import { getAirportLabel } from '@/utils/airportLookup';

function AirportCodeLabel({ code }: { code?: string | null }) {
  if (!code) return null;
  const label = getAirportLabel(code);
  if (!label) return null;
  return (
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
      {label}
    </span>
  );
}

// Then inside your JSX wherever each leg is rendered:

<div className="flex flex-col items-start">
  <span className="text-2xl font-extrabold text-blue-700 uppercase">
    {segment.flightFrom}
  </span>
  <span className="text-[9px] font-bold text-slate-400 uppercase">Departure</span>
  <AirportCodeLabel code={segment.flightFrom} />
</div>

// Arrow / date pill stays as-is in the middle

<div className="flex flex-col items-end">
  <span className="text-2xl font-extrabold text-blue-700 uppercase">
    {segment.flightTo}
  </span>
  <span className="text-[9px] font-bold text-slate-400 uppercase">Destination</span>
  <AirportCodeLabel code={segment.flightTo} />
</div>
*/
