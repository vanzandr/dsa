import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-20">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl font-bold mb-6">Rent Your Perfect Car Today</h1>
            <p className="text-gray-600 text-lg mb-8">
              Choose from our wide selection of vehicles for any occasion. Easy booking, flexible pickup, and
              competitive rates.
            </p>
            <Link
              to="/browse-cars"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            >
              Browse Cars <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80"
              alt="Luxury car"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose PahiramCar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a premium car rental experience with a focus on quality, convenience, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-2xl font-bold mb-4">Wide Selection</div>
              <p className="text-gray-600">
                Choose from our diverse fleet of vehicles, from economy cars to luxury SUVs, to find the perfect match
                for your needs.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-2xl font-bold mb-4">Flexible Rentals</div>
              <p className="text-gray-600">
                Enjoy flexible rental periods, from daily to monthly, with competitive rates and transparent pricing.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-2xl font-bold mb-4">Quality Service</div>
              <p className="text-gray-600">
                Experience exceptional customer service from our dedicated team, committed to making your rental
                experience seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Renting a car with PahiramCar is quick and easy. Follow these simple steps to get on the road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Browse</h3>
              <p className="text-gray-600">
                Explore our wide selection of vehicles and choose the one that fits your needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Reserve</h3>
              <p className="text-gray-600">Select your pickup and return dates and reserve your vehicle.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm</h3>
              <p className="text-gray-600">
                Complete your booking by providing your details and confirming your reservation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy</h3>
              <p className="text-gray-600">Pick up your car and enjoy your journey with peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Cars</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out some of our most popular rental vehicles, perfect for any occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2070"
                alt="Honda Civic"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Honda Civic</h3>
                <p className="text-gray-600 mb-4">Comfortable sedan with excellent fuel efficiency.</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₱4,200/day</span>
                  <Link to="/browse-cars" className="text-black hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&q=80&w=2070"
                alt="Ford Explorer"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Ford Explorer</h3>
                <p className="text-gray-600 mb-4">Spacious SUV perfect for family trips and adventures.</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₱6,500/day</span>
                  <Link to="/browse-cars" className="text-black hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070"
                alt="Mazda 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mazda 3</h3>
                <p className="text-gray-600 mb-4">Stylish hatchback with sporty handling and modern features.</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₱4,800/day</span>
                  <Link to="/browse-cars" className="text-black hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/browse-cars"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            >
              View All Cars <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experience
              with PahiramCar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">Maria Santos</h3>
                  <p className="text-gray-600 text-sm">Manila</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The car was in perfect condition and the rental process was so smooth. I'll definitely be using
                PahiramCar for all my future trips!"
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/150?img=8" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">Juan Reyes</h3>
                  <p className="text-gray-600 text-sm">Quezon City</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Excellent service and very reasonable prices. The staff was friendly and helpful. I highly recommend
                PahiramCar to anyone looking for a reliable rental."
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/150?img=5" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">Ana Lim</h3>
                  <p className="text-gray-600 text-sm">Makati</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I needed a car for a business trip and PahiramCar made it so easy. The online booking system is
                user-friendly and the car was exactly what I needed."
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Browse our selection of quality vehicles and book your perfect car today.
          </p>
          <Link
            to="/browse-cars"
            className="inline-flex items-center bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100"
          >
            View Available Cars <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
