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

export default function SeatsScreen() {
  const router = useRouter();
  const { showtimeId } = useLocalSearchParams();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const loadSeats = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      const response = await api.get(`/seats?showtimeId=${showtimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSeats(response.data);
    } catch (error) {
      Alert.alert(
        "Σφάλμα",
        error.response?.data?.message || "Αποτυχία φόρτωσης θέσεων"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.is_reserved === 1 || seat.is_reserved === true) {
      return;
    }

    const exists = selectedSeats.includes(seat.seat_id);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat.seat_id]);
    }
  };

  const handleReservation = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Προσοχή", "Πρέπει να επιλέξεις τουλάχιστον μία θέση");
      return;
    }

    try {
      setBooking(true);

      const token = await SecureStore.getItemAsync("token");

      await api.post(
        "/reservations",
        {
          showtimeId: Number(showtimeId),
          seatIds: selectedSeats
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert("Επιτυχία", "Η κράτηση δημιουργήθηκε επιτυχώς");

      setSelectedSeats([]);
      await loadSeats();

      router.push("/home");
    } catch (error) {
      Alert.alert(
        "Σφάλμα",
        error.response?.data?.message || "Αποτυχία δημιουργίας κράτησης"
      );
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    loadSeats();
  }, []);

  const renderSeat = ({ item }) => {
    const isReserved = item.is_reserved === 1 || item.is_reserved === true;
    const isSelected = selectedSeats.includes(item.seat_id);

    return (
      <Pressable
        style={[
          styles.seat,
          isReserved && styles.reservedSeat,
          isSelected && styles.selectedSeat
        ]}
        onPress={() => toggleSeat(item)}
      >
        <Text
          style={[
            styles.seatText,
            isReserved && styles.reservedText,
            isSelected && styles.selectedText
          ]}
        >
          {item.seat_number}
        </Text>

        <Text style={styles.category}>{item.category}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.page}>
      <Text style={styles.smallText}>Επιλογή θέσεων</Text>
      <Text style={styles.title}>Διάλεξε τις θέσεις σου</Text>

      <View style={styles.legend}>
        <Text style={styles.legendItem}>🟣 Επιλεγμένη</Text>
        <Text style={styles.legendItem}>⚫ Διαθέσιμη</Text>
        <Text style={styles.legendItem}>🔒 Κρατημένη</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Φόρτωση θέσεων...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={seats}
            keyExtractor={(item) => item.seat_id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={renderSeat}
          />

          <View style={styles.footer}>
            <Text style={styles.selectedCount}>
              Επιλεγμένες θέσεις: {selectedSeats.length}
            </Text>

            <Pressable
              style={[
                styles.button,
                selectedSeats.length === 0 && styles.disabledButton
              ]}
              onPress={handleReservation}
              disabled={selectedSeats.length === 0 || booking}
            >
              <Text style={styles.buttonText}>
                {booking ? "Κράτηση..." : "Ολοκλήρωση κράτησης"}
              </Text>
            </Pressable>
          </View>
        </>
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
    color: "#8b949e",
    fontSize: 14
  },
  title: {
    color: "#f0f6fc",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 16
  },
  legend: {
    backgroundColor: "#161b22",
    borderWidth: 1,
    borderColor: "#30363d",
    borderRadius: 16,
    padding: 12,
    marginBottom: 18
  },
  legendItem: {
    color: "#8b949e",
    marginBottom: 4
  },
  list: {
    paddingBottom: 120
  },
  row: {
    justifyContent: "space-between"
  },
  seat: {
    width: "31%",
    backgroundColor: "#161b22",
    borderWidth: 1,
    borderColor: "#30363d",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 14,
    alignItems: "center"
  },
  selectedSeat: {
    backgroundColor: "#7c3aed",
    borderColor: "#a78bfa"
  },
  reservedSeat: {
    backgroundColor: "#2d333b",
    opacity: 0.45
  },
  seatText: {
    color: "#f0f6fc",
    fontSize: 20,
    fontWeight: "900"
  },
  selectedText: {
    color: "#ffffff"
  },
  reservedText: {
    color: "#8b949e"
  },
  category: {
    color: "#8b949e",
    fontSize: 12,
    marginTop: 4
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: "#161b22",
    borderWidth: 1,
    borderColor: "#30363d",
    borderRadius: 20,
    padding: 16
  },
  selectedCount: {
    color: "#f0f6fc",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 14
  },
  disabledButton: {
    backgroundColor: "#30363d"
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
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