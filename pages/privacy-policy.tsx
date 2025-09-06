import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - MistCurrent VPN</title>
        <meta name="description" content="MistCurrent VPN Privacy Policy - We highly value your privacy and protect your personal information." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Privacy Policy
                </h1>
                <p className="text-lg text-gray-600">
                  We highly value your privacy. This Privacy Policy explains how MistCurrent collects, uses, and protects your information.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                
                {/* Section 1 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information Collection</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We only collect the minimum information necessary to provide our services, including your email address, 
                    subscription information, and payment information processed through third-party payment gateways 
                    (such as Stripe or Airwallex). We do not log user activities, connection times, or browsing data.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Usage</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use your information solely for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Managing your account and subscription services</li>
                    <li>Processing payments</li>
                    <li>Sending service-related notifications</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We employ industry-standard encryption and security measures to protect your information. 
                    All sensitive payment information is securely processed through third-party gateways 
                    (such as Stripe, Airwallex) and is not stored on our servers.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No-Logs Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    MistCurrent follows a strict "no-logs" policy. We do not track or store your IP addresses, 
                    DNS queries, browsing history, or bandwidth usage data.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Sharing</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell, rent, or use your personal information for third-party marketing purposes.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your data only for the period necessary to fulfill legal obligations and provide services. 
                    After you cancel your subscription, your personal data will be securely deleted or anonymized.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You have the right to access, correct, or delete your personal information at any time. 
                    You can contact us through our customer support team.
                  </p>
                </section>

              </div>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact our support team.
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

export default PrivacyPolicy;

// 阻止静态预渲染，解决SSR构建错误
export async function getServerSideProps() {
  return { props: {} };
}