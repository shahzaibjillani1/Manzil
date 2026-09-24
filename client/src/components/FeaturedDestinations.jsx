import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';

const destinations = [
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    count: 'Pristine Coastal Luxury & Palm Resorts',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
    tag: 'Skyline & Oasis',
  },
  {
    city: 'New York',
    country: 'United States',
    count: 'Manhattan Suites & Skyline Penthouses',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800',
    tag: 'Metropolitan Elegance',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    count: 'Waterfront Sanctuaries & Infinity Pools',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800',
    tag: 'Futuristic Haven',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    count: 'Mayfair Palaces & Historic Residences',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    tag: 'Timeless British Charm',
  },
  {
    city: 'Paris',
    country: 'France',
    count: 'Chic Parisian Suites & Balcony Views',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    tag: 'Romantic City of Light',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    count: 'Jungle Sanctuary Villas & Private Pools',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800',
    tag: 'Tropical Serenity',
  },
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  return (
    <section id="destinations" className="py-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
              Global Sanctuaries
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Explore Iconic Destinations
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-md mt-3 md:mt-0">
            Handpicked metropolitan landmarks and secluded tropical paradises vetted for unparalleled service and bespoke guest comfort.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/rooms?city=${encodeURIComponent(dest.city)}`)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Tag pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {dest.tag}
                </span>
              </div>

              {/* Action arrow button */}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-amber-500 group-hover:text-white transition-all transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Destination details */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dest.country}</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold mb-1 group-hover:text-amber-300 transition-colors">
                  {dest.city}
                </h3>
                <p className="text-xs text-gray-300">{dest.count}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedDestinations;
