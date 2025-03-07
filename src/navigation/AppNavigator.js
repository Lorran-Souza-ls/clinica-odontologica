import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Esconde o header na tela de login
      />
      <Stack.Screen
        name="Agendamento"
        component={AgendamentoScreen}
        options={{ 
          title: 'Agendamentos',
          headerBackTitleVisible: false // Remove o texto "Voltar" no iOS
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;