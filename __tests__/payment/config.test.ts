import { describe, it, expect } from 'vitest';
import { PRICING, CURRENCY, calculatePeriodEnd, getPaymentTypeForRole } from '@/lib/payment/config';

describe('Payment Config', () => {
  describe('PRICING', () => {
    it('should have correct pricing for TALENT_MEMBERSHIP', () => {
      expect(PRICING.TALENT_MEMBERSHIP).toBeDefined();
      expect(PRICING.TALENT_MEMBERSHIP.amount).toBe(30000); // 300 MAD in centimes
      expect(PRICING.TALENT_MEMBERSHIP.displayAmount).toBe(300);
      expect(PRICING.TALENT_MEMBERSHIP.periodMonths).toBe(12);
    });

    it('should have correct pricing for PROFESSIONAL_ACCESS', () => {
      expect(PRICING.PROFESSIONAL_ACCESS).toBeDefined();
      expect(PRICING.PROFESSIONAL_ACCESS.amount).toBe(150000); // 1500 MAD in centimes
      expect(PRICING.PROFESSIONAL_ACCESS.displayAmount).toBe(1500);
      expect(PRICING.PROFESSIONAL_ACCESS.periodMonths).toBe(12);
    });

    it('should have correct pricing for COMPANY_ACCESS', () => {
      expect(PRICING.COMPANY_ACCESS).toBeDefined();
      expect(PRICING.COMPANY_ACCESS.amount).toBe(350000); // 3500 MAD in centimes
      expect(PRICING.COMPANY_ACCESS.displayAmount).toBe(3500);
      expect(PRICING.COMPANY_ACCESS.periodMonths).toBe(12);
    });

    it('should have amount equal to displayAmount * 100', () => {
      expect(PRICING.TALENT_MEMBERSHIP.amount).toBe(PRICING.TALENT_MEMBERSHIP.displayAmount * 100);
      expect(PRICING.PROFESSIONAL_ACCESS.amount).toBe(
        PRICING.PROFESSIONAL_ACCESS.displayAmount * 100
      );
      expect(PRICING.COMPANY_ACCESS.amount).toBe(PRICING.COMPANY_ACCESS.displayAmount * 100);
    });
  });

  describe('CURRENCY', () => {
    it('should have correct currency configuration', () => {
      expect(CURRENCY.code).toBe('mad');
      expect(CURRENCY.symbol).toBe('MAD');
      expect(CURRENCY.name).toBe('Moroccan Dirham');
    });
  });

  describe('calculatePeriodEnd', () => {
    it('should return a date in the future', () => {
      const now = new Date();
      const result = calculatePeriodEnd(12);
      expect(result.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should calculate period end correctly for 12 months', () => {
      const now = new Date();
      const result = calculatePeriodEnd(12);

      // The year should be either current year + 1 or current year if we're in December
      expect(result.getFullYear()).toBeGreaterThanOrEqual(now.getFullYear());
      expect(result.getFullYear()).toBeLessThanOrEqual(now.getFullYear() + 2);
    });

    it('should add the correct number of months', () => {
      const result6 = calculatePeriodEnd(6);
      const result12 = calculatePeriodEnd(12);

      // 12 month result should be further in future than 6 month result
      expect(result12.getTime()).toBeGreaterThan(result6.getTime());
    });
  });

  describe('getPaymentTypeForRole', () => {
    it('should return TALENT_MEMBERSHIP for TALENT role', () => {
      expect(getPaymentTypeForRole('TALENT')).toBe('TALENT_MEMBERSHIP');
    });

    it('should return PROFESSIONAL_ACCESS for PROFESSIONAL role', () => {
      expect(getPaymentTypeForRole('PROFESSIONAL')).toBe('PROFESSIONAL_ACCESS');
    });

    it('should return COMPANY_ACCESS for COMPANY role', () => {
      expect(getPaymentTypeForRole('COMPANY')).toBe('COMPANY_ACCESS');
    });
  });
});
