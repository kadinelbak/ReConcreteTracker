// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Recycle, Factory, Handshake, Phone, Mail, MapPin } from "lucide-react";
import VideoUpload from "@/components/video-upload";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative hero-gradient">
        <div className="absolute inset-0 sustainable-pattern"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Building a <span className="text-accent">Sustainable</span> Future
              </h1>
              <p className="text-xl mb-8 text-gray-100 leading-relaxed">
                Transform waste into strong, eco-friendly concrete solutions. 
                ReConcrete pioneers sustainable construction through innovative recycled materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                    <Leaf className="h-5 w-5 mr-2" />
                    View Products
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-gray-900 hover:bg-white hover:!text-gray-900"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://www.youtube.com/channel/UC4zdc1nB53ekKx4tj17EabA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-accent transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
                    alt="YouTube" 
                    className="h-4 w-4 mr-2"
                  />
                  YouTube Channel
                </a>
                <a 
                  href="https://v.douyin.com/Imkal4NiVNQ/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-accent transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg" 
                    alt="TikTok" 
                    className="h-4 w-4 mr-2"
                  />
                  TikTok
                </a>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Sustainable construction with recycling practices" 
                  className="rounded-xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <VideoUpload />

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              Why Choose ReConcrete?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leading the construction industry toward a more sustainable future through innovation and responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-accent text-4xl mb-4">
                  <Recycle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-3">100% Recyclable</h3>
                <p className="text-gray-600">
                  Our concrete solutions incorporate recycled plastics, reducing waste and environmental impact while maintaining structural integrity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-accent text-4xl mb-4">
                  <Factory className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-3">Factory Approved</h3>
                <p className="text-gray-600">
                  Trusted by construction companies and municipalities for meeting all safety standards while promoting sustainability goals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-accent text-4xl mb-4">
                  <Handshake className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-3">Full Service</h3>
                <p className="text-gray-600">
                  From material supply to waste management services, we provide comprehensive solutions for your sustainable construction needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Recycle className="text-accent mr-2 h-6 w-6" />
                ReConcrete
              </h3>
              <p className="text-gray-300 mb-4">
                Building a sustainable future through innovative recycled concrete solutions.
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://www.youtube.com/channel/UC4zdc1nB53ekKx4tj17EabA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
                    alt="YouTube" 
                    className="h-4 w-4 mr-2"
                  />
                  YouTube Channel
                </a>
                <a 
                  href="https://v.douyin.com/Imkal4NiVNQ/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg" 
                    alt="TikTok" 
                    className="h-4 w-4 mr-2"
                  />
                  TikTok
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-accent" />
                  +86 13792090331
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-accent" />
                  zhangboyang200803@gmail.com
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  123 Green St, Eco City
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReConcrete. All rights reserved. Building a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
