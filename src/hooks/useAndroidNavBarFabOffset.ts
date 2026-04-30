import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Target clearance (dp) above the physical bottom for classic 3-button nav. */
const MIN_ANDROID_NAV_CLEARANCE = 78;

/**
 * Extra `bottom` offset for absolute FABs on Android. Some devices report a
 * nav-bar inset that is too small (or 0) while the system bar still overlays
 * the app; this tops up so controls stay above triangle/circle/square.
 */
export function useAndroidNavBarFabOffset(): number {
  const { bottom } = useSafeAreaInsets();
  if (Platform.OS !== 'android') return 0;
  return Math.max(0, MIN_ANDROID_NAV_CLEARANCE - bottom);
}
