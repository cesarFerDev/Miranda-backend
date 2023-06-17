
export interface RoomSimple {
    id: string,
    type: 'Single Bed' | 'Double Bed' | 'Double Superior' | 'Suite',
    number: string 
}

export interface Booking {
    id?: string,
    guest_name: string,
    guest_email: string,
    guest_contact: string,
    order_date: string,
    check_in: string,
    check_out: string,
    special_request: string,
    room: Room,
    status: 'Check In' | 'Check Out' | 'In Progress'
}

export interface Contact {
    id?: string,
    contact_date: string,
    guest_name: string,
    guest_email: string,
    guest_contact: string,
    content_title: string,
    content_text: string,
    is_archived: boolean
}

export interface Room {
    id?: string,
    type: 'Single Bed' | 'Double Bed' | 'Double Superior' | 'Suite',
    number: number,
    price: number,
    discount: number,
    cancellation: string,
    description: string,
    amenities: string[],
    photos: string[],
    is_available: boolean
}

export interface User {
    id?: string,
    photo: string,
    user_name: string,
    job: 'Manager' | 'Recepcionist' | 'Room Service',
    email: string,
    contact: string,
    start_date: string,
    job_description: string,
    is_active: boolean,
    password: string
}

export interface UserLogin {
    mail: string,
    password: string
}