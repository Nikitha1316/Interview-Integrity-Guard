import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const { width, height } = Dimensions.get("window");

export function HomeScreen({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fullName, setFullName] = useState("");

  // Animation setup for "HELLO THERE!!!"
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textPosition = useRef(new Animated.Value(20)).current; // Adjust initial position

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setFullName(userDoc.data().fullName);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/get_report');
      const report = await response.text();
      setReportText(report);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle WebRTC meeting link
  const handleWebRTCMeeting = () => {
    Linking.openURL("https://1047-2409-40f3-100d-2a71-ac1a-f05e-2535-6ea4.ngrok-free.app"); // Redirect to google.com
  };

  return (
    <View style={styles.container}>
      {/* Dim Background Overlay When Menu is Open */}
      {menuVisible && <View style={styles.overlay} />}

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>

        <Text style={styles.appTitle}>INTEGRITY GUARD FOR INTERVIEW</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("Help");
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Help</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Animated Text: "HELLO THERE!!!" Above John Doe */}
      <Animated.Text
        style={[
          styles.animatedText,
          { opacity: textOpacity, transform: [{ translateY: textPosition }] },
        ]}
      >
        HELLO THERE!!!
      </Animated.Text>

      {/* Profile Card */}
      <LinearGradient colors={["#2C3E50", "#34495E"]} style={styles.profileCard}>
        <Ionicons name="person-circle" size={60} color="white" />
        <Text style={styles.profileName}>{fullName}</Text>
      </LinearGradient>

      {/* Sticky Note Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.card1]}
          onPress={() => navigation.navigate("ScheduleMeeting")}
        >
          <Text style={styles.cardText}>Schedule Meeting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.card2]}
          onPress={() => navigation.navigate("UploadVideo")} // Navigates to UploadVideoFile.tsx
        >
          <Text style={styles.cardText}>Upload Video File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.card3]}
          onPress={() => navigation.navigate("Reports")} // Navigates to Reports.tsx
        >
          <Text style={styles.cardText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.card4]}
          onPress={() => navigation.navigate("Notes")} // Updated to navigate to NotesScreen
        >
          <Text style={styles.cardText}>Notes</Text>
        </TouchableOpacity>

        {/* New WebRTC Meeting Card */}
        <TouchableOpacity
          style={[styles.card, styles.card5]}
          onPress={handleWebRTCMeeting}
        >
          <Text style={styles.cardText}>WebRTC Meeting</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
          <Ionicons name="information-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Dark gray background
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.03,
  },
  appTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "white",
  },
dropdownMenu: {
  position: "absolute",
  top: height * 0.08,
  left: width * 0.05,
  width: width * 0.45,
  backgroundColor: "#2C3E50",
  borderRadius: 10,
  paddingVertical: height * 0.02,
  zIndex: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 6,
  elevation: 10,
},
  menuItem: {
    paddingVertical: height * 0.018,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#34495E",
  },
  menuText: {
    fontSize: width * 0.045,
    color: "white",
    fontWeight: "600",
  },
  animatedText: {
    color: "white",
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: height * 0.025,
    borderRadius: 15,
    marginBottom: height * 0.03,
    width: "80%",
  },
  profileName: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginLeft: width * 0.03,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: width * 0.04,
    marginTop: height * 0.02,
  },
  card: {
    width: width * 0.4,
    height: height * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: height * 0.02,
    position: "relative",
  },
  card1: {
    backgroundColor: "#2980B9",
    borderBottomRightRadius: 40, // Sticky note effect
  },
  card2: {
    backgroundColor: "#3498DB",
    borderBottomLeftRadius: 40,
  },
  card3: {
    backgroundColor: "#1F618D",
    borderBottomRightRadius: 40,
  },
  card4: {
    backgroundColor: "#154360",
    borderBottomLeftRadius: 40,
  },
  card5: {
    backgroundColor: "#123456", // New color for WebRTC card
    borderBottomRightRadius: 40,
  },
  cardText: {
    color: "white",
    fontSize: width * 0.04,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: height * 0.015,
    backgroundColor: "#333",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;

function setReportText(report: string) {
  throw new Error("Function not implemented.");
}