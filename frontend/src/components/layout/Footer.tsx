import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About FYP Buddy</h3>
            <p className="text-sm text-gray-600 mb-4">
              An AI-powered platform that connects computer science students with compatible 
              partners for Final Year Projects based on interests, skills, and project compatibility.
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 mx-1" />
              <span>for NU students</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@nu.edu.pk" className="hover:text-primary-600">
                  support@nu.edu.pk
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <a href="tel:+92-21-1234567" className="hover:text-primary-600">
                  +92-21-1234567
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>FAST-NU Karachi Campus</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-gray-600 hover:text-primary-600">
                How It Works
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary-600">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary-600">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary-600">
                FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">
              © 2024 FYP Buddy. All rights reserved. Built for FAST-NU students.
            </p>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-xs text-gray-500">
              <span>API v1.0.0</span>
              <span>•</span>
              <span>React v18</span>
              <span>•</span>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;