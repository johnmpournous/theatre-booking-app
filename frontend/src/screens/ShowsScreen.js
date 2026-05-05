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
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../api/api";

export default function ShowsScreen() {
  const router = useRouter();
  const { theatreId, theatreName } = useLocalSearchParams();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShows = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const response = await api.get(`/shows?theatreId=${theatreId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShows(response.data);
    } catch (error) {
      Alert.alert(
        "Σφάλμα",
        error.response?.data?.message || "Αποτυχία φόρτωσης παραστάσεων"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.smallText}>Παραστάσεις στο</Text>
      <Text style={styles.title}>{theatreName}</Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Φόρτωση παραστάσεων...</Text>
        </View>
      ) : (
        <FlatList
          data={shows}
          keyExtractor={(item) => item.show_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.icon}>🎬</Text>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.row}>
                <Text style={styles.badge}>⏱ {item.duration} λεπτά</Text>
                <Text style={styles.badge}>Ηλικία {item.age_rating}</Text>
              </View>

              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "/showtimes",
                    params: {
                      showId: item.show_id,
                      showTitle: item.title
                    }
                  })
                }
              >
                <Text style={styles.buttonText}>Διαθέσιμες ώρες</Text>
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
    padding: 20,
    paddingTop: 32
  },
  smallText: {
    color: "#8b949e",
    fontSize: 14
  },
  title: {
    color: "#f0f6fc",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 24
  },
  list: {
    paddingBottom: 24
  },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#30363d"
  },
  icon: {
    fontSize: 34,
    marginBottom: 10
  },
  name: {
    color: "#f0f6fc",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8
  },
  description: {
    color: "#8b949e",
    fontSize: 15,
    marginBottom: 14
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16
  },
  badge: {
    color: "#a78bfa",
    backgroundColor: "#21262d",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 13
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 13,
    borderRadius: 13
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "800"
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    color: "#8b949e",
    marginTop: 12
  }
});