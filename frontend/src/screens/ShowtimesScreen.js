import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../api/api";

export default function ShowtimesScreen() {
  const router = useRouter();
  const { showId, showTitle } = useLocalSearchParams();

  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShowtimes = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const response = await api.get(`/showtimes?showId=${showId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShowtimes(response.data);
    } catch (error) {
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης showtimes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShowtimes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR");
  };

  return (
    <View style={styles.page}>
      <Text style={styles.smallText}>Διαθέσιμες ώρες για</Text>
      <Text style={styles.title}>{showTitle}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={showtimes}
          keyExtractor={(item) => item.showtime_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                📅 {formatDate(item.show_date)}
              </Text>

              <Text style={styles.time}>
                🕒 {item.show_time}
              </Text>

              <Text style={styles.price}>
                💸 {item.price}€
              </Text>

              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "/seats",
                    params: {
                      showtimeId: item.showtime_id
                    }
                  })
                }
              >
                <Text style={styles.buttonText}>Κράτηση</Text>
              </Pressable>
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
  smallText: {
    color: "#8b949e"
  },
  title: {
    color: "#f0f6fc",
    fontSize: 28,
    fontWeight: "800",
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
  date: {
    color: "#a78bfa",
    fontSize: 16
  },
  time: {
    color: "#f0f6fc",
    fontSize: 18,
    fontWeight: "700"
  },
  price: {
    color: "#8b949e",
    marginBottom: 10
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 10,
    borderRadius: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  }
});