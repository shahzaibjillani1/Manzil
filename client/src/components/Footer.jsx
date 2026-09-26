import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to our luxury travel dispatches!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/80">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair text-2xl font-bold tracking-tight text-white">
                  Manzil<span className="text-amber-500">.</span>
                </span>
                <span className="text-sm font-semibold text-amber-500">
                  منزل
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Curating authentic luxury stays and mountain retreats across Pakistan. From the Margalla Hills to the high peaks of Hunza, experience warm Pakistani hospitality.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Pakistan's Premier Hospitality Engine
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms?city=Islamabad" className="hover:text-amber-400 transition-colors">
                  Islamabad Hotels
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Lahore" className="hover:text-amber-400 transition-colors">
                  Lahore Heritage
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Karachi" className="hover:text-amber-400 transition-colors">
                  Karachi Seaside
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Murree" className="hover:text-amber-400 transition-colors">
                  Murree Hills
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Swat" className="hover:text-amber-400 transition-colors">
                  Swat Valley
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Hunza" className="hover:text-amber-400 transition-colors">
                  Hunza Lodges
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition-colors">
                  All Rooms & Suites
                </Link>
              </li>
              <li>
                <a href="#offers" className="hover:text-amber-400 transition-colors">
                  Promotions & Deals
                </a>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">
                  Reservation Lookup
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
                  Host Management Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Private Newsletter
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Receive secret seasonal rates and invitation-only suite previews.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription confirmed. Check your inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Manzil Hospitality Group (Pvt.) Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Concurrency Guarded</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
            <span>•</span>
            <span>REST API Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
