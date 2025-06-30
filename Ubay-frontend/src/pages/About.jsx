import React from 'react';
import { ShoppingBag, Shield, Truck, Heart, Mail, Phone, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Curated Selection",
      description: "Quality products carefully selected for value and reliability."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer-First",
      description: "Your satisfaction is our promise with exceptional support."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "Industry-leading security protects your information."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10 px-4 bg-gradient-to-r from-orange-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ubay</h1>
          <p className="text-xl mb-6 opacity-90">Seamless Shopping, Anytime, Anywhere</p>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Where shopping meets simplicity. We're your gateway to quality products, 
            unbeatable deals, and exceptional service.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-6 text-orange-500">Our Story & Mission</h2>
            <p className="text-lg mb-6 opacity-90">
              Founded with a vision to revolutionize online shopping, Ubay believes everyone deserves 
              access to quality products at fair prices. We've created a streamlined experience that 
              gets you what you need, when you need it.
            </p>
            <p className="text-lg opacity-90">
              Our mission: Make online shopping effortless, trustworthy, and enjoyable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100">
                <div className="text-orange-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trust & Innovation</h3>
              <p className="text-gray-700">Building lasting relationships through transparency and continuously evolving our platform.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community & Excellence</h3>
              <p className="text-gray-700">We're a community working together, holding ourselves to the highest standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-orange-500">Get In Touch</h2>
          <p className="text-lg mb-10 opacity-90">
            Questions or feedback? Our customer service team is ready to help.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-500 bg-opacity-10 rounded-xl p-6 border border-orange-500 border-opacity-20">
              <Mail className="w-6 h-6 mx-auto mb-3 text-orange-500" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm opacity-90">support@ubay.com</p>
            </div>
            
            <div className="bg-orange-500 bg-opacity-10 rounded-xl p-6 border border-orange-500 border-opacity-20">
              <Phone className="w-6 h-6 mx-auto mb-3 text-orange-500" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-sm opacity-90">9800000000</p>
            </div>
            
            <div className="bg-orange-500 bg-opacity-10 rounded-xl p-6 border border-orange-500 border-opacity-20">
              <MessageCircle className="w-6 h-6 mx-auto mb-3 text-orange-500" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm opacity-90">Available 24/7</p>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-700">
            <p className="opacity-90 italic">Thank you for choosing Ubay. Happy shopping!</p>
          </div>
        </div>
      </section>
    </div>
  );
}