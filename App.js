import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import AgendamentoScreen from './src/screens/AgendamentoScreen';
import AgendadosScreen from './src/screens/AgendadosScreen';
import CadastroDentistaScreen from './src/screens/CadastroDentistaScreen'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Agendamento"
        component={AgendamentoScreen}
        options={{ title: 'Agendamentos' }}
      />
      <Stack.Screen
        name="Agendados"
        component={AgendadosScreen}
        options={{ title: 'Agendados Realizados' }}
      />
      <Stack.Screen
        name="CadastroDentista"
        component={CadastroDentistaScreen}
        options={{ title: 'Cadastro de Dentista' }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}