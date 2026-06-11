/**
 * booking.js - Client-Side Booking Engine for Peace & Joy Guest House
 * Handles room definitions, validation, pricing calculations, and localStorage persistence.
 */

// Room Database matching actual Booking.com room categories
const ROOMS = [
  {
    id: 'standard_twin',
    name: 'Standard Twin Room',
    price: 15,
    currency: '$',
    capacity: 2,
    beds: '2 Twin Beds',
    size: '18 m²',
    view: 'City View',
    image: 'assets/twin_room.png',
    description: 'Comfortable twin room featuring two separate single beds, ideal for friends or colleagues traveling together. Includes silent air conditioning, free Wi-Fi, a writing desk, private bathroom, and parquet flooring.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-pump-soap', name: 'Complimentary Toiletries' }
    ]
  },
  {
    id: 'deluxe_triple',
    name: 'Deluxe Triple Room',
    price: 20,
    currency: '$',
    capacity: 3,
    beds: '1 Twin Bed + 1 Full Bed',
    size: '25 m²',
    view: 'City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/552648659.jpg?k=b35ece6815eb411e8607d94bb3617a5b31ee30afac51a7b4390086e84440473e&o=&hp=1',
    description: 'Spacious deluxe room featuring a comfortable double bed and an additional single bed. Equipped with modern Newari detailing, air conditioning, writing desk, flat-screen TV, and private modern bathroom.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-tv', name: 'Flat-screen TV' },
      { icon: 'fa-pump-soap', name: 'Premium Toiletries' }
    ]
  },
  {
    id: 'standard_king',
    name: 'Standard King Room',
    price: 18,
    currency: '$',
    capacity: 2,
    beds: '1 Queen Bed',
    size: '22 m²',
    view: 'City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553045045.jpg?k=e23bebbb48bf520aac448e9a5c6e830dbcfc61f093e4b8d9f86c620e07aaff91&o=&hp=1',
    description: 'Our signature standard king room blending modern comfort with classic Newari details. Features a comfortable queen-size bed, private modern bathroom with hydromassage shower, work desk, air conditioning, and city views.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Hydromassage Shower' },
      { icon: 'fa-desktop', name: 'Work Desk & Lamp' },
      { icon: 'fa-pump-soap', name: 'Premium Toiletries' },
      { icon: 'fa-coffee', name: 'Coffee/Tea Maker' }
    ]
  },
  {
    id: 'budget_double',
    name: 'Budget Double Room',
    price: 12,
    currency: '$',
    capacity: 2,
    beds: '1 Full Bed',
    size: '16 m²',
    view: 'Courtyard View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553045901.jpg?k=71adc259dd5afe7fb83b95bc00bade7be88aaa5eeec1e450fc87f8a03f81515b&o=&hp=1',
    description: 'A pocket-friendly double room facing our quiet courtyard. Includes air conditioning, private bathroom, work desk, and high-speed Wi-Fi access. Ideal for solo explorers and budget travelers.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-pump-soap', name: 'Complimentary Toiletries' }
    ]
  },
  {
    id: 'apartment',
    name: 'Apartment',
    price: 24,
    currency: '$',
    capacity: 3,
    beds: '1 Twin Bed + 1 Full Bed',
    size: '35 m²',
    view: 'Terrace & City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553047567.jpg?k=17f5b8e07756e5b3e41be7c910fd3a9e171e50982e0af92cb2c2945284ad6a9b&o=1',
    description: 'Spacious self-contained apartment containing comfortable beds, a dining seating area, and direct access to shared kitchen facilities. Features air conditioning, laundry services, and gorgeous city views.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-utensils', name: 'Dining Table' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-tv', name: 'Flat-screen TV' },
      { icon: 'fa-tshirt', name: 'Laundry Access' },
      { icon: 'fa-couch', name: 'Seating Area' }
    ]
  },
  {
    id: 'quadruple',
    name: 'Quadruple Room',
    price: 26,
    currency: '$',
    capacity: 4,
    beds: '1 King Bed',
    size: '32 m²',
    view: 'City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553048566.jpg?k=326380c2d1ce093fa1cc3c9a2047c210695d1938cee6acf3597ef75e01e3b166&o=1',
    description: 'Spacious family or group room featuring a large king bed and additional bedding configurations upon request. Offers a writing desk, private bathroom, silent air conditioning, and plenty of luggage space.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-tv', name: 'Flat-screen TV' },
      { icon: 'fa-couch', name: 'Seating Area' }
    ]
  },
  {
    id: 'superior_double',
    name: 'Superior Double Room',
    price: 16,
    currency: '$',
    capacity: 2,
    beds: '1 Full Bed',
    size: '20 m²',
    view: 'City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553049778.jpg?k=38a5e727fd58d5a19d359bb6343a18385b7f65d1ed568e3f832000ff5b31a7d6&o=1',
    description: 'A cozy double bed room equipped with modern wooden furniture and air conditioning. Offers a beautiful city view, writing desk, flat-screen TV, private bathroom, and daily housekeeping.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-pump-soap', name: 'Complimentary Toiletries' },
      { icon: 'fa-tv', name: 'Flat-screen TV' }
    ]
  },
  {
    id: 'standard_triple',
    name: 'Standard Triple Room',
    price: 19,
    currency: '$',
    capacity: 3,
    beds: '1 Twin Bed + 1 Full Bed',
    size: '24 m²',
    view: 'City View',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/553053316.jpg?k=7756abf6d47e1dc5adef8a07a36f310fc105d8ed3130fd2c859f1d22874dd91d&o=1',
    description: 'Comfortable triple accommodation featuring a double bed and a single bed. Equipped with air conditioning, a private bathroom, and free high-speed Wi-Fi. Perfect for families or small groups.',
    amenities: [
      { icon: 'fa-snowflake', name: 'Air Conditioning' },
      { icon: 'fa-wifi', name: 'Free High-speed Wi-Fi' },
      { icon: 'fa-shower', name: 'Private Bathroom' },
      { icon: 'fa-desktop', name: 'Work Desk' },
      { icon: 'fa-pump-soap', name: 'Complimentary Toiletries' }
    ]
  }
];

// Tax and fee configuration
const TAX_RATE = 0.13;       // 13% Nepalese VAT
const SERVICE_CHARGE = 0.10; // 10% Service Charge
const BREAKFAST_PRICE = 6.00; // $6 per person per day

// LocalStorage Keys
const BOOKINGS_KEY = 'peace_joy_bookings';
const REVIEWS_KEY = 'peace_joy_reviews';

/**
 * Initialize mock data if not present
 */
function initMockData() {
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(REVIEWS_KEY)) {
    const defaultReviews = [
      {
        id: 'rev-1',
        name: 'Sarah Jenkins',
        country: 'United Kingdom',
        rating: 5,
        date: '2026-05-18',
        comment: 'Absolutely loved my stay here! The location is perfect—literally a 5-minute walk to Patan Durbar Square. The rooftop views at sunset are breathtaking, and the rooms are sparkling clean. Highly recommend!'
      },
      {
        id: 'rev-2',
        name: 'Takahiro Sato',
        country: 'Japan',
        rating: 5,
        date: '2026-06-02',
        comment: 'Staff speaks excellent Chinese and Japanese! They helped me book a local guide and a taxi to Kathmandu airport. The shared kitchen was very convenient. Very peaceful place.'
      },
      {
        id: 'rev-3',
        name: 'Elena Rostova',
        country: 'Germany',
        rating: 4,
        date: '2026-06-08',
        comment: 'Beautiful Newari brick details in a modern layout. The rooms are spacious, air conditioning is silent, and the bed is super comfortable. The breakfast is delicious and fresh!'
      }
    ];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaultReviews));
  }
}

// Execute immediately to set defaults
initMockData();

/**
 * Calculate cost breakdown for a booking
 */
function calculateCost(roomId, checkInStr, checkOutStr, guestsCount, includeBreakfast) {
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return null;

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  
  // Calculate difference in nights
  const diffTime = Math.abs(checkOut - checkIn);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const roomSubtotal = room.price * nights;
  const breakfastTotal = includeBreakfast ? (BREAKFAST_PRICE * guestsCount * nights) : 0;
  
  const subtotal = roomSubtotal + breakfastTotal;
  const serviceChargeVal = subtotal * SERVICE_CHARGE;
  const taxVal = (subtotal + serviceChargeVal) * TAX_RATE;
  const total = subtotal + serviceChargeVal + taxVal;

  return {
    nights,
    roomPrice: room.price,
    roomSubtotal,
    breakfastTotal,
    subtotal,
    serviceCharge: serviceChargeVal,
    tax: taxVal,
    total: Math.round(total * 100) / 100
  };
}

/**
 * Check room availability for selected dates
 */
function checkRoomAvailability(roomId, checkInStr, checkOutStr, excludeBookingId = null) {
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  
  if (checkIn >= checkOut) return { available: false, error: 'Check-out date must be after Check-in date.' };

  const bookings = getBookings();
  
  // Filter bookings for the same room
  const roomBookings = bookings.filter(b => b.roomId === roomId && b.status !== 'cancelled' && b.id !== excludeBookingId);

  for (let b of roomBookings) {
    const bIn = new Date(b.checkIn);
    const bOut = new Date(b.checkOut);

    // Overlap checks
    if (checkIn < bOut && checkOut > bIn) {
      return { 
        available: false, 
        error: `The room is already booked from ${b.checkIn} to ${b.checkOut}. Please choose alternative dates.` 
      };
    }
  }

  return { available: true };
}

/**
 * Get all bookings
 */
function getBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
}

/**
 * Create a new booking
 */
function createBooking(bookingData) {
  const { roomId, checkIn, checkOut, guestName, guestEmail, guestRequests, guestsCount, includeBreakfast } = bookingData;
  
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return { success: false, error: 'Invalid Room ID.' };

  // Re-verify availability
  const availability = checkRoomAvailability(roomId, checkIn, checkOut);
  if (!availability.available) {
    return { success: false, error: availability.error };
  }

  const cost = calculateCost(roomId, checkIn, checkOut, guestsCount, includeBreakfast);
  const newBooking = {
    id: 'PJB-' + Math.floor(100000 + Math.random() * 900000),
    roomId,
    roomName: room.name,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestRequests: guestRequests || 'None',
    guestsCount: parseInt(guestsCount),
    includeBreakfast,
    cost,
    status: 'confirmed',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

  return { success: true, booking: newBooking };
}

/**
 * Cancel a booking
 */
function cancelBooking(bookingId) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  
  if (index === -1) return { success: false, error: 'Booking not found.' };
  
  bookings[index].status = 'cancelled';
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return { success: true };
}

/**
 * Edit a booking
 */
function updateBooking(bookingId, checkIn, checkOut, guestsCount, includeBreakfast) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  
  if (!booking) return { success: false, error: 'Booking not found.' };

  // Verify availability (excluding current booking)
  const availability = checkRoomAvailability(booking.roomId, checkIn, checkOut, bookingId);
  if (!availability.available) {
    return { success: false, error: availability.error };
  }

  booking.checkIn = checkIn;
  booking.checkOut = checkOut;
  booking.guestsCount = parseInt(guestsCount);
  booking.includeBreakfast = includeBreakfast;
  booking.cost = calculateCost(booking.roomId, checkIn, checkOut, guestsCount, includeBreakfast);

  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return { success: true, booking };
}

/**
 * Get all reviews
 */
function getReviews() {
  return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
}

/**
 * Create a new review
 */
function addReview(reviewData) {
  const { name, country, rating, comment } = reviewData;
  if (!name || !rating || !comment) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  const newReview = {
    id: 'REV-' + Math.floor(100000 + Math.random() * 900000),
    name,
    country: country || 'Explorer',
    rating: parseInt(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  const reviews = getReviews();
  reviews.unshift(newReview); // Add to beginning
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

  return { success: true, review: newReview };
}
