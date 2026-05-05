import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const response = await api.get("/user/reservations", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReservations(response.data);
    } catch (error) {
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης κρατήσεων");
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      await api.delete(`/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert("Επιτυχία", "Η κράτηση ακυρώθηκε");
      loadReservations();
    } catch (error) {
      Alert.alert("Σφάλμα", "Αποτυχία ακύρωσης");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("el-GR");
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Οι κρατήσεις μου</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.show}>{item.title}</Text>

              <Text style={styles.info}>
                📍 {item.theatre_name}
              </Text>

              <Text style={styles.info}>
                📅 {formatDate(item.show_date)} - {item.show_time}
              </Text>

              <Text style={styles.seats}>
                🎟 Θέσεις: {item.seats}
              </Text>

              {item.status === "ACTIVE" && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => cancelReservation(item.reservation_id)}
                >
                  <Text style={styles.cancelText}>Ακύρωση</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0d1117",
    padding: 20
  },
  title: {
    color: "#f0f6fc",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#161b22",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#30363d"
  },
  show: {
    color: "#f0f6fc",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6
  },
  info: {
    color: "#8b949e",
    marginBottom: 4
  },
  seats: {
    color: "#a78bfa",
    marginTop: 8,
    marginBottom: 10
  },
  cancelButton: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 10
  },
  cancelText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  }
});