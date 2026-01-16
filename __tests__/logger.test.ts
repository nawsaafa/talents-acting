import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';

// Mock fs to avoid actual file writes during tests
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    default: {
      ...actual,
      existsSync: vi.fn().mockReturnValue(true),
      mkdirSync: vi.fn(),
      writeFileSync: vi.fn(),
    },
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

describe('Logger module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports logger and captureError', async () => {
    const { logger, captureError, log } = await import('@/lib/logger');
    expect(logger).toBeDefined();
    expect(captureError).toBeDefined();
    expect(log).toBeDefined();
  });

  it('log object has all required methods', async () => {
    const { log } = await import('@/lib/logger');
    expect(typeof log.debug).toBe('function');
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
  });

  it('captureError writes error file', async () => {
    const { captureError } = await import('@/lib/logger');
    const testError = new Error('Test error message');

    captureError(testError, 'Test error occurred', { userId: '123' });

    expect(fs.writeFileSync).toHaveBeenCalled();
    const [filepath, content] = (fs.writeFileSync as ReturnType<typeof vi.fn>).mock.calls[0];

    expect(filepath).toContain('last_error_');
    expect(filepath).toContain('.json');

    const parsed = JSON.parse(content);
    expect(parsed.level).toBe('error');
    expect(parsed.msg).toBe('Test error occurred');
    expect(parsed.error.type).toBe('Error');
    expect(parsed.error.message).toBe('Test error message');
    expect(parsed.context.userId).toBe('123');
  });
});
