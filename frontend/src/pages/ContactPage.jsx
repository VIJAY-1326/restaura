import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Dining Inquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', subject: 'General Dining Inquiry', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Concierge Assistance</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-lightText dark:text-darkText">
          Connect with Restaura
        </h1>
        <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary">
          Inquiries regarding private tasting dinners, corporate catering, culinary questions, and dietary accommodations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <h2 className="font-serif font-bold text-xl text-lightText dark:text-darkText">
            Send an Inquiry to Our Sommelier & Kitchen
          </h2>

          {sent && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Thank you for contacting Restaura. Our dining concierge will respond within 4 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Your Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Elena Rostova"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patron@restaura.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Inquiry Topic
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              >
                <option value="General Dining Inquiry">General Dining Inquiry</option>
                <option value="Private Chef / Room Booking">Private Chef / Room Booking</option>
                <option value="Allergy & Dietary Customization">Allergy & Dietary Customization</option>
                <option value="Order Support & Feedback">Order Support & Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                Message & Special Requests
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your dining inquiry or requirements..."
                className="w-full p-3.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95"
            >
              <Send className="w-4 h-4" /> Transmit Inquiry
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
            <h2 className="font-serif font-bold text-xl text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-4">
              Concierge Desk & Coordinates
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brandViolet shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Main Establishment</h4>
                  <p className="text-lightTextSecondary dark:text-darkTextSecondary mt-0.5 leading-relaxed">
                    450 Epicurean Way, Gourmet District, San Francisco, CA 94107
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brandViolet shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Telephone Concierge</h4>
                  <p className="text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">
                    +1 (555) 234-5678 (Direct Kitchen Line)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brandViolet shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Executive Email</h4>
                  <p className="text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">
                    concierge@restaura.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brandViolet shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Operating Hours</h4>
                  <p className="text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">
                    Monday — Sunday: 11:00 AM – 11:00 PM PST
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl grad-violet-pink text-white space-y-3 shadow-glow-violet">
            <h3 className="font-serif font-bold text-lg">Private Dining Reservations</h3>
            <p className="text-xs leading-relaxed opacity-95">
              Looking to reserve our 14-seat cellar tasting salon for an exclusive private celebration? Call our head concierge directly at +1 (555) 234-5678 for bespoke sommelier pairings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
