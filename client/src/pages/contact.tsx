
// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Video } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-dark mb-4">Contact Our Experts</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get in touch with our team through any of the channels below. We're here to help with your sustainable concrete solutions.
        </p>
      </div>

      {/* Contact Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Phone Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <Phone className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">Phone</h3>
            <p className="text-gray-600 mb-4">Call us directly for immediate assistance</p>
            <a 
              href="tel:+15551234567" 
              className="text-accent hover:text-accent/80 font-semibold transition-colors duration-200"
            >
              (555) 123-4567
            </a>
          </CardContent>
        </Card>

        {/* Email Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <Mail className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">Email</h3>
            <p className="text-gray-600 mb-4">Send us detailed inquiries</p>
            <a 
              href="mailto:info@reconcrete.com" 
              className="text-accent hover:text-accent/80 font-semibold transition-colors duration-200"
            >
              info@reconcrete.com
            </a>
          </CardContent>
        </Card>

        {/* QQ Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <MessageCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">QQ</h3>
            <p className="text-gray-600 mb-4">Connect via QQ messenger</p>
            <span className="text-accent font-semibold">
              QQ: 123456789
            </span>
          </CardContent>
        </Card>

        {/* WeChat Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <Video className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">WeChat</h3>
            <p className="text-gray-600 mb-4">Chat with us on WeChat</p>
            <span className="text-accent font-semibold">
              WeChat: ReConcrete2024
            </span>
          </CardContent>
        </Card>

        {/* TikTok Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg" 
                alt="TikTok" 
                className="h-12 w-12 mx-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">TikTok</h3>
            <p className="text-gray-600 mb-4">Follow us for updates and tips</p>
            <a 
              href="https://v.douyin.com/Imkal4NiVNQ/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 font-semibold transition-colors duration-200"
            >
              @ReConcrete
            </a>
          </CardContent>
        </Card>

        {/* YouTube Contact */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-accent text-4xl mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
                alt="YouTube" 
                className="h-12 w-12 mx-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">YouTube</h3>
            <p className="text-gray-600 mb-4">Watch our educational content</p>
            <a 
              href="https://www.youtube.com/channel/UC4zdc1nB53ekKx4tj17EabA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 font-semibold transition-colors duration-200"
            >
              ReConcrete Channel
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="bg-gray-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-dark mb-4">Ready to Start Your Project?</h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Our team of experts is available to discuss your sustainable concrete needs. 
            Whether you're planning a small residential project or a large commercial development, 
            we have the experience and solutions to help you achieve your goals while minimizing environmental impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Business Hours:</strong><br />
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 4:00 PM
            </div>
            <div>
              <strong>Response Time:</strong><br />
              Email: Within 24 hours<br />
              Phone: Immediate during business hours
            </div>
            <div>
              <strong>Languages:</strong><br />
              English, Mandarin Chinese<br />
              Technical support available
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
