import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Divider,
  Icon,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export type OptionSheetItem = { label: string; value: string };

type Props = {
  label: string;
  placeholder?: string;
  options: OptionSheetItem[];
  value: string;
  onSelect: (value: string) => void;
  /** Optional heading inside the sheet */
  modalTitle?: string;
};

export default function OptionSheetPicker({
  label,
  placeholder = 'Select…',
  options,
  value,
  onSelect,
  modalTitle,
}: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const displayLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? '',
    [options, value]
  );

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const pick = useCallback(
    (v: string) => {
      onSelect(v);
      closeModal();
    },
    [onSelect, closeModal]
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openModal}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${displayLabel || placeholder}. Opens list.`}
      >
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={displayLabel}
            editable={false}
            dense
            outlineColor={colors.outline}
            activeOutlineColor={colors.primary}
            style={{ backgroundColor: colors.surface }}
            right={<TextInput.Icon icon="menu-down" />}
          />
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={open}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.sheet,
            { backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.sheetHeader}>
            <Text variant="titleMedium" style={{ color: colors.onSurface, flex: 1 }}>
              {modalTitle ?? label}
            </Text>
            <IconButton icon="close" onPress={closeModal} accessibilityLabel="Close" />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            bounces={false}
          >
            {options.map((opt, index) => {
              const selected = opt.value === value;
              return (
                <React.Fragment key={opt.value}>
                  {index > 0 ? <Divider /> : null}
                  <Pressable
                    onPress={() => pick(opt.value)}
                    style={({ pressed }) => [
                      styles.row,
                      {
                        backgroundColor: pressed ? colors.surfaceVariant : 'transparent',
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color: selected ? colors.primary : colors.onSurface,
                        fontWeight: selected ? '600' : '400',
                      }}
                    >
                      {opt.label}
                    </Text>
                    {selected ? (
                      <Icon source="check" size={22} color={colors.primary} />
                    ) : (
                      <View style={{ width: 22 }} />
                    )}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { alignSelf: 'stretch' },
  sheet: {
    margin: 24,
    padding: 16,
    borderRadius: 16,
    maxHeight: '55%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  list: { maxHeight: 220 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
