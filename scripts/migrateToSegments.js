/**
 * migrateToSegments.js
 * ---------------------
 * Backfills the enriched `segments[]` array on all bookings from legacy flat fields,
 * strips flight fields from passengers, and removes `contactEmail` from primarycontacts.
 *
 * Usage:
 *   node scripts/migrateToSegments.js                           # Live run
 *   node scripts/migrateToSegments.js --dry-run                 # Preview only
 *   node scripts/migrateToSegments.js --connection-string "..." # Custom MongoDB URI
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Load environment variables from backend/.env
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
}

// ─── CLI Flags ────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const csIdx = args.indexOf('--connection-string');
const CONNECTION_STRING = csIdx !== -1
    ? args[csIdx + 1]
    : process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://USER:PASS@cluster.mongodb.net/DB_NAME';

// ─── Main ─────────────────────────────────────────────────────
async function main() {
    console.log(`\n🚀 CRM 3.0 — Segments Migration`);
    console.log(`   Mode: ${DRY_RUN ? '🔍 DRY RUN (no writes)' : '✏️  LIVE RUN'}`);
    console.log(`   DB:   ${CONNECTION_STRING.replace(/\/\/.*@/, '//***@')}\n`);

    const client = new MongoClient(CONNECTION_STRING);
    await client.connect();
    
    // Explicitly use DB_NAME from env or fallback to travel_crm if not in URI
    const dbName = process.env.DB_NAME || 'travel_crm';
    const db = client.db(dbName);
    console.log(`   Connected to database: ${dbName}\n`);

    const bookingsCol = db.collection('bookings');
    const passengersCol = db.collection('passengers');
    const primaryContactsCol = db.collection('primarycontacts');

    // ─── Step 1: Migrate Bookings ─────────────────────────────
    console.log('─── Step 1: Enriching booking segments ───');

    const allBookings = await bookingsCol.find({}).toArray();
    console.log(`   Found ${allBookings.length} bookings to process.\n`);

    let bookingsMigrated = 0;
    let bookingsSkipped = 0;

    for (const booking of allBookings) {
        // Fetch passengers for this booking to get richer data
        const passengers = await passengersCol.find({ bookingId: booking._id }).toArray();
        const primaryPassenger = passengers[0] || null;

        // Build enriched segment from flat fields
        const legacyFrom = booking.flightFrom || primaryPassenger?.flightFrom || '';
        const legacyTo = booking.flightTo || primaryPassenger?.flightTo || '';
        const legacyDepartureDate = booking.travelDate || (primaryPassenger?.departureTime ? new Date(primaryPassenger.departureTime) : null);
        const legacyReturnDate = booking.returnDate || (primaryPassenger?.returnDate ? new Date(primaryPassenger.returnDate) : null);
        const legacyReturnDepartureTime = primaryPassenger?.returnDepartureTime || null;
        const legacyTripType = booking.tripType || primaryPassenger?.tripType || 'one-way';
        const legacyCountry = booking.destination || primaryPassenger?.country || null;

        const hasLegacyData = legacyFrom || legacyTo || legacyDepartureDate;

        if (!hasLegacyData && (!booking.segments || booking.segments.length === 0)) {
            bookingsSkipped++;
            continue;
        }

        // Start with existing segments (from multi-city external leads) or empty array
        let enrichedSegments = [];

        if (booking.segments && booking.segments.length > 0) {
            // Enrich existing segments with legacy data on segment[0]
            enrichedSegments = booking.segments.map((seg, idx) => {
                if (idx === 0) {
                    return {
                        from: seg.from || legacyFrom,
                        to: seg.to || legacyTo,
                        departureDate: seg.date || seg.departureDate || legacyDepartureDate,
                        returnDate: seg.returnDate || legacyReturnDate,
                        returnDepartureTime: seg.returnDepartureTime || legacyReturnDepartureTime,
                        tripType: seg.tripType || legacyTripType,
                        country: seg.country || legacyCountry,
                    };
                }
                // Additional legs: preserve but ensure structure
                return {
                    from: seg.from || '',
                    to: seg.to || '',
                    departureDate: seg.date || seg.departureDate || null,
                    returnDate: seg.returnDate || null,
                    returnDepartureTime: seg.returnDepartureTime || null,
                    tripType: seg.tripType || 'one-way',
                    country: seg.country || null,
                };
            });
        } else if (hasLegacyData) {
            // No segments exist — build from scratch
            enrichedSegments = [{
                from: legacyFrom,
                to: legacyTo,
                departureDate: legacyDepartureDate,
                returnDate: legacyReturnDate,
                returnDepartureTime: legacyReturnDepartureTime,
                tripType: legacyTripType,
                country: legacyCountry,
            }];
        }

        // Normalize totalAmount
        const normalizedTotalAmount = booking.totalAmount || booking.amount || 0;

        const updateOps = {
            $set: {
                segments: enrichedSegments,
                totalAmount: normalizedTotalAmount,
            },
            $unset: {
                travelDate: '',
                returnDate: '',
                flightFrom: '',
                flightTo: '',
                tripType: '',
                destination: '',
                amount: '',
                includesFlight: '',
                includesAdditionalServices: '',
                pricePerTicket: '',
                travellers: '',
                isConvertedToEDT: '',
            },
        };

        if (DRY_RUN) {
            console.log(`   [DRY] Booking ${booking.uniqueCode || booking._id}:`);
            console.log(`         segments: ${JSON.stringify(enrichedSegments[0]?.from)} → ${JSON.stringify(enrichedSegments[0]?.to)} (${enrichedSegments.length} leg(s))`);
            console.log(`         totalAmount: ${normalizedTotalAmount}`);
        } else {
            await bookingsCol.updateOne({ _id: booking._id }, updateOps);
        }

        bookingsMigrated++;
    }

    console.log(`\n   ✅ Bookings migrated: ${bookingsMigrated}, skipped (no data): ${bookingsSkipped}\n`);

    // ─── Step 2: Clean Passengers ─────────────────────────────
    console.log('─── Step 2: Stripping flight fields from passengers ───');

    const passengerCount = await passengersCol.countDocuments({});
    console.log(`   Found ${passengerCount} passengers.\n`);

    const passengerUnset = {
        $unset: {
            flightFrom: '',
            flightTo: '',
            departureTime: '',
            arrivalTime: '',
            tripType: '',
            returnDate: '',
            returnDepartureTime: '',
            returnArrivalTime: '',
            country: '',
        },
    };

    if (DRY_RUN) {
        console.log(`   [DRY] Would $unset 9 fields from ${passengerCount} passenger documents.`);
    } else {
        const passengerResult = await passengersCol.updateMany({}, passengerUnset);
        console.log(`   ✅ Passengers updated: ${passengerResult.modifiedCount}`);
    }

    // ─── Step 3: Clean PrimaryContacts ────────────────────────
    console.log('\n─── Step 3: Removing contactEmail from primarycontacts ───');

    const pcCount = await primaryContactsCol.countDocuments({});

    if (DRY_RUN) {
        console.log(`   [DRY] Would $unset contactEmail from ${pcCount} primarycontact documents.`);
    } else {
        const pcResult = await primaryContactsCol.updateMany({}, { $unset: { contactEmail: '' } });
        console.log(`   ✅ PrimaryContacts updated: ${pcResult.modifiedCount}`);
    }

    // ─── Summary ──────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════');
    console.log(`  Migration ${DRY_RUN ? 'DRY RUN' : 'COMPLETE'}`);
    console.log(`  Bookings:         ${bookingsMigrated} migrated, ${bookingsSkipped} skipped`);
    console.log(`  Passengers:       ${passengerCount} cleaned`);
    console.log(`  PrimaryContacts:  ${pcCount} cleaned`);
    console.log('═══════════════════════════════════════════\n');

    await client.close();
}

main().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
