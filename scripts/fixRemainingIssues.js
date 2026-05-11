/**
 * CRM 3.0 Final Health Fix
 * 
 * This script fixes the remaining issues identified in verifyMigration.js:
 * 1. Missing Contact Snapshots (Visibility)
 * 2. Missing Participant IDs (Access Control)
 * 3. Missing updatedAt index (Performance)
 */

const dbName = db.getName();
print("\n🛠️  Running Final Health Fix on: " + dbName);

// 1. Fix Contact Snapshots
print("\n--- 1. Backfilling Missing Contact Snapshots ---");
let snapshotCount = 0;
db.bookings.find({ contact: { $exists: false } }).forEach(doc => {
    const pcId = doc.primaryContactId || doc.contactId;
    if (pcId) {
        const objId = (typeof pcId === 'string') ? ObjectId(pcId) : pcId;
        const pc = db.primarycontacts.findOne({ _id: objId });
        
        if (pc) {
            db.bookings.updateOne({ _id: doc._id }, {
                $set: {
                    contact: {
                        name: pc.contactName,
                        phone: pc.contactPhoneNo,
                        email: pc.contactEmail || null,
                        type: pc.bookingType === 'Agent (B2B)' ? 'B2B' : 'B2C',
                        requirements: pc.requirements || null,
                        interested: (pc.interested === 'Yes' || pc.interested === true)
                    },
                    primaryContactId: objId
                }
            });
            snapshotCount++;
        }
    }
});
print("✅ Fixed " + snapshotCount + " contact snapshots.");

// 2. Fix Participant IDs
print("\n--- 2. Backfilling Missing Participant IDs ---");
let participantCount = 0;
db.bookings.find({ $or: [{ participantIds: { $exists: false } }, { participantIds: { $size: 0 } }] }).forEach(doc => {
    let ids = [];
    if (doc.createdByUserId) ids.push(doc.createdByUserId);
    if (doc.assignedToUserId) ids.push(doc.assignedToUserId);
    
    // Simple de-duplication for ObjectId
    let uniqueIds = [];
    ids.forEach(id => {
        if (id && !uniqueIds.some(uid => uid.toString() === id.toString())) {
            uniqueIds.push(id);
        }
    });

    if (uniqueIds.length > 0) {
        db.bookings.updateOne({ _id: doc._id }, { $set: { participantIds: uniqueIds } });
        participantCount++;
    }
});
print("✅ Fixed " + participantCount + " participant access lists.");

// 3. Fix Missing Indexes
print("\n--- 3. Creating Missing Performance Indexes ---");
print("   - Creating updatedAt_-1 index...");
db.bookings.createIndex({ updatedAt: -1 }, { background: true });
print("✅ Index created.");

print("\n🎉 Final Health Fix Completed!");
print("Run load(\"scripts/verifyMigration.js\") to check the results.\n");
