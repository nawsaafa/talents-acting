import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Talents Acting. We are here to help you discover talent or showcase your skills.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--color-neutral-900)] to-[var(--color-neutral-800)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="text-[var(--color-primary)]">Touch</span>
          </h1>
          <p className="text-xl text-[var(--color-neutral-300)] max-w-3xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-300)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-300)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-300)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-300)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="talent">Talent Registration</option>
                    <option value="casting">Casting Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-neutral-300)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-6">
                  Contact Information
                </h2>
                <p className="text-[var(--color-neutral-600)] mb-8">
                  Reach out to us through any of the following channels. Our team is ready to assist
                  you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Email</h3>
                    <p className="text-[var(--color-neutral-600)]">contact@talentsacting.ma</p>
                    <p className="text-[var(--color-neutral-600)]">support@talentsacting.ma</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Phone</h3>
                    <p className="text-[var(--color-neutral-600)]">+212 5XX-XXXXXX</p>
                    <p className="text-[var(--color-neutral-600)]">+212 6XX-XXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Address</h3>
                    <p className="text-[var(--color-neutral-600)]">Casablanca, Morocco</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">
                      Business Hours
                    </h3>
                    <p className="text-[var(--color-neutral-600)]">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-[var(--color-neutral-600)]">Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-[var(--color-neutral-50)] rounded-2xl p-6 mt-8">
                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-[var(--color-neutral-600)] mb-4">
                  Looking for quick answers? Check out our FAQ section for common questions about
                  talent registration, casting calls, and more.
                </p>
                <Link
                  href="/about"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Learn more about us &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
