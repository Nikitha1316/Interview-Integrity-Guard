// filepath: /D:/app/igi2/igi/app/navigation/StackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './screens/sign-up';
import HomeScreen from './screens/home'; // Assuming you have a HomeScreen component
import HelpScreen from './screens/help';
import SettingsScreen from './screens/Settings';
import AboutUsScreen from './screens/AboutUs';
import Profile from './screens/Profile';
import SignInScreen from './screens/sign-in';
import ScheduleMeetingScreen from './screens/ScheduleMeetingScreen';
import UploadVideoFileScreen from './screens/uploadVideoFile';
import ReportsScreen from './screens/Report';
import NotesScreen from "./screens/Notes";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen}/>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ScheduleMeeting" component={ScheduleMeetingScreen} />
      <Stack.Screen name="UploadVideo" component={UploadVideoFileScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;