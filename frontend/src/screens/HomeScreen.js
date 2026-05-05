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
import { useRouter } from "expo-router";
import api from "../api/api";

export default function HomeScreen() {
  const router = useRouter();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTheatres = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const response = await api.get("/theatres", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTheatres(response.data);
    } catch (error) {
      Alert.alert(
        "Σφάλμα",
        error.response?.data?.message || "Αποτυχία φόρτωσης θεάτρων"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.smallText}>Καλώς ήρθες</Text>
          <Text style={styles.title}>Θέατρα</Text>
        </View>

        <View style={styles.headerButtons}>
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.push("/reservations")}
          >
            <Text style={styles.logoutText}>Κρατήσεις</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Διάλεξε θέατρο και ανακάλυψε διαθέσιμες παραστάσεις
      </Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Φόρτωση θεάτρων...</Text>
        </View>
      ) : (
        <FlatList
          data={theatres}
          keyExtractor={(item) => item.theatre_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>🎭</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <Pressable
                  style={styles.detailsButton}
                  onPress={() =>
                    router.push({
                      pathname: "/shows",
                      params: {
                        theatreId: item.theatre_id,
                        theatreName: item.name
                      }
                    })
                  }
                >
                  <Text style={styles.detailsText}>Προβολή παραστάσεων</Text>
                </Pressable>
              </View>
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
    paddingTop: 56
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8
  },
  smallText: {
    color: "#8b949e",
    fontSize: 14
  },
  title: {
    color: "#f0f6fc",
    fontSize: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: "#8b949e",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 24
  },
  logoutButton: {
    backgroundColor: "#21262d",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#30363d"
  },
  logoutText: {
    color: "#f0f6fc",
    fontWeight: "700"
  },
  list: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#30363d",
    flexDirection: "row"
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#21262d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },
  icon: {
    fontSize: 28
  },
  cardContent: {
    flex: 1
  },
  name: {
    color: "#f0f6fc",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 6
  },
  location: {
    color: "#a78bfa",
    fontSize: 14,
    marginBottom: 8
  },
  description: {
    color: "#8b949e",
    fontSize: 14,
    marginBottom: 14
  },
  detailsButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 10,
    borderRadius: 12
  },
  detailsText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700"
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