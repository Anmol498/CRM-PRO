# DATABASE SCHEMA CLEANUP — Discovery Questions
## Answer every question before touching a single field or index.
## This protects legacy data and ensures zero downtime.

---

## CONTEXT — What we are doing and why

From the Atlas screenshots and UI review, these problems are visible:

**Bookings collection** (614 documents):
- `travelDate`, `returnDate`, `flightFrom`, `flightTo`, `tripType` — stored as
  flat fields BUT will be moved into a `segments` array (already exists, empty)
- `amount` and `totalAmount` both exist — appear to hold same value
- `includesFlight`, `includesAdditionalServices`, `pricePerTicket` — may be redundant
- `contact.email` — nested inside contact object, needs removal

**Passengers collection** (115 documents):
- `arrivalTime`, `returnArrivalTime`, `returnDate` — always empty strings
- `departureTime`, `returnDepartureTime`, `country`, `flightFrom`, `flightTo`
  — duplicated from booking, will move to booking table display only
- `tripType` — duplicated from booking

**PrimaryContacts collection** (614 documents):
- `contactEmail` — always null in screenshots

**The risk:** 614 bookings + 115 passengers are LIVE data.
Wrong migration = data loss. Wrong index removal = slow queries.
This file gets every answer needed to do it safely.

---

## SECTION 1 — CODEBASE: Booking Model & Controller

### 1. Show the complete Booking Mongoose schema
File: `src/models/Booking.ts`
Show every field definition, every index, every virtual.

### 2. Show the complete `segments` array subdocument schema
What fields does each segment object contain?
Is there a SegmentSchema defined? Show it.

### 3. For these booking fields — show every place in the codebase they are READ:
Search across ALL files (controllers, routes, frontend) for each:
- `travelDate`
- `returnDate`
- `flightFrom`
- `flightTo`
- `tripType`
- `amount`
- `totalAmount`
- `includesFlight`
- `includesAdditionalServices`
- `pricePerTicket`

Format:
```
Field: travelDate
  - src/controllers/bookingController.ts line 221 (getBookings filter)
  - src/models/Booking.ts line 45 (schema definition)
  - frontend/src/components/BookingForm.tsx line 88 (form input)
```

### 4. For these booking fields — show every place they are WRITTEN:
Same fields as question 3. Show every `req.body.travelDate`, `.save()`, `.create()`, `findByIdAndUpdate` that sets them.

### 5. Show the complete `createBooking` handler
Specifically: what fields from `req.body` are saved to the booking document?
Does it populate `segments` on create? Does it set `travelDate` / `flightFrom` etc?

### 6. Show the `updateBooking` (PUT) handler
Same question — which fields does it update? Does it handle `segments`?

### 7. Is there a `getBookings` filter that uses `travelDate` as a query field?
Show the exact MongoDB query. Is there an index on `travelDate`?
If we remove `travelDate` from the schema and it's in a filter — queries break.

### 8. Is `travelDate` used in any sort operation?
Show any `.sort({ travelDate: ... })` or similar.

### 9. Show the complete index list for the Booking collection
Run in Atlas Shell or show from schema:
```javascript
db.bookings.getIndexes()
```
We need to know which indexes reference `travelDate`, `flightFrom`, `tripType`
before removing those fields — indexes must be updated too.

### 10. What does `amount` vs `totalAmount` represent?
- Is `amount` = the initial estimated amount entered by agent?
- Is `totalAmount` = sum of actual payments received?
- Or are they the same thing stored twice?
Show where each is set in the createBooking and updateBooking handlers.

### 11. What is `estimatedCost` vs `actualCosts` vs `amount` vs `totalAmount`?
From the Atlas screenshot, a booking has:
- `amount: 50000`
- `totalAmount: 50000`
- `estimatedCosts: Array(3)` (with individual cost items)
- `actualCosts: Array(3)` (with individual cost items)
Show the schema definition for `estimatedCosts` and `actualCosts`.
What fields does each cost item have?
How is `amount` currently calculated — is it the sum of `estimatedCosts`?

### 12. Show where `pricePerTicket` is read or written
Is it displayed in the frontend? Is it used in any calculation?

### 13. Show where `includesFlight` and `includesAdditionalServices` are read
Are they used as filter conditions? Are they displayed in the UI?
The screenshot shows `includesFlight: true` and `includesAdditionalServices: false`
in some documents — so some data exists. Confirm whether removing them
would break any frontend filter or display.

---

## SECTION 2 — CODEBASE: Passenger Model & Controller

### 14. Show the complete Passenger Mongoose schema
File: `src/models/Passenger.ts`
Every field, every index.

### 15. For each field proposed for removal — confirm it is always empty:
Run these queries in Atlas Shell and show the count of non-empty values:

```javascript
// How many passengers have non-empty arrivalTime?
db.passengers.countDocuments({ arrivalTime: { $nin: ["", null] } })

// How many have non-empty returnArrivalTime?
db.passengers.countDocuments({ returnArrivalTime: { $nin: ["", null] } })

// How many have non-empty returnDate?
db.passengers.countDocuments({ returnDate: { $nin: ["", null] } })

// How many have non-empty departureTime?
db.passengers.countDocuments({ departureTime: { $nin: ["", null] } })

// How many have non-empty returnDepartureTime?
db.passengers.countDocuments({ returnDepartureTime: { $nin: ["", null] } })

// How many have non-empty country?
db.passengers.countDocuments({ country: { $nin: ["", null] } })

// How many have non-empty flightFrom?
db.passengers.countDocuments({ flightFrom: { $nin: ["", null] } })

// How many have non-empty flightTo?
db.passengers.countDocuments({ flightTo: { $nin: ["", null] } })

// How many have non-empty tripType?
db.passengers.countDocuments({ tripType: { $nin: ["", null] } })
```

Show the number returned for each. If ANY count > 0 — that field has data
and CANNOT be removed without migration or backup.

### 16. Show the `addPassengers` handler completely
What fields does it accept from `req.body`?
Does it currently save `arrivalTime`, `returnDate`, `flightFrom` etc?

### 17. Show the `updatePassengers` handler completely
Same question.

### 18. Show the frontend passenger form
File: likely `frontend/src/components/PassengerForm.tsx` or similar
Which fields does the form collect and send to the API?
If the form still sends `arrivalTime` — removing it from schema causes silent data loss.

### 19. Show the `getBookingById` handler
Does it populate passengers? What fields does it return?
Does the frontend display any of the passenger fields being removed?

### 20. Show the Traveler Details section of the UI (frontend component)
Which passenger fields are displayed in the booking detail view?
From Image 7, the Travelers section shows:
- Flight Details (Destination, flightFrom→flightTo, TripType)
- Passenger name, phone, DOB

If `flightFrom`, `flightTo`, `tripType` are currently read from the passenger
document for display — removing them breaks the UI unless we read from
the booking's segments instead.

### 21. Is there any analytics or report that groups/filters by passenger fields?
Search for any aggregation pipeline that uses:
`$match: { 'passengers.country': ... }` or similar.

---

## SECTION 3 — CODEBASE: PrimaryContact Model

### 22. Show the complete PrimaryContact Mongoose schema
File: `src/models/PrimaryContact.ts`

### 23. Confirm contactEmail is always null
Run in Atlas Shell:
```javascript
db.primarycontacts.countDocuments({
  contactEmail: { $nin: [null, "", undefined] }
})
```
Show the count. If > 0, contactEmail has data and needs to be migrated first.

### 24. Where is `contactEmail` read in the codebase?
Search all files for `contactEmail`.
Is it displayed anywhere in the frontend? Is it in any API response?

### 25. Where is `contactEmail` written?
Show any form or handler that sets `contactEmail`.

---

## SECTION 4 — FRONTEND: What the UI currently shows vs what it should show

### 26. Show the Finalize Booking form (Image 6 reference)
File: likely `frontend/src/pages/FinalizeBooking.tsx` or similar
Which fields does this form currently save to:
- The booking document?
- The passenger document?

Specifically: does this form save `travelDate`, `returnDate`, `flightFrom`,
`flightTo`, `tripType` to the BOOKING document or to PASSENGER documents?

### 27. Show the Booking Detail page (Image 7 reference)
File: likely `frontend/src/pages/BookingDetail.tsx` or similar
The Travelers section shows "Flight Details" with:
- Destination: India
- DXB → bhj
- Trip Type: Round-Trip

Where does the frontend READ these values from currently?
- `booking.flightFrom` and `booking.flightTo`?
- `passenger.flightFrom` and `passenger.flightTo`?
- `booking.segments[0]`?

This is critical — if it reads from passenger fields, removing them breaks this display.

### 28. Show the BookingsTable / booking list component
Does the list view display `travelDate`, `flightFrom`, `flightTo`, or `tripType`?
Which collection does it read these from?

### 29. Show the Travel Calendar component
File: likely `frontend/src/pages/TravelCalendar.tsx` or similar
Does it filter or display based on `travelDate`?
If yes — does it read from `booking.travelDate` or `booking.segments[0].departureDate`?

---

## SECTION 5 — SEGMENTS: The New Structure

### 30. What is the intended `segments` array structure?
From Image 1: "instead of 5 separate fields, flight details like TravelDate,
ReturnDate, flightFrom, flightTo, TripType will be stored in segments or array"

Show the intended segment schema. Is it already defined in the model?
Example of expected structure:
```json
{
  "segments": [
    {
      "flightFrom": "DXB",
      "flightTo": "BHJ",
      "departureDate": "2026-05-20",
      "departureTime": "10:00",
      "arrivalTime": "12:00"
    },
    {
      "flightFrom": "BHJ",
      "flightTo": "DXB",
      "departureDate": "2026-05-27",
      "departureTime": "14:00",
      "arrivalTime": "16:00"
    }
  ]
}
```
Confirm the exact field names the frontend will use.

### 31. Is `segments` already being populated anywhere?
Search all controllers and frontend for `segments`.
From the Atlas screenshot, `segments: Array (empty)` — so no data yet.
But confirm no code is writing to it currently.

### 32. What is the migration plan for existing 614 bookings?
For bookings that have `travelDate`, `flightFrom`, `flightTo`, `tripType` set —
these values need to be moved into `segments` BEFORE the flat fields are removed.

Example: booking with `travelDate: "2026-05-08"`, `flightFrom: "DXB"`,
`flightTo: "BHJ"`, `tripType: "round-trip"` should become:
```json
{
  "segments": [
    { "flightFrom": "DXB", "flightTo": "BHJ", "departureDate": "2026-05-08" }
  ]
}
```
For round-trip: should `returnDate` become a second segment?

How many existing bookings have non-null `travelDate`?
```javascript
db.bookings.countDocuments({ travelDate: { $nin: [null, ""] } })
```
Show the count.

---

## SECTION 6 — IMPACT ASSESSMENT: What breaks if we remove each field

### 33. For each field below, confirm: is it in any MongoDB index?
```javascript
// Run for each field:
db.bookings.getIndexes()
// Look for any index containing: travelDate, returnDate, flightFrom,
// flightTo, tripType, amount, includesFlight, pricePerTicket
```
If a field is in an index — the index must be updated when the field is removed.

### 34. Is `travelDate` used in the follow-up cron job?
File: `src/utils/followUpCron.ts`
Show the complete cron query. If it filters by `travelDate` — removing it
breaks the cron silently.

### 35. Is any field being removed used in the analytics aggregation pipelines?
File: `src/controllers/analyticsController.ts`
Search for `travelDate`, `flightFrom`, `tripType`, `amount` in any `$match`,
`$group`, or `$project` stage.

### 36. Show the `recalcOutstanding` function
Does it use `amount`, `totalAmount`, or `pricePerTicket` in its calculation?
This is critical — if recalcOutstanding reads `booking.amount` and we remove it,
outstanding calculation breaks for all bookings.

### 37. Is `pricePerTicket` used to calculate anything?
Show any formula that multiplies `pricePerTicket` by passenger count.

---

## SECTION 7 — SAFETY: Migration Strategy Confirmation

### 38. What is the current backup strategy?
Is there a MongoDB Atlas backup schedule enabled?
Before running any migration script, we need confirmation that
Atlas backups are active OR a manual export has been done.

### 39. Is there a staging / test database?
From the Atlas screenshots: collections exist in `TESTDATA` cluster.
Is this a staging environment separate from production?
Can we run the migration on TESTDATA first before production?

### 40. Show the current `__v` field usage
Atlas screenshots show `__v: 0` on documents.
Is Mongoose versioning (`versionKey`) being used anywhere?
Any code that checks `__v` would need updating if schema changes cause
version bumps.

### 41. For each collection, what is the document count in PRODUCTION
(not TESTDATA)?
```javascript
// Run on your production cluster:
db.bookings.countDocuments()
db.passengers.countDocuments()
db.primarycontacts.countDocuments()
```
Show the counts. Migration script must handle ALL production documents.

### 42. Are there any active sessions or logged-in users during planned migration?
The migration should run during lowest traffic period.
What time zone are your users in?
What hours have lowest traffic based on your Render logs?

---

## SECTION 8 — estimatedCost → totalAmount sync (Image 1 requirement)

### 43. Show the current logic for setting `totalAmount`
When is `totalAmount` set? Is it manually entered or computed?
From Atlas: `amount: 50000` and `totalAmount: 50000` are equal.
Is `totalAmount` always supposed to equal the sum of `estimatedCosts` items?

### 44. Show the `estimatedCosts` array schema
What fields does each item have?
Example from Image 6: Air Ticket (19000), Hotel (26000), Transport (2000) = 47000
But `totalAmount` shows 50000 — why is there a discrepancy?

### 45. Show where `totalAmount` is currently updated
Is it updated when `estimatedCosts` changes?
Is there a recalculation trigger?
The requirement says "value in estimatedCost should also be placed in totalAmount"
— confirm exactly what this means:
- Sum of all estimatedCosts items → totalAmount?
- Or estimatedCosts[0].amount → totalAmount?

---

## HOW TO ANSWER

- Every answer needs actual code or actual Atlas Shell output.
- If a field is used somewhere, show the exact line.
- If a query returns a count, show the number.
- Do NOT assume a field is safe to remove — prove it with counts and code search.
- Do NOT write any migration code yet — just answer the questions.
- Flag any answer where you are uncertain with ⚠️

The migration plan will be built from these answers.
No changes to the database until every question is answered.
