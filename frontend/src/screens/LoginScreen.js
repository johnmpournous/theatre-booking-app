import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import api from "../api/api";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("passwitty@gmail.com");
  const [password, setPassword] = useState("@pass123");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      await SecureStore.setItemAsync("token", response.data.token);

      router.replace("/home");
    } catch (error) {
      Alert.alert(
        "Σφάλμα",
        error.response?.data?.message || "Αποτυχία σύνδεσης"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🎭</Text>
        <Text style={styles.title}>Theatre Booking</Text>
        <Text style={styles.subtitle}>Σύνδεση στον λογαριασμό σου</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8b949e"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8b949e"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Σύνδεση</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.link}>Δεν έχεις λογαριασμό; Εγγραφή</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0d1117",
    justifyContent: "center",
    padding: 24
  },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#30363d"
  },
  logo: {
    fontSize: 52,
    textAlign: "center",
    marginBottom: 12
  },
  title: {
    color: "#f0f6fc",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center"
  },
  subtitle: {
    color: "#8b949e",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28
  },
  input: {
    backgroundColor: "#0d1117",
    color: "#f0f6fc",
    borderWidth: 1,
    borderColor: "#30363d",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    fontSize: 16
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 14,
    marginTop: 8
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700"
  },
  link: {
    color: "#a78bfa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15
  }
});