import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="activites" />
      <Stack.Screen name="activite-form" />
      <Stack.Screen name="publications" />
      <Stack.Screen name="publication-form" />
      <Stack.Screen name="cotisations" />
      <Stack.Screen name="cotisation-form" />
      <Stack.Screen name="paiements" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
