import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, ActivityIndicator, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AgendadosScreen = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega os agendamentos do AsyncStorage
  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        const dados = await AsyncStorage.getItem('agendamentos');
        if (dados) {
          const agendamentosSalvos = JSON.parse(dados);
          if (Array.isArray(agendamentosSalvos)) {
            // Filtra itens inválidos (sem id)
            const agendamentosValidos = agendamentosSalvos.filter((item) => item.id);
            setAgendamentos(agendamentosValidos);
          } else {
            console.error('Dados de agendamentos inválidos:', agendamentosSalvos);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarAgendamentos();
  }, []);

  // Formata a data para exibição
  const formatarData = (data) => {
    if (!data) {
      return 'Data inválida';
    }
    try {
      return format(parseISO(data), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Cancela um agendamento
  const cancelarAgendamento = async (id) => {
    try {
      const novosAgendamentos = agendamentos.filter((item) => item.id !== id);
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
      setAgendamentos(novosAgendamentos); // Atualiza o estado
      console.log('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

  // Renderiza cada item da lista de agendamentos
  const renderItem = ({ item }) => {
    if (!item.id || !item.data) {
      return null; // Ignora itens sem id ou data
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{item.nome} {item.sobrenome}</Text>
          <Text variant="bodyMedium">RG: {item.rg}</Text>
          <Text variant="bodyMedium">Celular: {item.celular}</Text>
          <Text variant="bodyMedium">Data: {formatarData(item.data)}</Text>
          <Text variant="bodyMedium">Horário: {item.horario}</Text>
          <Text variant="bodyMedium">Observação: {item.observacao || 'Nenhuma'}</Text>
          <Button
            mode="contained"
            onPress={() => cancelarAgendamento(item.id)}
            style={styles.botaoCancelar}
          >
            Cancelar Consulta
          </Button>
        </Card.Content>
      </Card>
    );
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>
        Agendamentos Realizados
      </Text>

      <FlatList
        data={agendamentos}
        keyExtractor={(item) => (item.id ? item.id.toString() : '')} // Verifica se o id existe
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.textoVazio}>Nenhum agendamento encontrado.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2196F3',
    fontWeight: '700',
  },
  lista: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 8,
    backgroundColor: 'white',
    elevation: 2,
    padding: 16,
  },
  textoVazio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  botaoCancelar: {
    marginTop: 8,
    backgroundColor: '#FF4444',
  },
});

export default AgendadosScreen;