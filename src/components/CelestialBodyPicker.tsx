import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

type Props = {
  label: string;
  placeholder?: string;
  /** Current body name (lowercase, matching `options`). */
  selectedName: string;
  options: readonly string[];
  onSelect: (name: string) => void;
};

export default function CelestialBodyPicker({
  label,
  placeholder = 'Select body',
  selectedName,
  options,
  onSelect,
}: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const openModal = useCallback(() => {
    setQuery('');
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  const pick = useCallback(
    (name: string) => {
      onSelect(name);
      closeModal();
    },
    [onSelect, closeModal]
  );

  const display = selectedName || '';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openModal}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display || placeholder}. Opens list.`}
      >
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={display}
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetInner}
          >
            <View style={styles.sheetHeader}>
              <Text variant="titleMedium" style={{ color: colors.onSurface, flex: 1 }}>
                {label}
              </Text>
              <IconButton icon="close" onPress={closeModal} accessibilityLabel="Close" />
            </View>
            <TextInput
              mode="outlined"
              placeholder="Search…"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              dense
              outlineColor={colors.outline}
              activeOutlineColor={colors.primary}
              style={{ marginBottom: 8 }}
            />
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => pick(item)}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: pressed ? colors.surfaceVariant : 'transparent' },
                  ]}
                >
                  <Text style={{ color: colors.onSurface }}>{item}</Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={{ color: colors.onSurfaceVariant, padding: 16 }}>
                  No matching bodies
                </Text>
              }
            />
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { alignSelf: 'stretch' },
  sheet: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    maxHeight: '80%',
  },
  sheetInner: { maxHeight: '100%' },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  list: { maxHeight: 360 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
});
