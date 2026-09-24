import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { seedUsers, seedHotels, seedRooms } from './seedData.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Clearing existing collections...');
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Room.deleteMany({});
    await Hotel.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Inserting users...');
    // Create users individually so password pre-save hook runs properly
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    const guestUser = createdUsers.find((u) => u.role === 'guest');
    const ownerUser = createdUsers.find((u) => u.role === 'hotelOwner');

    console.log('[Seed] Inserting luxury hotels...');
    const hotelsToInsert = seedHotels.map((h) => ({
      ...h,
      owner: ownerUser._id,
    }));
    const createdHotels = await Hotel.insertMany(hotelsToInsert);

    console.log('[Seed] Inserting luxury rooms...');
    const roomsToInsert = seedRooms.map((r) => {
      const hotel = createdHotels[r.hotelIndex];
      const { hotelIndex, ...roomData } = r;
      return {
        ...roomData,
        hotel: hotel._id,
      };
    });
    const createdRooms = await Room.insertMany(roomsToInsert);

    console.log('[Seed] Inserting verified reviews & bookings...');
    // Add sample reviews for first 3 rooms
    if (createdRooms.length >= 3 && guestUser) {
      await Review.create({
        user: guestUser._id,
        room: createdRooms[0]._id,
        rating: 5,
        comment: 'Exquisite stay! The skyline views were breathtaking and room service was prompt and polite.',
      });

      await Review.create({
        user: guestUser._id,
        room: createdRooms[1]._id,
        rating: 5,
        comment: 'Super clean, gorgeous interior design, and prime location right in the city center.',
      });

      // Add a confirmed sample booking
      const now = new Date();
      const checkIn = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      const checkOut = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
      const nights = 3;

      await Booking.create({
        bookingReference: 'QS-DEMO01',
        user: guestUser._id,
        hotel: createdRooms[0].hotel,
        room: createdRooms[0]._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        guests: 2,
        totalPrice: nights * createdRooms[0].pricePerNight,
        paymentMethod: 'Stripe',
        isPaid: true,
        status: 'confirmed',
        guestDetails: {
          fullName: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone,
          specialRequests: 'High floor preferred, arriving late evening.',
        },
      });
    }

    console.log('✅ [Seed] Database seeded successfully with enterprise mock dataset!');
    console.log('Demo Credentials:');
    console.log('  - Guest Traveler:  guest@demo.com  / password123');
    console.log('  - Hotel Manager:   owner@demo.com  / password123');
    console.log('  - Platform Admin:  admin@demo.com  / password123');
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
  }
};

export const autoSeedIfEmpty = async () => {
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    console.log('[Seed] Database is empty. Auto-seeding initial luxury hotel catalog...');
    await seedDatabase();
  } else {
    console.log(`[Seed] Database already populated with ${roomCount} rooms. Ready to serve.`);
  }
};
