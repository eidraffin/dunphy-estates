// app/about/page.tsx
import React from 'react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-orange-600 text-center mb-6">About Dunphy Estates</h1>
      
      <p className="mt-4 text-lg text-gray-800">
        Welcome to Dunphy Estates, where your property dreams come to life! 
        We are more than just a real estate agency; we are your trusted partners 
        in navigating the complex world of real estate. Our commitment to excellence 
        is reflected in every interaction, ensuring that our clients receive the 
        highest level of service tailored to their unique needs.
      </p>

      <h2 className="text-3xl font-semibold text-orange-500 mt-8 mb-4">Our Mission</h2>
      <p className="mt-4 text-lg text-gray-800">
        Our mission at Dunphy Estates is simple: to empower individuals and families 
        in making informed real estate decisions. We believe that everyone deserves 
        a place they can call home, and we are here to turn that dream into reality. 
        With our extensive market knowledge and a keen understanding of our clients' 
        aspirations, we aim to provide a seamless and enjoyable experience from start to finish.
      </p>

      <h2 className="text-3xl font-semibold text-orange-500 mt-8 mb-4">Our Values</h2>
      <p className="mt-4 text-lg text-gray-800">
        At the core of our operations are our values, which guide us in everything we do:
      </p>
      <ul className="list-disc list-inside mt-4 text-lg text-gray-800">
        <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
        <li><strong>Customer Focus:</strong> Our clients are at the heart of everything we do.</li>
        <li><strong>Excellence:</strong> We strive for the highest standards in service delivery.</li>
        <li><strong>Innovation:</strong> We embrace new ideas and technologies to better serve our clients.</li>
      </ul>

      <h2 className="text-3xl font-semibold text-orange-500 mt-8 mb-4">Our Team</h2>
      <p className="mt-4 text-lg text-gray-800">
        Our team consists of passionate real estate professionals who are dedicated 
        to helping you find the perfect property. With a wealth of experience and a 
        deep understanding of the market, we are equipped to offer personalized 
        guidance to meet your specific needs. We pride ourselves on building long-lasting 
        relationships with our clients, based on trust, respect, and open communication.
      </p>

      <h2 className="text-3xl font-semibold text-orange-500 mt-8 mb-4">Get in Touch</h2>
      <p className="mt-4 text-lg text-gray-800">
        Ready to start your journey with us? Reach out today, and let us help you 
        navigate the exciting world of real estate. Together, we can make your 
        property dreams a reality!
      </p>
    </div>
  );
}
