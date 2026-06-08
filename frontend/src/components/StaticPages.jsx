import React from 'react';

const PageLayout = ({ title, children }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-8 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">{title}</h1>
      </div>
      <div className="p-8 md:p-12 text-slate-300 space-y-6 text-lg leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const AboutUs = () => (
  <PageLayout title="About Us">
    <p>Welcome to BookMyVenue! We are dedicated to connecting people with the perfect spaces for their events.</p>
    <p>Founded with the vision to modernize event planning, our mission is to make venue discovery and booking as seamless as possible, providing a premium experience for both guests and hosts.</p>
    <p>Whether you're looking for a cozy studio, a grand banquet hall, or an exclusive corporate space, we have carefully curated the best venues to meet your needs.</p>
  </PageLayout>
);

export const Careers = () => (
  <PageLayout title="Careers">
    <p>Join our team of passionate individuals dedicated to revolutionizing the event space industry.</p>
    <p>We are currently looking for talented software engineers, creative UI/UX designers, and dedicated customer success managers who share our vision.</p>
    <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-slate-100 mb-2">Open Positions</h3>
      <p className="text-slate-400 italic">No open positions at this moment. Check back soon!</p>
    </div>
  </PageLayout>
);

export const Press = () => (
  <PageLayout title="Press">
    <p>For press inquiries, media features, or interview requests, please contact our media relations team at <span className="text-indigo-400 font-medium">press@bookmyvenue.com</span>.</p>
    <p>Download our official press kit for high-resolution logos, brand assets, and comprehensive company background information.</p>
    <button className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-700">
      Download Press Kit
    </button>
  </PageLayout>
);

export const PartnerWithUs = () => (
  <PageLayout title="Partner with Us">
    <p>Do you own an exceptional venue? Partner with BookMyVenue to reach thousands of potential customers searching for the perfect space.</p>
    <p>We offer highly competitive rates, a dedicated state-of-the-art partner dashboard, and 24/7 dedicated support.</p>
    <p>Join our network today and maximize your venue's earning potential.</p>
  </PageLayout>
);

export const HelpCenter = () => (
  <PageLayout title="Help Center">
    <p>Need assistance? Our Help Center is designed to guide you through the booking process, managing your listings, and resolving any issues.</p>
    <p>Browse our extensive FAQ library below or reach out to our support team directly for personalized help.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition-colors">
        <h4 className="font-bold text-slate-100">Guest Support</h4>
        <p className="text-sm text-slate-400 mt-2">Help with booking and payments</p>
      </div>
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition-colors">
        <h4 className="font-bold text-slate-100">Partner Support</h4>
        <p className="text-sm text-slate-400 mt-2">Help with listings and payout</p>
      </div>
    </div>
  </PageLayout>
);

export const ContactUs = () => (
  <PageLayout title="Contact Us">
    <p>We'd love to hear from you! Whether you have a question about a reservation, need technical support, or just want to say hi, our team is ready to help.</p>
    <ul className="list-none space-y-4 mt-6">
      <li className="flex items-center">
        <span className="w-10 h-10 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mr-4">📧</span>
        <span className="text-slate-300">support@bookmyvenue.com</span>
      </li>
      <li className="flex items-center">
        <span className="w-10 h-10 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mr-4">📞</span>
        <span className="text-slate-300">1-800-BOOK-VENUE</span>
      </li>
      <li className="flex items-center">
        <span className="w-10 h-10 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mr-4">🏢</span>
        <span className="text-slate-300">123 Event Plaza, Suite 100, New York, NY 10001</span>
      </li>
    </ul>
  </PageLayout>
);

export const PrivacyPolicy = () => (
  <PageLayout title="Privacy Policy">
    <p>Your privacy is of utmost importance to us. This Privacy Policy strictly outlines how we collect, use, and protect your personal and financial information.</p>
    <p>We employ industry-leading security measures, advanced encryption, and never share your data with unauthorized third parties or data brokers.</p>
    <p className="text-sm text-slate-500 mt-8">Last Updated: June 2026</p>
  </PageLayout>
);

export const TermsOfService = () => (
  <PageLayout title="Terms of Service">
    <p>By using BookMyVenue, you agree to our comprehensive Terms of Service. These terms govern your use of our platform, the booking process, user conduct, and payment handling.</p>
    <p>Please read these terms carefully before making a reservation or listing a venue on our platform to ensure a safe and reliable community for everyone.</p>
    <p className="text-sm text-slate-500 mt-8">Last Updated: June 2026</p>
  </PageLayout>
);
