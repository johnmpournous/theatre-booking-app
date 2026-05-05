import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0d1117"
        },
        headerTintColor: "#f0f6fc",
        headerTitleStyle: {
          fontWeight: "800"
        },
        contentStyle: {
          backgroundColor: "#0d1117"
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Σύνδεση" }} />
      <Stack.Screen name="register" options={{ title: "Εγγραφή" }} />
      <Stack.Screen name="home" options={{ title: "Θέατρα" }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="shows" options={{ title: "Παραστάσεις" }} />
      <Stack.Screen name="showtimes" options={{ title: "Ώρες" }} />
      <Stack.Screen name="seats" options={{ title: "Θέσεις" }} />
      <Stack.Screen name="reservations" options={{ title: "Οι κρατήσεις μου" }} />
    </Stack>
  );
}