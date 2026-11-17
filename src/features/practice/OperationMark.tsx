import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { PracticeOperation } from '@/engine/arithmetic/types';

export const OperationMark = memo(function OperationMark({ operation, color, size = 32 }: { operation: PracticeOperation; color: string; size?: number }) {
  const paths = {
    addition: 'M16 5V27M5 16H27',
    subtraction: 'M5 16H27',
    multiplication: 'M8 8L24 24M24 8L8 24',
    division: 'M5 16H27',
    mixed: 'M8 4V16M2 10H14M19 22H31',
  };
  return <Svg width={size} height={size} viewBox="0 0 32 32" accessible={false}>
    <Path d={paths[operation]} stroke={color} strokeWidth="2.8" strokeLinecap="square" />
    {operation === 'division' && <><Circle cx="16" cy="6" r="2" fill={color} /><Circle cx="16" cy="26" r="2" fill={color} /></>}
  </Svg>;
});
