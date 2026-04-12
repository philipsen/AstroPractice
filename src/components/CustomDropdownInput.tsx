import React from 'react';
import { TextInput, useTheme } from 'react-native-paper';

export default function CustomDropdownInput(props: any) {
  const { placeholder, label, rightIcon, selectedLabel, mode, disabled, error } = props;
  const { colors } = useTheme();
  return (
    <TextInput
      placeholder={placeholder}
      label={label}
      value={selectedLabel}
      right={rightIcon}
      mode={mode}
      editable={false}
      disabled={disabled}
      error={error}
      outlineColor={colors.outline}
      activeOutlineColor={colors.primary}
      theme={{ roundness: 5 }}
      style={{ color: colors.onSurface }}
    />
  );
}
