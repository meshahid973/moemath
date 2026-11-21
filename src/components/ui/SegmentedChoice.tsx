import { type StyleProp, type ViewStyle } from 'react-native';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';

export function SegmentedChoice<T extends string | number>({
  options, value, onChange, disabled = false, style,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tabs
      value={String(value)}
      variant="underline"
      onValueChange={next => {
        const option = options.find(item => String(item.value) === next);
        if (option) onChange(option.value);
      }}
      style={style}
    >
      <TabsList className="w-full">
        {options.map(option => (
          <TabsTrigger key={option.value} value={String(option.value)} disabled={disabled}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
