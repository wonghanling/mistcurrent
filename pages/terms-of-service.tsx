import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - MistCurrent VPN</title>
        <meta name="description" content="MistCurrent VPN Terms of Service - Please read and agree to these terms before subscribing to our VPN service." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Terms of Service
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to MistCurrent. Please read and agree to the following terms before subscribing to our VPN service:
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                
                {/* Section 1 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    MistCurrent provides secure, encrypted virtual private network (VPN) services. 
                    This service operates on a subscription basis, supporting monthly, semi-annual, or annual subscriptions.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Subscription and Auto-Renewal</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your subscription will automatically renew at the end of each billing cycle unless you cancel 
                    at least 24 hours before the renewal date. Unless otherwise specified, you authorize us to charge 
                    your selected payment method.
                  </p>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cancellation and Refunds</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You may cancel your subscription at any time through your account dashboard. 
                    Since VPN service is an instantly delivered service, we do not provide refunds for 
                    unused portions once a billing cycle has begun.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may not use this service for any illegal purposes, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Hacking or cyber attacks</li>
                    <li>Distributing malware</li>
                    <li>Fraud or scamming</li>
                    <li>Sending spam emails</li>
                    <li>Copyright infringement</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    We reserve the right to suspend or terminate accounts upon discovery of violations.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Account Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You should safeguard your account login information. If you discover any unauthorized use, 
                    please notify us immediately.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    MistCurrent shall not be liable for any direct, indirect, incidental, or consequential 
                    damages arising from the use of this service.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Terms Modifications</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms of service at any time. 
                    Changes will be published on our official website and take effect immediately upon publication.
                  </p>
                </section>

              </div>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact our support team.
                </p>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;