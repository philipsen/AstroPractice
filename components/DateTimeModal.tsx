
// DateTimeModal.tsx
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as React from 'react';
import { Platform, View } from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

type DateTimeModalProps = {
  visible: boolean;
  initialDate?: Date;
  onCancel: () => void;
  onConfirm: (value: Date) => void;
  title?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(n) ? min : n));
}

export const DateTimeModal: React.FC<DateTimeModalProps> = ({
  visible,
  initialDate = new Date(),
  onCancel,
  onConfirm,
  title = 'Select date & time',
}) => {
  console.log("DateTimeModal render", visible, initialDate);

  // Keep a working copy so user can cancel without affecting parent.
  const [localDate, setLocalDate] = React.useState<Date>(initialDate);

  // Split out H/M/S for easy editing
  const [hh, setHh] = React.useState<string>(
    String(initialDate.getHours()).padStart(2, '0')
  );
  const [mm, setMm] = React.useState<string>(
    String(initialDate.getMinutes()).padStart(2, '0')
  );
  const [ss, setSs] = React.useState<string>(
    String(initialDate.getSeconds()).padStart(2, '0')
  );

  // When modal opens with a new initialDate, sync all state
  React.useEffect(() => {
    if (visible) {
      setLocalDate(initialDate);
      setHh(String(initialDate.getHours()).padStart(2, '0'));
      setMm(String(initialDate.getMinutes()).padStart(2, '0'));
      setSs(String(initialDate.getSeconds()).padStart(2, '0'));
    }
  }, [visible, initialDate]);

  const applyHMS = React.useCallback(
    (hStr: string, mStr: string, sStr: string) => {
      const h = clamp(parseInt(hStr, 10), 0, 23);
      const m = clamp(parseInt(mStr, 10), 0, 59);
      const s = clamp(parseInt(sStr, 10), 0, 59);
      const d = new Date(localDate);
      d.setHours(h, m, s, 0);
      setLocalDate(d);
      setHh(String(h).padStart(2, '0'));
      setMm(String(m).padStart(2, '0'));
      setSs(String(s).padStart(2, '0'));
    },
    [localDate]
  );

  const onDateChange = (
    _event: DateTimePickerEvent /*| AndroidEvent*/,
    selected?: Date
  ) => {
    console.log("DateTimeModal onDateChange", _event, selected);
    if (!selected) return;
    const d = new Date(localDate);
    d.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    setLocalDate(d);
  };

  const bump = (field: 'h' | 'm' | 's', delta: 1 | -1) => {
    let h = parseInt(hh, 10);
    let m = parseInt(mm, 10);
    let s = parseInt(ss, 10);
    if (field === 'h') h = (h + delta + 24) % 24;
    if (field === 'm') m = (m + delta + 60) % 60;
    if (field === 's') s = (s + delta + 60) % 60;
    applyHMS(String(h), String(m), String(s));
  };

  const confirm = () => {
    // Final safety apply in case fields are mid-edit
    applyHMS(hh, mm, ss);
    onConfirm(localDate);
  };

  const setNow = () => {
    const now = new Date();
    setLocalDate(now);
    setHh(String(now.getHours()).padStart(2, '0'));
    setMm(String(now.getMinutes()).padStart(2, '0'));
    setSs(String(now.getSeconds()).padStart(2, '0'));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={{
          margin: 16,
          padding: 16,
          borderRadius: 12,
          backgroundColor: 'white',
        }}
      >
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>
          {title}
        </Text>

        {/* Date picker */}
        <View style={{ marginBottom: 12 }}>
          <DateTimePicker
            value={localDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={onDateChange}
          />
        </View>

        <Divider style={{ marginVertical: 8 }} />

        {/* Time: H / M / S with +/- and numeric fields */}
        <Text variant="labelLarge" style={{ marginBottom: 6 }}>
          Time (hh:mm:ss)
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          {/* Hours */}
          <StepField
            label="HH"
            value={hh}
            onChangeText={(v) => {
              const clean = v.replace(/[^\d]/g, '').slice(0, 2);
              setHh(clean);
              if (clean.length === 2) applyHMS(clean, mm, ss);
            }}
            onMinus={() => bump('h', -1)}
            onPlus={() => bump('h', +1)}
            maxLength={2}
          />
          <Text variant="titleLarge">:</Text>

          {/* Minutes */}
          <StepField
            label="MM"
            value={mm}
            onChangeText={(v) => {
              const clean = v.replace(/[^\d]/g, '').slice(0, 2);
              setMm(clean);
              if (clean.length === 2) applyHMS(hh, clean, ss);
            }}
            onMinus={() => bump('m', -1)}
            onPlus={() => bump('m', +1)}
            maxLength={2}
          />
          <Text variant="titleLarge">:</Text>

          {/* Seconds */}
          <StepField
            label="SS"
            value={ss}
            onChangeText={(v) => {
              const clean = v.replace(/[^\d]/g, '').slice(0, 2);
              setSs(clean);
              if (clean.length === 2) applyHMS(hh, mm, clean);
            }}
            onMinus={() => bump('s', -1)}
            onPlus={() => bump('s', +1)}
            maxLength={2}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button mode="text" onPress={setNow}>
            Now
          </Button>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button onPress={onCancel}>Cancel</Button>
            <Button mode="contained" onPress={confirm}>
              Confirm
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

// Small helper for a compact HH/MM/SS field with +/- buttons.
const StepField: React.FC<{
  label: string;
  value: string;
  maxLength?: number;
  onChangeText: (v: string) => void;
  onMinus: () => void;
  onPlus: () => void;
}> = ({ label, value, onChangeText, onMinus, onPlus, maxLength = 2 }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <IconButton
        icon="minus"
        size={18}
        onPress={onMinus}
        accessibilityLabel={`Decrease ${label}`}
      />
      <TextInput
        mode="outlined"
        dense
        keyboardType="number-pad"
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        style={{ width: 64 }}
        contentStyle={{ textAlign: 'center' }}
        label={label}
      />
      <IconButton
        icon="plus"
        size={18}
        onPress={onPlus}
        accessibilityLabel={`Increase ${label}`}
      />
    </View>
  );
};
