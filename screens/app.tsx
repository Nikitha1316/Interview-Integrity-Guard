import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SignInScreen } from "./sign-in"
import { SignUpScreen } from "./sign-up"
import { HomeScreen } from "./home"
import { HelpScreen } from "./help"
import AboutUsScreen from "./AboutUs";
import ProfileScreen from "./Profile";
import SettingsScreen from "./Settings";
import UploadVideoFileScreen from "./uploadVideoFile";
import ReportsScreen from "./Report"
import NotesScreen from "./Notes"
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="UploadVideo" component={UploadVideoFileScreen} />
        <Stack.Screen name="Report" component={ReportsScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
