'use client';

import { useLocale } from '@/components/i18n';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    // The locale is the first segment after the leading slash
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      // If no locale in path, add it
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';

    setIsOpen(false);
    router.push(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute end-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
          role="listbox"
          aria-label="Available languages"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={loc === locale}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                loc === locale ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
              }`}
            >
              <span>{localeNames[loc]}</span>
              {loc === locale && <Check className="w-4 h-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
