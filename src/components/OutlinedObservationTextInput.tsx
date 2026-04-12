import React from 'react';
import { TextInput } from 'react-native-paper';

type PaperTextInputProps = React.ComponentProps<typeof TextInput>;

export type OutlinedObservationTextInputProps = Omit<
  PaperTextInputProps,
  'mode' | 'ref'
> & {
  /** Use this instead of `ref` so the wrapper stays a plain function component (RN rejects forwardRef objects). */
  inputRef?: PaperTextInputProps['ref'];
};

/**
 * Shared outlined field for observation forms: consistent mode and row spacing.
 */
export default function OutlinedObservationTextInput({
  style,
  inputRef,
  ...rest
}: OutlinedObservationTextInputProps) {
  return (
    <TextInput ref={inputRef} mode="outlined" style={[{ margin: 2 }, style]} {...rest} />
  );
}
