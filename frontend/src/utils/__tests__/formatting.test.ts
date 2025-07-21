import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimeAgo, formatScore } from '../formatting';

describe('formatting utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatTimeAgo', () => {
    it('formats seconds ago', () => {
      const date = new Date('2024-01-15T11:59:30Z');
      expect(formatTimeAgo(date)).toBe('30 sek');
    });

    it('formats minutes ago', () => {
      const date = new Date('2024-01-15T11:45:00Z');
      expect(formatTimeAgo(date)).toBe('15 min');
    });

    it('formats hours ago', () => {
      const date = new Date('2024-01-15T08:00:00Z');
      expect(formatTimeAgo(date)).toBe('4 t');
    });

    it('formats days ago', () => {
      const date = new Date('2024-01-10T12:00:00Z');
      expect(formatTimeAgo(date)).toBe('5 d');
    });

    it('formats years ago', () => {
      const date = new Date('2023-01-15T12:00:00Z');
      expect(formatTimeAgo(date)).toBe('1 år');
    });
  });

  describe('formatScore', () => {
    it('formats regular numbers', () => {
      expect(formatScore(0)).toBe('•');
      expect(formatScore(999)).toBe('999');
    });

    it('formats thousands', () => {
      expect(formatScore(1000)).toBe('1.0k');
      expect(formatScore(1500)).toBe('1.5k');
    });

    it('formats large numbers', () => {
      expect(formatScore(10000)).toBe('10.0k');
      expect(formatScore(100000)).toBe('100.0k');
    });
  });

  // formatDate function doesn't exist in the formatting module
});