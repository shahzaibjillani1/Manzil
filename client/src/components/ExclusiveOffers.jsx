import React from 'react';
import { useNavigate } from 'react-router-dom';
import { exclusiveOffers } from '../assets/assets';
import { Tag, Sparkles, Clock, ArrowRight } from 'lucide-react';

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  return (
    <section id="offers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Limited Availability Offers</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900">
            Exclusive Seasonal Packages
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Take advantage of privileged rates, complimentary culinary experiences, and extended luxury stays.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {exclusiveOffers.map((offer) => (
            <div
              key={offer._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold shadow-md">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{offer.priceOff}% OFF</span>
                </div>

                {/* Expiry Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Valid until {offer.expiryDate}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600">
                    Complimentary Cancellation
                  </span>
                  <button
                    onClick={() => navigate('/rooms')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-900 group-hover:text-amber-600 transition"
                  >
                    <span>Claim Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExclusiveOffers;
