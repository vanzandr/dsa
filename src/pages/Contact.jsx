import { MapPin, Phone, Facebook, Mail, MessageSquare, Clock, HelpCircle } from "lucide-react"

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Contact our friendly team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're here to help with any questions about our car rental services. Reach out to us through any of the
            channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Visit us */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <MapPin className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visit us</h3>
            <p className="text-gray-600 text-sm mb-3">123 Main Street, Makati City, Metro Manila, Philippines 1200</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:underline"
            >
              View on Google Maps
            </a>
          </div>

          {/* Call us */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <Phone className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Call us</h3>
            <p className="text-gray-600 text-sm mb-3">Mon-Fri from 8am to 5pm. Sat from 9am to 1pm.</p>
            <a href="tel:639-123-456-7869" className="text-sm text-black hover:underline block mb-2">
              +63 912 345 6789 (Main)
            </a>
            <a href="tel:639-987-654-3210" className="text-sm text-black hover:underline">
              +63 998 765 4321 (Support)
            </a>
          </div>

          {/* Message us */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <Facebook className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Message us</h3>
            <p className="text-gray-600 text-sm mb-3">Connect with us on social media for updates and promotions.</p>
            <a
              href="https://facebook.com/PahiramCar.Official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:underline block mb-2"
            >
              Facebook: PahiramCar.Official
            </a>
            <a
              href="https://instagram.com/PahiramCar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:underline"
            >
              Instagram: @PahiramCar
            </a>
          </div>

          {/* Email us */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <Mail className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email us</h3>
            <p className="text-gray-600 text-sm mb-3">Send us an email and we'll get back to you within 24 hours.</p>
            <a href="mailto:info@pahiramcar.com" className="text-sm text-black hover:underline block mb-2">
              info@pahiramcar.com (General)
            </a>
            <a href="mailto:support@pahiramcar.com" className="text-sm text-black hover:underline">
              support@pahiramcar.com (Support)
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                  placeholder="Reservation Inquiry"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="submit" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Locations</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802548850011!2d121.04882931744384!3d14.55436999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8efd99aad53%3A0xb64b39847a866fde!2sMakati%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1651234567890!5m2!1sen!2sph"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PahiramCar Location"
              ></iframe>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Main Office - Makati</h3>
                  <p className="text-gray-600 text-sm">123 Main Street, Makati City, Metro Manila, Philippines 1200</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Quezon City Branch</h3>
                  <p className="text-gray-600 text-sm">
                    456 Commonwealth Avenue, Quezon City, Metro Manila, Philippines 1121
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Cebu Branch</h3>
                  <p className="text-gray-600 text-sm">789 Osmena Boulevard, Cebu City, Cebu, Philippines 6000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold">Business Hours</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 1:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
              <li className="flex justify-between">
                <span>Holidays:</span>
                <span>10:00 AM - 12:00 PM</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <HelpCircle className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  What documents do I need to rent a car?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How do I make a reservation?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  What is your cancellation policy?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Do you offer airport pickup?
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  View all FAQs
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold">Customer Support</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our customer support team is available to assist you with any questions or concerns you may have about our
              services.
            </p>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-gray-600">+63 998 765 4321</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-gray-600">support@pahiramcar.com</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">
              Don't just take our word for it. Here's what our customers have to say about our service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="text-gray-600 italic mb-4">
                "The car was in perfect condition and the rental process was so smooth. I'll definitely be using
                PahiramCar for all my future trips!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Maria Santos</h4>
                  <p className="text-gray-600 text-sm">Manila</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="text-gray-600 italic mb-4">
                "Excellent service and very reasonable prices. The staff was friendly and helpful. I highly recommend
                PahiramCar to anyone looking for a reliable rental."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src="https://i.pravatar.cc/150?img=8" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Juan Reyes</h4>
                  <p className="text-gray-600 text-sm">Quezon City</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="text-gray-600 italic mb-4">
                "I needed a car for a business trip and PahiramCar made it so easy. The online booking system is
                user-friendly and the car was exactly what I needed."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src="https://i.pravatar.cc/150?img=5" alt="Customer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Ana Lim</h4>
                  <p className="text-gray-600 text-sm">Makati</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-black text-white p-10 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to rent a car?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Browse our selection of quality vehicles and book your perfect car today. Our team is ready to assist you
            with any questions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/browse-cars" className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100">
              Browse Cars
            </a>
            <a
              href="tel:639-123-456-7869"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
