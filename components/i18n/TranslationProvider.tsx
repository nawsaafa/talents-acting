'use client';

import React, { createContext, useContext, useCallback } from 'react';

type Messages = Record<string, unknown>;

interface TranslationContextType {
  locale: string;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

function getNestedValue(obj: Messages, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export function TranslationProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}) {
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(messages, key);

      if (!value) {
        console.warn(`Missing translation: ${key}`);
        return key;
      }

      // Replace parameters like {name} with actual values
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
        });
      }

      return value;
    },
    [messages]
  );

  return (
    <TranslationContext.Provider value={{ locale, messages, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export function useLocale() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useLocale must be used within a TranslationProvider');
  }
  return context.locale;
}
