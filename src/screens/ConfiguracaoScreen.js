import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Text, Snackbar, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfiguracaoScreen = () => {
  const [horarios, setHorarios] = useState([]);
  const [novoHorario, setNovoHorario] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const dados = await AsyncStorage.getItem('configHorarios');
      if (dados) setHorarios(JSON.parse(dados));
    } catch (error) {
      setMensagem('Erro ao carregar configurações');
    }
  };

  const salvarConfiguracoes = async () => {
    try {
      await AsyncStorage.setItem('configHorarios', JSON.stringify(horarios));
      setMensagem('Configurações salvas com sucesso!');
    } catch (error) {
      setMensagem('Erro ao salvar configurações');
    }
  };

  const adicionarHorario = () => {
    if (horarios.includes(novoHorario)) {
      setMensagem('Horário já existe!');
      return;
    }
    if (novoHorario.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      setHorarios([...horarios, novoHorario]);
      setNovoHorario('');
    } else {
      setMensagem('Formato inválido (use HH:MM)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurar Horários</Text>

      <TextInput
        label="Novo horário (HH:MM)"
        mode="outlined"
        value={novoHorario}
        onChangeText={setNovoHorario}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button mode="contained" onPress={adicionarHorario} style={styles.botao}>
        Adicionar Horário
      </Button>

      <FlatList
        data={horarios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.horario}>{item}</Text>
          </Card>
        )}
      />

      <Button mode="contained" onPress={salvarConfiguracoes} style={styles.botao}>
        Salvar Configurações
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
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  horario: {
    fontSize: 18,
  },
  botao: {
    marginVertical: 10,
  },
});

export default ConfiguracaoScreen;