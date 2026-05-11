export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'AGENT' | 'MARKETER' | 'OPERATION' | 'ACCOUNT' | 'VISA' | 'TICKETING';
    groups?: string[];
    isOnline?: boolean;
    lastSeen?: string;
    permissions?: {
        canAssignLeads?: boolean;
        canDeleteLeads?: boolean;
        canVerifyFinancials?: boolean;
    };
}

export interface Segment {
    from: string;
    to: string;
    departureDate: string | null;
    returnDate?: string | null;
    returnDepartureTime?: string | null;
    tripType?: 'one-way' | 'round-trip' | 'multi-city';
    country?: string | null;
    // Legacy alias — some old data has `date` instead of `departureDate`
    date?: string | null;
}

export interface Traveler {
    id: string;
    bookingId: string;
    name: string;
    phoneNumber?: string;
    email?: string;
    dob?: string;
    anniversary?: string;
}

export interface Comment {
    id: string;
    bookingId: string;
    text: string;
    createdBy: User;
    createdById: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    remarks?: string;
    date: string;
    createdAt: string;
}

export interface Booking {
    id: string;
    createdAt: string;
    contactPerson: string;
    contactNumber: string;
    contactEmail?: string;
    requirements?: string;
    status: 'Pending' | 'Working' | 'Sent' | 'Booked' | 'Follow Up';
    assignedToUser?: User;
    assignedToUserId?: any;
    createdByUser: User;
    createdByUserId: string;
    bookingType: 'B2B' | 'B2C' | string;
    travelers: Traveler[];
    comments: Comment[];
    payments: Payment[];
    totalAmount?: number;
    finalQuotation?: string;
    interested?: 'Yes' | 'No';
    uniqueCode?: string;
    segments?: Segment[];
    followUpDate?: string | null;
    outstanding?: number;
    activities?: Activity[];
    assignedGroup?: string;
    companyName?: string;
    company?: string;
    estimatedCosts?: { costType: string; price: number; source: string }[];
    estimatedMargin?: number;
    actualCosts?: { costType: string; price: number; source: string }[];
    actualMargin?: number;
    actualAmount?: number;
    isVerified?: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
    additionalServicesDetails?: string | null;

    // Virtual/derived backward-compat fields (emitted by toJSON transform)
    travelDate?: string;
    returnDate?: string;
    flightFrom?: string;
    flightTo?: string;
    tripType?: 'one-way' | 'round-trip' | 'multi-city';
    destination?: string;
    destinationCity?: string;
    amount?: number;
    includesFlight?: boolean;
    includesAdditionalServices?: boolean;
    travellers?: number;
    fromCity?: string;
    pricePerTicket?: number;
    duration?: string;
}

export interface Activity {
    id: string;
    bookingId: string;
    userId?: User;
    action: string;
    details?: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface Notification {
    _id: string;
    userId: string;
    bookingId?: string;
    message: string;
    read: boolean;
    createdAt: string;
}
