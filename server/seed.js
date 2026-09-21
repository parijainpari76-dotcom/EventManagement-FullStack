const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dotenv.config();

const seedDatabase = async () => {
    try {
        // ==========================================
        // CHECK MONGODB URL
        // ==========================================

        if (!process.env.MONGODB_URL) {
            throw new Error(
                "MONGODB_URL is missing from your .env file"
            );
        }

        // ==========================================
        // CONNECT TO MONGODB
        // ==========================================

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("\n==========================================");
        console.log("✅ MongoDB connected successfully");
        console.log("📦 DATABASE:", mongoose.connection.name);
        console.log("🌐 HOST:", mongoose.connection.host);
        console.log("==========================================\n");

        // ==========================================
        // CLEAR OLD DATA
        // ==========================================

        await User.deleteMany({});
        await Event.deleteMany({});
        await Booking.deleteMany({});

        console.log("🗑️ Old data cleared successfully.");

        // ==========================================
        // PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            "password123",
            10
        );

        // ==========================================
        // USERS
        // ==========================================

        const users = [
            {
                name: "Admin User",
                email: "admin@eventora.com",
                password: hashedPassword,
                role: "admin",
                isVerified: true,
            },

            {
                name: "Test User",
                email: "user@eventora.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Priya Sharma",
                email: "priya@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Aman Verma",
                email: "aman@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Neha Singh",
                email: "neha@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Rohit Jain",
                email: "rohit@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Anjali Meena",
                email: "anjali@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Karan Gupta",
                email: "karan@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },

            {
                name: "Sneha Joshi",
                email: "sneha@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },
        ];

        const createdUsers = await User.insertMany(users);

        console.log(`👤 Created ${createdUsers.length} users.`);

        // ==========================================
        // FIND ADMIN
        // ==========================================

        const adminUser = createdUsers.find(
            (user) => user.role === "admin"
        );

        // ==========================================
        // EVENTS
        // ==========================================

        const events = [
            {
                title: "Tech Conference 2026",

                description:
                    "A technology conference featuring modern software development, AI and emerging technologies.",

                date: new Date("2026-10-10"),

                location: "Jaipur",

                category: "Technology",

                totalSeats: 100,

                availableSeats: 100,

                ticketPrice: 499,

                image:
                    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",

                createdBy: adminUser._id,
            },

            {
                title: "Music Festival",

                description:
                    "An exciting live music festival with multiple artists and performances.",

                date: new Date("2026-10-20"),

                location: "Udaipur",

                category: "Music",

                totalSeats: 200,

                availableSeats: 200,

                ticketPrice: 799,

                image:
                    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",

                createdBy: adminUser._id,
            },

            {
                title: "Startup Meetup",

                description:
                    "Meet entrepreneurs, developers and startup enthusiasts.",

                date: new Date("2026-11-05"),

                location: "Delhi",

                category: "Business",

                totalSeats: 150,

                availableSeats: 150,

                ticketPrice: 299,

                image:
                    "https://images.unsplash.com/photo-1556761175-b413da4baf72",

                createdBy: adminUser._id,
            },

            {
                title: "AI & Machine Learning Workshop",

                description:
                    "Hands-on workshop covering artificial intelligence and machine learning.",

                date: new Date("2026-11-15"),

                location: "Bangalore",

                category: "Technology",

                totalSeats: 80,

                availableSeats: 80,

                ticketPrice: 999,

                image:
                    "https://images.unsplash.com/photo-1518770660439-4636190af475",

                createdBy: adminUser._id,
            },

            {
                title: "Food Carnival",

                description:
                    "Enjoy different cuisines, food stalls and exciting activities.",

                date: new Date("2026-12-01"),

                location: "Mumbai",

                category: "Food",

                totalSeats: 250,

                availableSeats: 250,

                ticketPrice: 199,

                image:
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",

                createdBy: adminUser._id,
            },

            {
                title: "College Fest",

                description:
                    "A fun college event with cultural programs, games and competitions.",

                date: new Date("2026-12-15"),

                location: "Kota",

                category: "Education",

                totalSeats: 300,

                availableSeats: 300,

                ticketPrice: 149,

                image:
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",

                createdBy: adminUser._id,
            },
        ];

        const createdEvents = await Event.insertMany(events);

        console.log(`🎉 Created ${createdEvents.length} events.`);

        // ==========================================
// BOOKINGS
// ==========================================

const normalUsers = createdUsers.filter(
    (user) => user.role === "user"
);

const bookingStatuses = [
    "confirmed",
    "pending",
    "cancelled",
];

const paymentStatuses = [
    "paid",
    "not_paid",
];

const bookings = [];

for (const event of createdEvents) {
    const shuffledUsers = [...normalUsers].sort(
        () => Math.random() - 0.5
    );

    const selectedUsers = shuffledUsers.slice(
        0,
        Math.floor(Math.random() * 4) + 3
    );

    for (const user of selectedUsers) {
        bookings.push({
            userId: user._id,
            eventId: event._id,

            // Temporary/default booking amount
            amount: 500,

            status:
                bookingStatuses[
                    Math.floor(
                        Math.random() *
                        bookingStatuses.length
                    )
                ],

            paymentStatus:
                paymentStatuses[
                    Math.floor(
                        Math.random() *
                        paymentStatuses.length
                    )
                ],
        });
    }
}

const createdBookings =
    await Booking.insertMany(bookings);

    console.log("BOOKINGS IN DB:", await Booking.countDocuments());
    
console.log("EVENTS IN DB:", await Event.countDocuments());
console.log("USERS IN DB:", await User.countDocuments());
console.log("BOOKING COLLECTION:", Booking.collection.name);

console.log(
    "NATIVE BOOKINGS:",
    await mongoose.connection.db
        .collection("bookings")
        .countDocuments()
);

console.log(
    `🎫 Created ${createdBookings.length} bookings.`
);

        // ==========================================
        // SUCCESS
        // ==========================================

        console.log("\n==========================================");
        console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
        console.log("==========================================");

        console.log("\n🔐 LOGIN DETAILS");
        console.log("------------------------------------------");
        console.log("Admin Email : admin@eventora.com");
        console.log("User Email  : user@eventora.com");
        console.log("Password    : password123");
        console.log("------------------------------------------");

        console.log("\n📊 DATA CREATED");
        console.log("------------------------------------------");
        console.log(`Users     : ${createdUsers.length}`);
        console.log(`Events    : ${createdEvents.length}`);
        console.log(`Bookings  : ${createdBookings.length}`);
        console.log("------------------------------------------\n");

    } catch (error) {
        console.log("\n❌ SEED ERROR");
        console.log("------------------------------------------");
        console.log(error);
        console.log("------------------------------------------\n");
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed.");
    }
};

seedDatabase();