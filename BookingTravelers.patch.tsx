/**
 * BookingTravelers.tsx — Airport Code Live Hint Patch
 * ─────────────────────────────────────────────────────────────────────────────
 * Apply these changes to: frontend/src/pages/BookingTravelers.tsx
 *
 * WHAT CHANGES:
 *   1. Import `getAirportInfo` from the utility.
 *   2. Add the `AirportHint` component (inline — no new file needed).
 *   3. Drop `<AirportHint code={watchedValue} />` below each airport input field.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 1 — Add import
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   import { getAirportInfo } from '@/utils/airportLookup';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 2 — Add the AirportHint component (paste before your page component)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getAirportInfo } from '@/utils/airportLookup';

interface AirportHintProps {
  /** The raw value from the react-hook-form input (e.g. "DXB", "dxb", "DX", "") */
  code: string | undefined;
}

/**
 * Live hint shown below a "Flight From" / "Flight To" input as the user types.
 *
 * Behaviour:
 *   - Empty / < 3 chars  → renders nothing (no flicker while typing)
 *   - Exactly 3 chars, valid IATA code  → green "✓ Dubai, UAE"
 *   - Exactly 3 chars, unknown code     → red "✗ Unknown airport code"
 *   - > 3 chars → same unknown treatment (IATA codes are always 3 letters)
 */
export function AirportHint({ code }: AirportHintProps) {
  const trimmed = (code ?? '').trim().toUpperCase();

  // Don't show anything until user has typed at least 3 chars
  if (trimmed.length < 3) return null;

  const info = getAirportInfo(trimmed);

  if (info) {
    const label = info.country ? `${info.city}, ${info.country}` : info.city;
    return (
      <p className="mt-1 text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
        <span aria-hidden="true">✓</span>
        <span>{label}</span>
      </p>
    );
  }

  // Unknown code — only show error when exactly 3 chars so we don't
  // show "Unknown" on partial input like "DX" (already gated above,
  // but extra guard for > 3 chars edge case).
  return (
    <p className="mt-1 text-[10px] font-semibold text-red-500 flex items-center gap-1">
      <span aria-hidden="true">✗</span>
      <span>Unknown airport code</span>
    </p>
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STEP 3 — Wire it up in your form JSX
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * react-hook-form's `watch()` is the key — it gives us the live input value
 * on every keystroke without any extra useState needed.
 *
 * INSIDE your form component, add watches for each airport field:
 * ────────────────────────────────────────────────────────────────
 *
 *   const { register, watch, handleSubmit, ... } = useForm({ ... });
 *
 *   // Add one watch per leg. For dynamic segment arrays use watchedSegments.
 *   // Example for a fixed 3-leg form (adapt field names to match yours):
 *   const leg1From   = watch('segments.0.flightFrom');
 *   const leg1To     = watch('segments.0.flightTo');
 *   const leg2From   = watch('segments.1.flightFrom');
 *   const leg2To     = watch('segments.1.flightTo');
 *   // ...etc, or use `watch('segments')` and index into it
 *
 *
 * BEFORE (a single flight-from input block):
 * ─────────────────────────────────────────
 *
 *   <div>
 *     <label className="text-[9px] font-bold text-slate-500 uppercase">
 *       ✈ Flight From *
 *     </label>
 *     <input
 *       {...register('segments.0.flightFrom')}
 *       className="w-full border rounded px-2 py-1 uppercase text-sm"
 *       placeholder="e.g. DXB"
 *     />
 *   </div>
 *
 *
 * AFTER:
 * ──────
 *
 *   <div>
 *     <label className="text-[9px] font-bold text-slate-500 uppercase">
 *       ✈ Flight From *
 *     </label>
 *     <input
 *       {...register('segments.0.flightFrom')}
 *       className="w-full border rounded px-2 py-1 uppercase text-sm"
 *       placeholder="e.g. DXB"
 *     />
 *     {/* ✅ NEW — live airport name hint */}
 *     <AirportHint code={leg1From} />
 *   </div>
 *
 *
 * Same pattern for Flight To:
 * ──────────────────────────
 *
 *   <div>
 *     <label className="text-[9px] font-bold text-slate-500 uppercase">
 *       ✈ Flight To *
 *     </label>
 *     <input
 *       {...register('segments.0.flightTo')}
 *       className="w-full border rounded px-2 py-1 uppercase text-sm"
 *       placeholder="e.g. CLA"
 *     />
 *     {/* ✅ NEW */}
 *     <AirportHint code={leg1To} />
 *   </div>
 *
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DYNAMIC LEGS (if you use useFieldArray for multi-city)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   const { fields } = useFieldArray({ control, name: 'segments' });
 *   const watchedSegments = watch('segments');   // array of current values
 *
 *   {fields.map((field, index) => (
 *     <div key={field.id} className="...">
 *
 *       {/* Flight From */}
 *       <div>
 *         <input
 *           {...register(`segments.${index}.flightFrom`)}
 *           className="... uppercase"
 *         />
 *         <AirportHint code={watchedSegments?.[index]?.flightFrom} />
 *       </div>
 *
 *       {/* Flight To */}
 *       <div>
 *         <input
 *           {...register(`segments.${index}.flightTo`)}
 *           className="... uppercase"
 *         />
 *         <AirportHint code={watchedSegments?.[index]?.flightTo} />
 *       </div>
 *
 *     </div>
 *   ))}
 *
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VISUAL RESULT:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   ✈ FLIGHT FROM *          ✈ FLIGHT TO *
 *  ┌─────────────┐          ┌─────────────┐
 *  │  DXB        │          │  CLA        │
 *  └─────────────┘          └─────────────┘
 *  ✓ Dubai, UAE             ✓ Comilla, Bangladesh    ← green when valid
 *
 *   ✈ FLIGHT FROM *
 *  ┌─────────────┐
 *  │  XYZ        │
 *  └─────────────┘
 *  ✗ Unknown airport code                           ← red when invalid
 *
 *  (nothing shown while typing 1–2 chars — no flickering)
 */
