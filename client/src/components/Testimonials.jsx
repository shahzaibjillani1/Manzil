import React from "react";
import { testimonials } from "../assets/assets";
import { Star, Quote, CheckCircle } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
            Guest Satisfaction
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Praised by Discerning Travelers
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Read verified reviews from guests who experienced authentic Manzil
            hospitality across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-500/20" />
                </div>

                <p className="text-gray-600 text-sm italic leading-relaxed mb-6">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.name}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-400">{item.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
