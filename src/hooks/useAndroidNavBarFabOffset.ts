import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Extra bottom spacing for absolute-positioned FABs when Android reports no
 * navigation-bar inset (common with 3-button nav + edge-to-edge), so controls
 * are not covered by triangle/circle/square.
 */
export function useAndroidNavBarFabOffset(): number {
  const { bottom } = useSafeAreaInsets();
  if (Platform.OS !== 'android' || bottom > 0) return 0;
  return 52;
}
