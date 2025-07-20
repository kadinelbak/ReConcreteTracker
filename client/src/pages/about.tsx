
// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Factory, Truck, Zap, Brain, Handshake } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              🌍 Welcome to ReConcrete
            </h1>
            <p className="text-xl lg:text-2xl font-semibold mb-4">
              Rebuilding the World with Recycled Plastic
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
              ♻️ Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                At <strong>ReConcrete</strong>, our mission is simple:
              </p>
              <p className="text-2xl font-semibold text-accent mb-6">
                Turn today's plastic waste into tomorrow's foundation.
              </p>
              <p className="text-lg text-gray-700">
                We believe in a world where environmental protection and industrial progress go hand in hand. 
                That's why we've committed ourselves to manufacturing eco-friendly concrete products—by 
                transforming plastic trash into sustainable building materials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
              🧱 What We Do
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We take what the world throws away and turn it into something valuable. Our innovative, 
              AI-driven manufacturing system uses recycled plastics to create a range of concrete-based 
              construction materials.
            </p>
          </div>

          {/* Process Steps */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-dark text-center mb-8">♺ Our Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-accent text-4xl mb-4">
                    <Recycle className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3">1. Collect</h4>
                  <p className="text-gray-600 text-sm">
                    We gather plastic waste directly from individuals and businesses—charging for 
                    waste removal at competitive rates (as low as $500/ton).
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-accent text-4xl mb-4">
                    <Brain className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3">2. Sort</h4>
                  <p className="text-gray-600 text-sm">
                    Our robotic sorting system automates material separation, increasing efficiency 
                    and reducing labor costs.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-accent text-4xl mb-4">
                    <Factory className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3">3. Produce</h4>
                  <p className="text-gray-600 text-sm">
                    The sorted plastics are processed into eco-concrete and other non-structural 
                    construction materials using intelligent, energy-efficient machinery.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-accent text-4xl mb-4">
                    <Truck className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3">4. Deliver</h4>
                  <p className="text-gray-600 text-sm">
                    We supply concrete and panels to construction companies, landfill managers, 
                    and green infrastructure developers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
              🚧 Our Products
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Our product line is designed to address both environmental needs and construction demands:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-dark mb-3">Eco Concrete</h4>
                <p className="text-gray-600">Low-strength, cost-effective concrete using recycled plastic.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-dark mb-3">Insulation Panels</h4>
                <p className="text-gray-600">Lightweight and thermally efficient for eco-friendly buildings.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-dark mb-3">Façade & Riverbank Blocks</h4>
                <p className="text-gray-600">Aesthetic, durable non-load-bearing components.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-dark mb-3">Temporary Shelters</h4>
                <p className="text-gray-600">Fast-deploy, recyclable materials for disaster response or humanitarian efforts.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-neutral-dark mb-3">Landfill Infrastructure</h4>
                <p className="text-gray-600">Specialized concrete for private waste management companies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
              💡 Why Choose ReConcrete?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              We go beyond traditional recycling and concrete manufacturing with innovative tech, 
              sustainability, and circular thinking:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <strong>Dual Revenue Model:</strong> We get paid to collect trash and again to sell the product.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <strong>Solar-Powered Trash Trucks:</strong> Lower fuel cost, lower carbon footprint.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <strong>Robotic Sorting:</strong> No manual labor needed, reducing contamination and increasing precision.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <strong>Waste-to-Energy Integration:</strong> We harness landfill methane and steam turbines to power our plant and robots.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <strong>Smart Mixing Trucks:</strong> AI-optimized rotation control to reduce energy waste during transport.
              </div>
            </div>
          </div>

          <div className="text-center">
            <blockquote className="text-xl italic text-gray-700 mb-8">
              Our concrete isn't just green—it's <strong>smart</strong>, <strong>affordable</strong>, and <strong>future-ready</strong>.
            </blockquote>
          </div>
        </div>
      </div>

      {/* Market Opportunity Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
            📈 The Market Opportunity
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            The global construction materials market is growing <strong>~5% annually</strong>, and with 
            ever-increasing pressure to reduce plastic waste, our dual-purpose model is uniquely positioned 
            for scalable impact and profit.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            🤝 Let's Build Together
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Whether you're a construction firm, private landfill operator, or municipality seeking 
            a sustainable solution—we want to work with you. Join us in turning waste into infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Us
            </a>
            <a 
              href="/products" 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View Products
            </a>
          </div>
        </div>
      </div>

      {/* Learn More Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-dark mb-4">🔗 Learn More</h3>
          <p className="text-gray-700">
            Want a deeper dive into the science? Check out{" "}
            <a 
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11051361/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              this peer-reviewed article on recycled plastics in concrete
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
