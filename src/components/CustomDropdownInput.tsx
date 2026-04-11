import React from 'react';
import { TextInput } from 'react-native-paper';

export default function CustomDropdownInput(props: any) {
  const { placeholder, label, rightIcon, selectedLabel, mode, disabled, error, nightMode } = props;
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
      outlineColor={nightMode ? 'red' : '#000'}
      activeOutlineColor={nightMode ? 'red' : '#000'}
      theme={{
        roundness: 5,
        colors: {
          onSurface: nightMode ? 'red' : '#000',
          primary: nightMode ? 'red' : '#000',
          background: nightMode ? '#181818' : '#fff',
          placeholder: nightMode ? 'red' : '#888',
          text: nightMode ? 'red' : '#000',
        }
      }}
      style={{ color: nightMode ? 'red' : '#000' }}
    />
  );
}
