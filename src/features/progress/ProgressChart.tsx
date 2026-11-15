import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import type { DailyTotals } from '@/engine/progress/metrics';

type Metric = 'activity' | 'accuracy' | 'speed';
const labels: Record<Metric,string> = { activity: 'Questions', accuracy: 'Accuracy', speed: 'Response time' };
const HEIGHT = 132;
const WIDTH = 300;
const TOP = 9;
const BOTTOM = 118;

function value(row: DailyTotals, metric: Metric): number | null {
  if (metric === 'activity') return row.total;
  if (!row.total) return null;
  return metric === 'accuracy' ? row.correct / row.total * 100 : row.elapsedMs / row.total / 1000;
}
function display(n: number | null, metric: Metric) {
  if (n === null) return 'No practice';
  return metric === 'accuracy' ? Math.round(n) + '%' : metric === 'speed' ? n.toFixed(1) + 's' : String(n);
}

// Native SVG chart: bounded to 30 points, tap inspection and accessible increment/decrement.
export const ProgressChart = memo(function ProgressChart({ rows, metric }: { rows: readonly DailyTotals[]; metric: Metric }) {
  const { colors } = useTheme();
  const [plotWidth, setPlotWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  if (!rows.length) return null;
  const index = Math.min(rows.length - 1, selected ?? rows.length - 1);
  const active = rows[index]!;
  const values = rows.map(row => value(row, metric));
  const max = metric === 'accuracy' ? 100 : Math.max(1, ...values.map(v => v ?? 0));
  const slot = WIDTH / rows.length;
  const x = (i: number) => slot * (i + 0.5);
  const y = (v: number) => BOTTOM - (BOTTOM - TOP) * v / max;
  let path = '';
  let connected = false;
  for (let i = 0; i < values.length; i++) {
    const v = values[i]!;
    if (v === null) { connected = false; continue; }
    path += (connected ? 'L' : 'M') + x(i) + ' ' + y(v) + ' ';
    connected = true;
  }
  const choose = (next: number) => setSelected(Math.max(0, Math.min(rows.length - 1, next)));
  return (
    <View style={styles.chart}>
      <View style={styles.readout}>
        <AppText variant="caption" tone="muted">{active.day}</AppText>
        <AppText variant="heading" tone="primary">{display(values[index] ?? null, metric)}</AppText>
      </View>
      <View
        accessible accessibilityRole="adjustable"
        accessibilityLabel={labels[metric]}
        accessibilityValue={{ text: active.day + ': ' + display(values[index] ?? null, metric) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={event => choose(index + (event.nativeEvent.actionName === 'increment' ? 1 : -1))}
        onLayout={event => setPlotWidth(event.nativeEvent.layout.width)}
        style={styles.plot}
      >
        <Svg width="100%" height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
          {[0, 0.5, 1].map(t => <Line key={t} x1={0} x2={WIDTH} y1={y(max * t)} y2={y(max * t)} stroke={colors.border} strokeDasharray="3 4" />)}
          {metric === 'activity' ? values.map((v, i) => {
            const h = Math.max(2, BOTTOM - y(v ?? 0));
            const w = Math.min(slot * 0.68, 28);
            return <Rect key={rows[i]!.day} x={x(i) - w / 2} y={BOTTOM - h} width={w} height={h} rx={Math.min(4, w / 2)} fill={i === index ? colors.primary : colors.primary + '66'} />;
          }) : <>
            <Line x1={x(index)} x2={x(index)} y1={TOP} y2={BOTTOM} stroke={colors.muted} strokeDasharray="3 4" />
            <Path d={path || 'M0 0'} stroke={colors.primary} strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {values.map((v, i) => v === null ? null : <Circle key={rows[i]!.day} cx={x(i)} cy={y(v)} r={i === index ? 4.5 : 2.5} fill={colors.surface} stroke={colors.primary} strokeWidth={2} />)}
          </>}
        </Svg>
        <Pressable accessible={false} onPress={event => {
          if (plotWidth > 0) choose(Math.floor(event.nativeEvent.locationX / plotWidth * rows.length));
        }} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.axis}>
        <AppText variant="caption" tone="muted">{rows[0]!.day.slice(5)}</AppText>
        <AppText variant="caption" tone="muted">{rows.at(-1)!.day.slice(5)}</AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  chart: { gap: spacing.xs },
  readout: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
  plot: { height: HEIGHT },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
});
