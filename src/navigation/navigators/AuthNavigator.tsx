import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen, WelcomeScreen, ServerScreen } from "../screens/Auth";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Server"
        component={ServerScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
