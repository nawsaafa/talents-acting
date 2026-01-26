import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Talents Acting - the premier platform connecting Moroccan talent with the film industry.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--color-neutral-900)] to-[var(--color-neutral-800)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-[var(--color-primary)]">Talents Acting</span>
          </h1>
          <p className="text-xl text-[var(--color-neutral-300)] max-w-3xl mx-auto">
            Connecting Morocco&apos;s finest talent with the world&apos;s leading productions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[var(--color-neutral-600)] mb-4">
                Talents Acting is dedicated to showcasing the exceptional talent of Moroccan actors,
                comedians, and performers to casting directors and production companies worldwide.
              </p>
              <p className="text-lg text-[var(--color-neutral-600)]">
                We believe in creating opportunities for talented individuals to shine on both local
                and international stages, bridging the gap between artistic excellence and
                professional opportunity.
              </p>
            </div>
            <div className="bg-[var(--color-neutral-100)] rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Discover</h3>
                    <p className="text-[var(--color-neutral-600)]">
                      Find exceptional talent from Morocco
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Connect</h3>
                    <p className="text-[var(--color-neutral-600)]">
                      Direct communication with performers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Create</h3>
                    <p className="text-[var(--color-neutral-600)]">
                      Bring your productions to life
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--color-neutral-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)]">150+</div>
              <div className="text-[var(--color-neutral-600)] mt-2">Registered Talents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)]">50+</div>
              <div className="text-[var(--color-neutral-600)] mt-2">Productions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)]">98%</div>
              <div className="text-[var(--color-neutral-600)] mt-2">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)]">24/7</div>
              <div className="text-[var(--color-neutral-600)] mt-2">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-4">
            Our Commitment
          </h2>
          <p className="text-lg text-[var(--color-neutral-600)] max-w-3xl mx-auto mb-12">
            We are committed to providing a professional platform that respects and promotes the
            artistic integrity of every performer while meeting the high standards of the film and
            entertainment industry.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
          >
            Join Our Community
          </Link>
        </div>
      </section>
    </div>
  );
}
