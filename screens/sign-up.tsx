import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../FirebaseConfig"; // Ensure FirebaseConfig is correctly set up

const { width, height } = Dimensions.get("window");

export function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Generate random numbers for CAPTCHA
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));

  const isCaptchaValid = parseInt(captchaAnswer) === num1 + num2;

  const handleSignUp = async () => {
    if (!isCaptchaValid) {
      Alert.alert("CAPTCHA Error", "Incorrect answer. Please try again.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match. Please try again.");
      return;
    }

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send Email Verification
      await sendEmailVerification(user);
      Alert.alert("Verify Your Email", "A verification link has been sent to your email. Please check your inbox before signing in.");

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        username,
        emailVerified: false, // Initially, email is not verified
      });

      navigation.navigate("SignIn");

      // Reset CAPTCHA
      setNum1(Math.floor(Math.random() * 10));
      setNum2(Math.floor(Math.random() * 10));
      setCaptchaAnswer("");
    } catch (error) {
      Alert.alert("Sign Up Error", (error as any).message);
    }
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#0F0F0F"]} style={styles.container}>
      <LinearGradient colors={["#2C3E50", "#34495E"]} style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sign Up</Text>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#B0BEC5"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0BEC5"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B0BEC5"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0BEC5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#B0BEC5"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* CAPTCHA */}
        <Text style={styles.captchaText}>Solve: {num1} + {num2} = ?</Text>
        <TextInput
          style={styles.captchaInput}
          placeholder="Enter Answer"
          placeholderTextColor="#B0BEC5"
          keyboardType="numeric"
          value={captchaAnswer}
          onChangeText={setCaptchaAnswer}
        />

        <TouchableOpacity
          style={[styles.signUpButton, !isCaptchaValid && styles.disabledButton]}
          disabled={!isCaptchaValid}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
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
  captchaText: {
    fontSize: width * 0.045,
    color: "white",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  captchaInput: {
    width: "100%",
    backgroundColor: "#1F1F1F",
    color: "white",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: "#3498DB",
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: "#2980B9",
    paddingVertical: height * 0.02,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.03,
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  signUpButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default SignUpScreen;