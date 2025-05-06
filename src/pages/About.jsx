import TeamSection from "../components/TeamSection"
import { CheckCircle, Award, Clock, Shield } from "lucide-react"

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">About PahiramCar Rental</h1>
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                        A premier car rental service dedicated to providing exceptional vehicles and customer experiences since
                        2015.
                    </p>
                </div>

                {/* Company Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            PahiramCar was founded in 2015 with a simple mission: to provide high-quality, reliable, and affordable
                            car rental services to the Filipino community. What started as a small fleet of just five vehicles has now
                            grown into one of the most trusted car rental services in the Philippines.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Our founder, Miguel Santos, recognized the need for a car rental service that prioritized customer
                            satisfaction and vehicle quality above all else. This vision has guided our growth and development over
                            the years.
                        </p>
                        <p className="text-gray-600">
                            Today, PahiramCar operates in multiple locations across the Philippines, serving thousands of satisfied
                            customers each year. We continue to expand our fleet and improve our services to meet the evolving needs
                            of our clients.
                        </p>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=2070"
                            alt="Car fleet"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Mission and Values */}
                <div className="bg-white rounded-lg shadow-sm p-10 mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            At PahiramCar, we're driven by a set of core values that guide everything we do. Our mission is to provide
                            convenient, reliable, and affordable car rental services that meet the diverse needs of our customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality</h3>
                            <p className="text-gray-600">
                                We maintain the highest standards for our vehicles and services, ensuring a premium experience for every
                                customer.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Excellence</h3>
                            <p className="text-gray-600">
                                We strive for excellence in every aspect of our business, from customer service to vehicle maintenance.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Reliability</h3>
                            <p className="text-gray-600">
                                We are committed to being reliable and dependable, ensuring our customers can count on us when they need
                                us.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Safety</h3>
                            <p className="text-gray-600">
                                We prioritize the safety of our customers by maintaining our vehicles to the highest standards.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Why Choose PahiramCar?</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            We offer a wide range of vehicles, from compact cars to SUVs, ensuring that you find the perfect fit for
                            your needs. Our fleet is regularly maintained and inspected to guarantee safety and reliability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Diverse Fleet</h3>
                            <p className="text-gray-600">
                                We offer a wide selection of vehicles to meet every need and budget, from economy cars to luxury SUVs.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Competitive Pricing</h3>
                            <p className="text-gray-600">
                                Our transparent pricing ensures you get the best value for your money, with no hidden fees or surprises.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Exceptional Service</h3>
                            <p className="text-gray-600">
                                Our dedicated team is committed to providing personalized service and ensuring your rental experience is
                                seamless.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Convenient Locations</h3>
                            <p className="text-gray-600">
                                With multiple locations across the Philippines, we make it easy to pick up and drop off your rental car.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Flexible Rental Options</h3>
                            <p className="text-gray-600">
                                Whether you need a car for a day, a week, or a month, we offer flexible rental periods to suit your
                                schedule.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
                            <p className="text-gray-600">
                                Our customer support team is available around the clock to assist you with any questions or concerns.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <TeamSection />
            </div>
        </div>
    )
}
