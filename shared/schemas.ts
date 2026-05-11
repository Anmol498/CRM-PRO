import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'AGENT', 'MARKETER', 'VISA', 'TICKETING', 'OPERATION', 'ACCOUNT']),
    groups: z.array(z.string()).optional(),
});

const segmentSchema = z.object({
    from: z.string().optional().default(''),
    to: z.string().optional().default(''),
    departureDate: z.string().optional().nullable(),
    returnDate: z.string().optional().nullable(),
    returnDepartureTime: z.string().optional().nullable(),
    tripType: z.enum(['one-way', 'round-trip', 'multi-city']).optional().default('one-way'),
    country: z.string().optional().nullable(),
    // Legacy alias support
    date: z.string().optional().nullable(),
});

export const createBookingSchema = z.object({
    contactPerson: z.string().min(2, 'Contact Person must be at least 2 characters'),
    contactNumber: z.string().min(10, 'Contact Number must be a valid phone number'),
    contactEmail: z.string().email().optional().nullable(),
    bookingType: z.enum(['B2B', 'B2C']),
    segments: z.array(segmentSchema).optional().default([]),
    totalAmount: z.number().nonnegative().optional().default(0),
    assignedGroup: z.string().optional(),
    interested: z.enum(['Yes', 'No']).optional(),
    assignedToUserId: z.string().optional().nullable(),
    actualAmount: z.number().nonnegative().optional(),
    estimatedMargin: z.number().optional(),
    actualMargin: z.number().optional(),
    additionalServicesDetails: z.string().optional().nullable(),
    // Legacy fields — accepted for backward compat but mapped to segments internally
    destination: z.string().optional().nullable(),
    travelDate: z.string().optional().nullable(),
    requirements: z.string().optional().nullable(),
    flightFrom: z.string().optional().nullable(),
    flightTo: z.string().optional().nullable(),
    tripType: z.enum(['one-way', 'round-trip', 'multi-city']).optional(),
    amount: z.number().nonnegative().optional(),
    travellers: z.number().int().positive().optional(),
    pricePerTicket: z.number().nonnegative().optional(),
    includesFlight: z.boolean().optional(),
    includesAdditionalServices: z.boolean().optional(),
});

export const updateBookingSchema = z.object({
    contactPerson: z.string().optional(),
    contactNumber: z.string().optional(),
    contactEmail: z.string().email().optional().nullable(),
    segments: z.array(segmentSchema).optional(),
    totalAmount: z.number().nonnegative().optional(),
    finalQuotation: z.string().optional().nullable(),
    requirements: z.string().optional(),
    interested: z.enum(['Yes', 'No']).optional(),
    bookingType: z.enum(['B2B', 'B2C']).optional(),
    followUpDate: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    assignedGroup: z.string().optional(),
    estimatedCosts: z.array(z.object({
        costType: z.string(),
        price: z.number(),
        source: z.string()
    })).optional(),
    actualCosts: z.array(z.object({
        costType: z.string(),
        price: z.number(),
        source: z.string()
    })).optional(),
    actualAmount: z.number().nonnegative().optional(),
    estimatedMargin: z.number().optional(),
    actualMargin: z.number().optional(),
    additionalServicesDetails: z.string().optional().nullable(),
    // Legacy fields — accepted for backward compat
    destination: z.string().optional().nullable(),
    travelDate: z.string().optional().nullable(),
    flightFrom: z.string().optional().nullable(),
    flightTo: z.string().optional().nullable(),
    tripType: z.enum(['one-way', 'round-trip', 'multi-city']).optional(),
    amount: z.number().nonnegative().optional(),
    travellers: z.number().int().positive().optional(),
    pricePerTicket: z.number().nonnegative().optional(),
    includesFlight: z.boolean().optional(),
    includesAdditionalServices: z.boolean().optional(),
});

export const updateBookingStatusSchema = z.object({
    status: z.enum(['Pending', 'Working', 'Sent', 'Booked', 'Follow Up']),
});

export const assignBookingSchema = z.object({
    assignedToUserId: z.string().nullable().optional(),
});

export const createCommentSchema = z.object({
    text: z.string().min(1),
});

export const passengerSchema = z.object({
    name: z.string().min(1),
    phoneNumber: z.string().regex(/^\+\d{1,4}\d{10}$/, 'Phone number must have country code and 10 digits').optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    dob: z.string().optional(),
    anniversary: z.string().optional(),
});

export const createPassengersSchema = z.array(passengerSchema);

export const createPaymentSchema = z.object({
    amount: z.number().positive(),
    paymentMethod: z.string().min(1),
    transactionId: z.string().optional(),
    remarks: z.string().optional(),
    date: z.string().optional(), // ISO date string
});
