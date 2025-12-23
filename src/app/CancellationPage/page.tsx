import Navbar from '@/components/home/Navbar';

import SectionHeader from '@/components/shared/SectionHeader';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Legal"
              title="Cancellation Policy"
              subtitle="Last updated: January 2025"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-grey/10 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-base mb-2">24+ Hours</h3>
              <p className="text-grey text-sm">100% refund</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-grey/10 text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-base mb-2">6-24 Hours</h3>
              <p className="text-grey text-sm">50% refund</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-grey/10 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-dark-base mb-2">Less than 6 Hours</h3>
              <p className="text-grey text-sm">No refund</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 border border-grey/10">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">Cancellation Terms</h2>
                <p className="text-grey leading-relaxed mb-4">
                  At The Drive Hub, we understand that plans can change. Our cancellation policy is designed to be fair to both our customers and vehicle providers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">1. Free Cancellation</h2>
                <p className="text-grey leading-relaxed mb-4">
                  You can cancel your booking free of charge if you cancel more than 24 hours before the scheduled pickup time. You will receive a full refund of the rental amount. The refund will be processed to your original payment method within 5-7 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">2. Partial Refund</h2>
                <p className="text-grey leading-relaxed mb-4">
                  If you cancel between 6 and 24 hours before pickup, you will receive a 50% refund of the total rental amount. This helps cover the costs incurred by the vehicle provider for holding the vehicle for you.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">3. No Refund</h2>
                <p className="text-grey leading-relaxed mb-4">
                  Cancellations made less than 6 hours before pickup or no-shows are not eligible for any refund. The full rental amount will be charged.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">4. How to Cancel</h2>
                <p className="text-grey leading-relaxed mb-4">
                  To cancel your booking:
                </p>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>Log in to your account</li>
                  <li>Go to &quot;My Bookings&quot;</li>
                  <li>Select the booking you wish to cancel</li>
                  <li>Click &quot;Cancel Booking&quot; and confirm</li>
                </ul>
                <p className="text-grey leading-relaxed mb-4">
                  Alternatively, you can contact our support team at +971 4 123 4567 or support@thedrivehub.ae
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">5. Modification of Bookings</h2>
                <p className="text-grey leading-relaxed mb-4">
                  You can modify your booking (change dates, vehicle, or pickup location) free of charge up to 24 hours before pickup, subject to availability. Modifications made within 24 hours may be subject to availability and additional charges.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">6. Early Returns</h2>
                <p className="text-grey leading-relaxed mb-4">
                  If you return the vehicle earlier than the agreed return date, no refund will be provided for the unused days. However, you may be able to modify your booking in advance if you know you&apos;ll need the vehicle for a shorter period.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">7. Provider Cancellations</h2>
                <p className="text-grey leading-relaxed mb-4">
                  In the rare event that the vehicle provider cancels your booking, you will receive a full refund immediately. We will also help you find an alternative vehicle at the same or better rate.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">8. Force Majeure</h2>
                <p className="text-grey leading-relaxed mb-4">
                  In cases of force majeure (natural disasters, government restrictions, etc.), special cancellation terms may apply. Please contact our support team for assistance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">9. Refund Processing</h2>
                <p className="text-grey leading-relaxed mb-4">
                  Refunds are processed to the original payment method within 5-7 business days. The time it takes for the refund to appear in your account may vary depending on your bank or credit card provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark-base mb-4">Questions?</h2>
                <p className="text-grey leading-relaxed mb-4">
                  If you have questions about our cancellation policy or need assistance with a cancellation, please contact us:
                </p>
                <p className="text-grey">
                  Email: info@thedrivehub.ae<br />
                  Phone: +971 564727007<br />
                  Hours: 24/7
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
