import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';

const CREDENCIAIS_PADRAO = {
  rg: '123456',
  senha: 'clinica123',
};

const LoginScreen = ({ navigation }) => {
  const [rg, setRg] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [visible, setVisible] = useState(false);

  const validarLogin = () => {
    if (rg !== CREDENCIAIS_PADRAO.rg || senha !== CREDENCIAIS_PADRAO.senha) {
      setErro('Credenciais inválidas!');
      setVisible(true);
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (validarLogin()) {
      navigation.navigate('Agendamento');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text variant="displaySmall" style={styles.titulo}>
        Clínica Odontológica
      </Text>

      <TextInput
        label="RG Militar"
        mode="outlined"
        value={rg}
        onChangeText={setRg}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        left={<TextInput.Icon icon="card-account-details" />}
      />

      <TextInput
        label="Senha"
        mode="outlined"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.botao}
        icon="login"
        contentStyle={{ flexDirection: 'row-reverse' }}
      >
        Acessar Sistema
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setVisible(false),
        }}
      >
        {erro}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#2196F3',
    fontWeight: '700',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  botao: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
});

export default LoginScreen;