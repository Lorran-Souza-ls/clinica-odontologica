import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroDentistaScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async () => {
    if (!nome.trim() || !especialidade.trim() || !crm.trim()) {
      setMensagem('Preencha todos os campos!');
      return;
    }

    const novoDentista = {
      id: Date.now().toString(), 
      nome,
      especialidade,
      crm,
    };

    try {
     
      const dentistasSalvos = await AsyncStorage.getItem('dentistas');
      const dentistas = dentistasSalvos ? JSON.parse(dentistasSalvos) : [];

    
      dentistas.push(novoDentista);

     
      await AsyncStorage.setItem('dentistas', JSON.stringify(dentistas));

      setMensagem('Dentista cadastrado com sucesso!');
      setNome('');
      setEspecialidade('');
      setCrm('');
    } catch (error) {
      setMensagem('Erro ao cadastrar dentista');
      console.error('Erro ao salvar dentista:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>
        Cadastro de Dentista
      </Text>

      <TextInput
        label="Nome"
        mode="outlined"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        label="Especialidade"
        mode="outlined"
        value={especialidade}
        onChangeText={setEspecialidade}
        style={styles.input}
      />
      <TextInput
        label="CRM"
        mode="outlined"
        value={crm}
        onChangeText={setCrm}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button
        mode="contained"
        onPress={handleCadastro}
        style={styles.botao}
      >
        Cadastrar Dentista
      </Button>

      <Snackbar
        visible={!!mensagem}
        onDismiss={() => setMensagem('')}
        duration={3000}
      >
        {mensagem}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2196F3',
    fontWeight: '700',
  },
  input: {
    marginBottom: 12,
  },
  botao: {
    marginTop: 16,
    backgroundColor: '#2196F3',
  },
});

export default CadastroDentistaScreen;