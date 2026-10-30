import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../FirebaseConfig";

const { width, height } = Dimensions.get("window");

export function SignInScreen({ navigation }: any) {
  const [inputType, setInputType] = useState("email"); // "email" or "username"
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      let email = inputValue;

      if (inputType === "username") {
        // Fetch the email associated with the provided username
        const q = query(collection(db, "users"), where("username", "==", inputValue));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Sign In Error", "No user found with the provided username.");
          return;
        }

        const userDoc = querySnapshot.docs[0];
        email = userDoc.data().email;
      }

      // Sign in with the fetched email (or directly if inputType is "email") and provided password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert("Success", "You have signed in successfully!");
      navigation.navigate("Home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign In Error", error.message);
      } else {
        Alert.alert("Sign In Error", "An unknown error occurred.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!inputValue) {
      Alert.alert("Error", `Please enter your ${inputType}.`);
      return;
    }

    try {
      let email = inputValue;

      if (inputType === "username") {
        // Fetch the email associated with the provided username
        const q = query(collection(db, "users"), where("username", "==", inputValue));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Error", "No user found with the provided username.");
          return;
        }

        const userDoc = querySnapshot.docs[0];
        email = userDoc.data().email;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#0F0F0F"]} style={styles.container}>
      <LinearGradient colors={["#2C3E50", "#34495E"]} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle between Email and Username */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, inputType === "email" && styles.activeToggleButton]}
            onPress={() => setInputType("email")}
          >
            <Text style={styles.toggleButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, inputType === "username" && styles.activeToggleButton]}
            onPress={() => setInputType("username")}
          >
            <Text style={styles.toggleButtonText}>Username</Text>
          </TouchableOpacity>
        </View>

        {/* Updated Input Fields */}
        <TextInput
          style={styles.input}
          placeholder={inputType === "email" ? "Email" : "Username"}
          placeholderTextColor="#B0BEC5"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0BEC5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: width * 0.05,
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: height * 0.03,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
  },
  linkText: {
    color: "#1F618D",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  toggleButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    marginHorizontal: width * 0.02,
    backgroundColor: "#34495E",
  },
  activeToggleButton: {
    backgroundColor: "#2980B9",
  },
  toggleButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#1F1F1F",
    color: "white",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: "#34495E",
  },
  forgotPassword: {
    color: "#D3D3D3",
    textAlign: "right",
    marginTop: height * 0.015,
  },
  signInButton: {
    backgroundColor: "#2980B9",
    paddingVertical: height * 0.02,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.03,
  },
  signInButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.03,
  },
  footerText: {
    color: "#D3D3D3",
  },
  signUpLink: {
    color: "#3498DB",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default SignInScreen;