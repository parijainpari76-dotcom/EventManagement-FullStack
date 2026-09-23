import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaArrowRight, FaMusic, FaLaptopCode, FaThLarge } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Category click handler
    const handleCategoryClick = (categoryName) => {
        setSearch(categoryName);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden mb-12 shadow-xl">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-black/60"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center z-10">
                    <span className="bg-white/10 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                        Welcome to Eventora
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-md">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500">
                            Unforgettable
                        </span> Experience
                    </h1>
                    <p className="text-gray-300 text-base md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area.
                    </p>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-400 text-xl group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-6 py-4 md:py-5 rounded-full text-base md:text-lg text-black bg-white/95 backdrop-blur-md border-2 border-transparent focus:border-gray-900 focus:outline-none transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
                {/* Clickable Quick Filters / Features Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <button 
                        onClick={() => handleCategoryClick('Music')} 
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer group"
                    >
                        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md shadow-gray-200 group-hover:bg-purple-600 transition">
                            <FaMusic />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Music Festivals</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Filter all live concerts, DJ nights, and musical events instantly.</p>
                    </button>

                    <button 
                        onClick={() => handleCategoryClick('Tech')} 
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer group"
                    >
                        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md shadow-gray-200 group-hover:bg-purple-600 transition">
                            <FaLaptopCode />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Tech Conferences</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Explore developer meetups, workshops, and technology summits.</p>
                    </button>

                    <button 
                        onClick={() => setSearch('')} 
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer group"
                    >
                        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md shadow-gray-200 group-hover:bg-purple-600 transition">
                            <FaThLarge />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">All Categories</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Browse through all upcoming events listed on Eventora platform.</p>
                    </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {events.length} {events.length === 1 ? 'event' : 'events'} found
                    </span>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="text-center py-20 text-lg font-semibold text-gray-500">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xl text-gray-500 font-medium">No events found matching your search.</p>
                        <p className="text-sm text-gray-400 mt-1">Try searching with a different term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const fillPercentage = Math.min(100, Math.max(0, (event.availableSeats / event.totalSeats) * 100));
                            return (
                                <div key={event._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition duration-300 flex flex-col group">
                                    <div className="h-48 bg-gray-100 overflow-hidden relative">
                                        {event.image ? (
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xl">
                                                {event.category || 'Event'}
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-gray-100">
                                            {event.ticketPrice === 0 ? <span className="text-emerald-600">FREE</span> : <span className="text-gray-900">₹{event.ticketPrice}</span>}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">{event.category || 'General'}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-1">{event.title}</h3>
                                        <div className="flex flex-col gap-2 mb-6 text-gray-600 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                                <div className="bg-gray-800 h-2 rounded-full transition-all duration-300" style={{ width: `${fillPercentage}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                                <span>{event.availableSeats} seats left</span>
                                                <span>{event.totalSeats} total</span>
                                            </div>

                                            <Link
                                                to={`/events/${event._id}`}
                                                className="flex items-center justify-center gap-2 w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 text-sm shadow-sm"
                                            >
                                                View Details <FaArrowRight className="text-xs" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-12 pb-8 border-t border-gray-200 bg-white text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center gap-2 mb-3">
                        <FaTicketAlt className="text-gray-900 text-2xl" />
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Eventora</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        The simplest, most dynamic way to manage, discover, and host world-class events in your local city.
                    </p>
                    <div className="text-xs text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;