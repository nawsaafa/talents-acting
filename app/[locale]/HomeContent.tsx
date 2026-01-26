'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/i18n';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  Search,
  UserPlus,
  Star,
  Users,
  Shield,
  Eye,
  Play,
  Sparkles,
  Camera,
  ArrowRight,
} from 'lucide-react';

// Featured talent images from Unsplash
const featuredTalents = [
  {
    id: 1,
    name: 'Sarah Amrani',
    role: 'Actrice',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Youssef Bennani',
    role: 'Acteur',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Leila Fassi',
    role: 'Mannequin',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Karim Idrissi',
    role: 'Acteur',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Nadia Tazi',
    role: 'Actrice',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face',
  },
  {
    id: 6,
    name: 'Omar Alaoui',
    role: 'Figurant',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
  },
];

export function HomeContent({ talentCount }: { talentCount: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--color-black)] min-h-screen">
      {/* Hero Section - Cinematic with Background Image */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop"
            alt="Film set background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-black)] via-[var(--color-black)]/80 to-transparent" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent" />
          {/* Gold tint overlay */}
          <div className="absolute inset-0 bg-[var(--color-gold)]/5 mix-blend-overlay" />
        </div>

        {/* Film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-black)]/60 backdrop-blur-md animate-fade-in">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-pulse" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {talentCount > 0 ? `${talentCount} talents disponibles` : 'Plateforme Premium'}
                  </span>
                </span>
                <Sparkles size={14} className="text-[var(--color-gold)]" />
              </div>

              {/* Main headline */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="text-[var(--color-text-primary)]">Découvrez les</span>
                <br />
                <span className="text-gold-gradient">Talents</span>
                <br />
                <span className="text-[var(--color-text-primary)]">du Maroc</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-xl text-[var(--color-text-secondary)] max-w-lg leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                La plateforme de référence pour les acteurs, mannequins et artistes marocains.
                Connectez-vous avec les meilleures productions.
              </p>

              {/* CTA buttons */}
              <div
                className="flex flex-wrap gap-4 animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Link href="/talents">
                  <Button size="lg" showArrow leftIcon={<Search size={20} />}>
                    Explorer les Talents
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" showArrow leftIcon={<UserPlus size={20} />}>
                    Rejoindre
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div
                className="flex gap-8 pt-8 border-t border-[var(--color-gold)]/20 animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                {[
                  { value: talentCount > 0 ? talentCount.toString() : '150+', label: 'Talents' },
                  { value: '50+', label: 'Productions' },
                  { value: '98%', label: 'Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-medium text-[var(--color-gold)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual - Hero Image Composition */}
            <div
              className="hidden lg:block relative h-[600px] animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              {/* Main featured image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[420px] rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--color-gold)]/30">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"
                  alt="Featured talent"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-lg font-medium text-white">Sarah Amrani</div>
                  <div className="text-sm text-[var(--color-gold)]">Actrice</div>
                </div>
              </div>

              {/* Floating secondary images */}
              <div
                className="absolute top-[5%] right-[5%] w-[140px] h-[180px] rounded-lg overflow-hidden shadow-xl border border-[var(--color-gold)]/20 animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&crop=face"
                  alt="Talent"
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className="absolute bottom-[10%] left-[0%] w-[120px] h-[150px] rounded-lg overflow-hidden shadow-xl border border-[var(--color-gold)]/20 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=face"
                  alt="Talent"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Play button overlay */}
              <div
                className="absolute top-[15%] left-[15%] w-16 h-16 bg-[var(--color-gold)] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(201,162,39,0.5)] animate-float cursor-pointer hover:scale-110 transition-transform"
                style={{ animationDelay: '1.5s' }}
              >
                <Play size={28} className="text-[var(--color-black)] ml-1" />
              </div>

              {/* Decorative elements */}
              <div
                className="absolute bottom-[25%] right-[0%] w-20 h-20 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-xl border border-[var(--color-gold)]/20 flex items-center justify-center animate-float"
                style={{ animationDelay: '2s' }}
              >
                <Camera size={32} className="text-[var(--color-gold)]" />
              </div>
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent" />
        </div>
      </section>

      {/* Featured Talents Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)] via-[var(--color-charcoal)] to-[var(--color-black)]" />

        <Container className="relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-sm text-[var(--color-gold)] uppercase tracking-[0.3em] mb-4 block">
                Nos Talents
              </span>
              <h2 className="text-4xl md:text-5xl font-medium text-[var(--color-text-primary)]">
                Talents <span className="text-gold-gradient">Vedettes</span>
              </h2>
            </div>
            <Link href="/talents">
              <Button variant="outline" showArrow>
                Voir Tous les Talents
              </Button>
            </Link>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {featuredTalents.map((talent, index) => (
              <Link
                key={talent.id}
                href={`/talents/${talent.id}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] rounded-lg transition-colors duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-sm font-medium text-white">{talent.name}</div>
                  <div className="text-xs text-[var(--color-gold)]">{talent.role}</div>
                </div>

                {/* View icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-[var(--color-gold)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500">
                  <ArrowRight size={16} className="text-[var(--color-black)]" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Behind the Scenes Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=800&fit=crop"
            alt="Film production"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-black)]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-black)] via-transparent to-[var(--color-black)]" />
        </div>

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=500&fit=crop"
                    alt="Behind the scenes"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop"
                    alt="Camera equipment"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&h=300&fit=crop"
                    alt="Film set"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=500&fit=crop"
                    alt="Acting"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <span className="text-sm text-[var(--color-gold)] uppercase tracking-[0.3em]">
                Notre Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-medium text-[var(--color-text-primary)]">
                Connecter les <span className="text-gold-gradient">Talents</span> aux Opportunités
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                Nous croyons au potentiel extraordinaire des artistes marocains. Notre plateforme
                offre une vitrine professionnelle pour les acteurs, mannequins et performers, les
                connectant directement avec les producteurs et directeurs de casting.
              </p>

              {/* Feature list */}
              <div className="grid gap-6">
                {[
                  {
                    icon: Users,
                    title: 'Réseau Professionnel',
                    desc: 'Accédez à un réseau exclusif de professionnels du cinéma',
                  },
                  {
                    icon: Shield,
                    title: 'Profils Vérifiés',
                    desc: 'Chaque talent est vérifié pour garantir la qualité',
                  },
                  {
                    icon: Eye,
                    title: 'Visibilité Maximale',
                    desc: 'Soyez visible auprès des plus grandes productions',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-gold-muted)] flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <div className="text-lg font-medium text-[var(--color-text-primary)]">
                        {item.title}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/talents">
                <Button variant="outline" showArrow>
                  Voir les Talents
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[var(--color-charcoal)]" />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm text-[var(--color-gold)] uppercase tracking-[0.3em] mb-4 block">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-medium text-[var(--color-text-primary)]">
              Ce Que Disent Nos <span className="text-gold-gradient">Talents</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Grâce à cette plateforme, j'ai décroché mon premier rôle dans une série télévisée. Une expérience incroyable!",
                name: 'Amina Belkadi',
                role: 'Actrice',
                image:
                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
              },
              {
                quote:
                  "L'interface est intuitive et les opportunités sont nombreuses. Je recommande à tous les artistes marocains.",
                name: 'Hassan Mouhib',
                role: 'Acteur & Mannequin',
                image:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
              },
              {
                quote:
                  'En tant que directrice de casting, je trouve ici les meilleurs talents pour mes productions. Indispensable!',
                name: 'Fatima Zahra',
                role: 'Directrice de Casting',
                image:
                  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="relative p-8 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-surface-light)] backdrop-blur-sm"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-[var(--color-gold)]/20 font-serif">
                  &ldquo;
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-[var(--color-gold)] fill-[var(--color-gold)]"
                      />
                    ))}
                  </div>

                  <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-gold)]/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[var(--color-gold)]">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=600&fit=crop"
            alt="Cinema"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-black)]/90" />
          {/* Spotlight from top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[50%] bg-gradient-to-b from-[var(--color-gold)]/15 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Star icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[var(--color-gold)] mb-8 animate-float">
              <Star size={40} className="text-[var(--color-gold)]" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--color-text-primary)] mb-6">
              Prêt à Briller?
            </h2>

            <p className="text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre communauté de talents exceptionnels et donnez une nouvelle dimension à
              votre carrière artistique.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="xl" glow showArrow>
                  Créer Mon Profil
                </Button>
              </Link>
              <Link href="/talents">
                <Button variant="ghost" size="xl">
                  Découvrir les Talents
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[var(--color-gold)]" />
                <span className="text-sm">Profils Vérifiés</span>
              </div>
              <div className="w-[1px] h-4 bg-[var(--color-surface-light)]" />
              <div className="flex items-center gap-2">
                <Star size={18} className="text-[var(--color-gold)]" />
                <span className="text-sm">Qualité Premium</span>
              </div>
              <div className="w-[1px] h-4 bg-[var(--color-surface-light)]" />
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[var(--color-gold)]" />
                <span className="text-sm">Communauté Active</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
