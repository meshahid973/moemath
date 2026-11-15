import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palettes, resolveTheme, size } from '../src/theme/tokens.ts';

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255);
  return channels.map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('system theme follows the device with a light fallback', () => {
  assert.equal(resolveTheme('system', 'dark'), 'dark');
  assert.equal(resolveTheme('system', null), 'light');
  assert.equal(resolveTheme('light', 'dark'), 'light');
  assert.equal(resolveTheme('dark', 'light'), 'dark');
});

for (const [name, colors] of Object.entries(palettes)) {
  test(name + ' text meets AA contrast on its intended surfaces', () => {
    for (const background of [colors.background, colors.surface, colors.tint]) {
      assert.ok(contrast(colors.text, background) >= 4.5);
      assert.ok(contrast(colors.muted, background) >= 4.5);
    }
    assert.ok(contrast(colors.onPrimary, colors.primary) >= 4.5);
  });
}

test('controls have at least 48dp touch targets', () => {
  assert.ok(size.touch >= 48);
  assert.ok(size.button >= size.touch);
});
