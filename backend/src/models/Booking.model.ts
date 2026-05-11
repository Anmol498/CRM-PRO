import mongoose, { Document, Model, Schema } from 'mongoose';
import Counter from './Counter.model';

export interface ISegment {
    from: string;
    to: string;
    departureDate: Date | null;
    returnDate: Date | null;
    returnDepartureTime: string | null;
    tripType: 'one-way' | 'round-trip' | 'multi-city';
    country: string | null;
}

export interface IBooking extends Document {
    primaryContactId: mongoose.Types.ObjectId;
    uniqueCode: string;
    contact: {
        name: string;
        phone: string;
        email?: string | null;
        type: string;
        requirements?: string | null;
        interested: boolean;
    };
    segments: ISegment[];
    totalAmount: number;
    finalQuotation: string | null;
    status: 'Pending' | 'Working' | 'Sent' | 'Booked' | 'Follow Up';
    followUpDate: Date | null;
    additionalServicesDetails: string | null;
    outstanding: number;
    createdByUserId: mongoose.Types.ObjectId;
    assignedToUserId: mongoose.Types.ObjectId | null;
    assignedGroup: string;
    company: string | null;
    isVerified: boolean;
    verifiedBy: string | null;
    verifiedAt: Date | null;
    estimatedCosts: {
        costType: string;
        price: number;
        source: string;
    }[];
    actualCosts: {
        costType: string;
        price: number;
        source: string;
    }[];
    actualAmount: number;
    estimatedMargin: number;
    actualMargin: number;
    lastInteractionAt: Date;
    participantIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;

    // Virtual getters for backward compatibility
    travelDate: Date | null;
    returnDate: Date | null;
    flightFrom: string | null;
    flightTo: string | null;
    tripType: string;
    destination: string | null;
    amount: number;
    includesFlight: boolean;
    includesAdditionalServices: boolean;
    travellers: number | null;
}

const bookingSchema = new Schema<IBooking>(
    {
        primaryContactId: { type: Schema.Types.ObjectId, ref: 'PrimaryContact', required: true },
        contact: {
            name: { type: String },
            phone: { type: String },
            email: { type: String },
            type: { type: String },
            requirements: { type: String },
            interested: { type: Boolean, default: false },
        },
        uniqueCode: { type: String, unique: true },
        segments: [{
            from: { type: String, default: '' },
            to: { type: String, default: '' },
            departureDate: { type: Date, default: null },
            returnDate: { type: Date, default: null },
            returnDepartureTime: { type: String, default: null },
            tripType: { type: String, enum: ['one-way', 'round-trip', 'multi-city'], default: 'one-way' },
            country: { type: String, default: null },
        }],
        totalAmount: { type: Number, default: 0 },
        finalQuotation: { type: String, default: null },
        status: { type: String, enum: ['Pending', 'Working', 'Sent', 'Booked', 'Follow Up'], default: 'Pending' },
        followUpDate: { type: Date, default: null },
        additionalServicesDetails: { type: String, default: null },
        outstanding: { type: Number, default: 0 },
        createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        assignedToUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        assignedGroup: { type: String, default: 'Package / LCC' },
        company: { type: String, default: null },
        isVerified: { type: Boolean, default: false },
        verifiedBy: { type: String, default: null },
        verifiedAt: { type: Date, default: null },
        lastInteractionAt: { type: Date, default: Date.now },
        estimatedCosts: [{
            costType: { type: String },
            price: { type: Number },
            source: { type: String }
        }],
        actualCosts: [{
            costType: { type: String },
            price: { type: Number },
            source: { type: String }
        }],
        actualAmount: { type: Number, default: 0 },
        estimatedMargin: { type: Number, default: 0 },
        actualMargin: { type: Number, default: 0 },
        participantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
        toJSON: { 
            virtuals: true,
            transform: (doc, ret: any) => {
                ret.id = ret._id;
                // Use embedded contact snapshot for all flattened fields
                if (ret.contact) {
                    ret.contactPerson = ret.contact.name;
                    ret.contactNumber = ret.contact.phone;
                    ret.contactEmail = ret.contact.email;
                    ret.requirements = ret.contact.requirements;
                    ret.bookingType = ret.contact.type === 'B2B' ? 'B2B' : 'B2C';
                    ret.interested = ret.contact.interested ? 'Yes' : 'No';
                }

                // Emit legacy flat fields from segments for backward compatibility
                const seg0 = ret.segments?.[0];
                if (seg0) {
                    ret.travelDate = seg0.departureDate;
                    ret.returnDate = seg0.returnDate;
                    ret.flightFrom = seg0.from;
                    ret.flightTo = seg0.to;
                    ret.tripType = seg0.tripType || 'one-way';
                    ret.destination = seg0.country;
                    ret.destinationCity = seg0.country;
                } else {
                    ret.travelDate = null;
                    ret.returnDate = null;
                    ret.flightFrom = null;
                    ret.flightTo = null;
                    ret.tripType = 'one-way';
                    ret.destination = null;
                    ret.destinationCity = null;
                }

                // amount alias for totalAmount
                ret.amount = ret.totalAmount || 0;

                // Derived flags
                ret.includesFlight = (ret.segments?.length || 0) > 0;
                ret.includesAdditionalServices = !!(ret.additionalServicesDetails);
                
                // Flatten user names for display
                if (ret.assignedToUserId && typeof (ret.assignedToUserId as any).name === 'string') {
                    ret.assignedToUser = (ret.assignedToUserId as any).name;
                }
                if (ret.createdByUserId && typeof (ret.createdByUserId as any).name === 'string' && !ret.createdByUser) {
                    ret.createdByUser = (ret.createdByUserId as any).name;
                }
                return ret;
            }
        },
        toObject: { virtuals: true },
    }
);

bookingSchema.pre('save', async function (this: any) {
    if (!this.uniqueCode) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'bookingId',
                { $inc: { seq: 1 } },
                { returnDocument: 'after', upsert: true }
            );
            
            if (counter) {
                const seqStr = counter.seq.toString().padStart(4, '0');
                this.uniqueCode = `TW${seqStr}`;
            }
        } catch (error) {
            console.error('Error generating sequential uniqueCode:', error);
            this.uniqueCode = 'TW' + Math.floor(1000 + Math.random() * 9000).toString();
        }
    }
});

// Indexes — Optimized for Atlas M0 (Free Tier) to balance read speed and write overhead
bookingSchema.index({ 'segments.0.departureDate': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ uniqueCode: 1 });
 
bookingSchema.index({ participantIds: 1, status: 1, createdAt: -1 }); // Covering index for most Agent/Marketer queries
bookingSchema.index({ status: 1, 'segments.0.departureDate': 1 }); 
bookingSchema.index({ outstanding: 1, status: 1 }); // High-performance unpaid leads filtering
bookingSchema.index({ assignedGroup: 1, status: 1 }); // Covering index for group-based dashboard
bookingSchema.index({ 'contact.phone': 1 }); // Quick search by phone
bookingSchema.index({ uniqueCode: 1 }, { unique: true }); // Should already be covered by schema but explicit here
bookingSchema.index({ company: 1, status: 1, createdAt: -1 }); 

// Virtual properties — backward-compat getters from segments
bookingSchema.virtual('travelDate').get(function (this: any) {
    return this.segments?.[0]?.departureDate || null;
});

bookingSchema.virtual('flightFrom').get(function (this: any) {
    return this.segments?.[0]?.from || null;
});

bookingSchema.virtual('flightTo').get(function (this: any) {
    return this.segments?.[0]?.to || null;
});

bookingSchema.virtual('tripType').get(function (this: any) {
    return this.segments?.[0]?.tripType || 'one-way';
});

bookingSchema.virtual('destination').get(function (this: any) {
    return this.segments?.[0]?.country || null;
});

bookingSchema.virtual('amount').get(function (this: any) {
    return this.totalAmount || 0;
});

bookingSchema.virtual('includesFlight').get(function (this: any) {
    return (this.segments?.length || 0) > 0;
});

bookingSchema.virtual('includesAdditionalServices').get(function (this: any) {
    return !!(this.additionalServicesDetails);
});

// Relational virtuals
bookingSchema.virtual('assignedToUser', {
    ref: 'User',
    localField: 'assignedToUserId',
    foreignField: '_id',
    justOne: true,
});

bookingSchema.virtual('createdByUser', {
    ref: 'User',
    localField: 'createdByUserId',
    foreignField: '_id',
    justOne: true,
});

bookingSchema.virtual('primaryContact', {
    ref: 'PrimaryContact',
    localField: 'primaryContactId',
    foreignField: '_id',
    justOne: true,
});

bookingSchema.virtual('timeline', {
    ref: 'Timeline',
    localField: '_id',
    foreignField: 'bookingId',
});

bookingSchema.virtual('payments', {
    ref: 'Payment',
    localField: '_id',
    foreignField: 'bookingId',
});

bookingSchema.virtual('passengers', {
    ref: 'Passenger',
    localField: '_id',
    foreignField: 'bookingId',
});

bookingSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'bookingId',
});

bookingSchema.virtual('activities', {
    ref: 'Timeline',
    localField: '_id',
    foreignField: 'bookingId',
});

// Pre-find hook to start timer
bookingSchema.pre(/^find/, function () {
    (this as any)._queryStart = Date.now();
});

// Post-find hook to log slow queries
bookingSchema.post(/^find/, function () {
    const duration = Date.now() - (this as any)._queryStart;
    if (duration > 100) {
        console.log(`[MONGOOSE SLOW] Booking.${(this as any).op} - ${duration}ms | filter: ${JSON.stringify((this as any)._conditions)}`);
    }
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
