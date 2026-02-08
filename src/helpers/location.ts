import * as Location from "expo-location";

export async function getCurrentLocation() {
  // console.log("get permission");
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    //   setErrorMsg("Permission to access location was denied");
    return;
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    //   setErrorMsg(
    // "Location services are disabled. Please enable them in settings.",
    //   );
    return;
  }
  // console.log("service enabled");
  // console.log("get last known location");
  let loc = await Location.getLastKnownPositionAsync();
  if (!loc) {
    console.log("getting current location");
    loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      // timeout: 10000, // 10 second timeout
      // maximumAge: 60000, // Accept location up to 1 minute old
    });
  }
  // console.log('Location:', loc);
  return loc;
}
