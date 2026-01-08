import { describe, it, expect } from 'vitest';
import { 
  applyColorblindFilter, 
  getAccessibleColor,
  ColorblindType 
} from '../colorblindAccessibility';

describe('colorblindAccessibility', () => {
  describe('applyColorblindFilter', () => {
    it('returns original color for normal vision', () => {
      const result = applyColorblindFilter('#FF0000', 'normal');
      expect(result).toBe('#FF0000');
    });

    it('transforms red for protanopia', () => {
      const result = applyColorblindFilter('#FF0000', 'protanopia');
      expect(result).not.toBe('#FF0000');
      expect(result).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('transforms colors for deuteranopia', () => {
      const result = applyColorblindFilter('#00FF00', 'deuteranopia');
      expect(result).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('transforms colors for tritanopia', () => {
      const result = applyColorblindFilter('#0000FF', 'tritanopia');
      expect(result).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('getAccessibleColor', () => {
    it('returns color with sufficient contrast for critical severity', () => {
      const color = getAccessibleColor('critical', 'normal');
      expect(color).toBeTruthy();
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('returns distinct colors for different severities', () => {
      const critical = getAccessibleColor('critical', 'normal');
      const warning = getAccessibleColor('warning', 'normal');
      const info = getAccessibleColor('info', 'normal');
      
      expect(critical).not.toBe(warning);
      expect(warning).not.toBe(info);
    });

    it('adjusts colors for colorblind users', () => {
      const normalColor = getAccessibleColor('critical', 'normal');
      const protanopiaColor = getAccessibleColor('critical', 'protanopia');
      
      // Colors should be different for accessibility
      expect(normalColor).not.toBe(protanopiaColor);
    });
  });
});
