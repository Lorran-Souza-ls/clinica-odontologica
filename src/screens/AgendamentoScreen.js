import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { Button, Card, Text, Snackbar, ActivityIndicator, Modal, Portal, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

const HORARIOS_DISPONIVEIS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const AgendamentoScreen = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(HORARIOS_DISPONIVEIS);
  const [dentistas, setDentistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const data = new Date();
    return isValid(data) ? data : new Date(0); // Fallback para uma data válida
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [formulario, setFormulario] = useState({
    nome: '',
    sobrenome: '',
    rg: '',
    celular: '',
    observacao: '',
    dentista: '', 
  });

  
  useFocusEffect(
    React.useCallback(() => {
      const carregarDados = async () => {
        try {
          const [agend, horarios, dentistasSalvos] = await Promise.all([
            AsyncStorage.getItem('agendamentos'),
            AsyncStorage.getItem('configHorarios'),
            AsyncStorage.getItem('dentistas'),
          ]);

          setAgendamentos(agend ? JSON.parse(agend) : []);
          setHorariosDisponiveis(horarios ? JSON.parse(horarios) : HORARIOS_DISPONIVEIS);
          setDentistas(dentistasSalvos ? JSON.parse(dentistasSalvos) : []);
        } catch (error) {
          setMensagem('Erro ao carregar dados');
        } finally {
          setCarregando(false);
        }
      };

      carregarDados();
    }, [])
  );

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date && isValid(date)) {
      setDataSelecionada(date);
    }
  };

  const formatarData = (date) => {
    if (!date || !isValid(date)) {
      return "Data inválida";
    }
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const horariosOcupados = agendamentos
    .filter((item) => {
      const dataAgendamento = new Date(item.data);
      return isValid(dataAgendamento) && format(dataAgendamento, 'yyyy-MM-dd') === format(dataSelecionada, 'yyyy-MM-dd');
    })
    .map((item) => item.horario);

  const handleAgendar = async () => {
    if (!formulario.nome.trim() || !formulario.rg.trim() || !formulario.dentista) {
      setMensagem('Nome, RG e dentista são obrigatórios!');
      return;
    }

    const novoAgendamento = {
      id: Date.now().toString(),
      data: dataSelecionada.toISOString(),
      horario: horarioSelecionado,
      ...formulario,
    };

    try {
      const novosDados = [...agendamentos, novoAgendamento];
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novosDados));
      setAgendamentos(novosDados);
      setMensagem('Agendamento realizado com sucesso!');
      setModalVisivel(false);
      setFormulario({
        nome: '',
        sobrenome: '',
        rg: '',
        celular: '',
        observacao: '',
        dentista: '', 
      });
    } catch (error) {
      setMensagem('Erro ao salvar agendamento');
    }
  };

  const cancelarAgendamento = async (id) => {
    try {
      // Encontra o agendamento que será cancelado
      const agendamentoCancelado = agendamentos.find((item) => item.id === id);
      if (!agendamentoCancelado) return;

     
      const novosAgendamentos = agendamentos.filter((item) => item.id !== id);

   
      const horariosDisponiveis = await AsyncStorage.getItem('configHorarios');
      let horariosLiberados = horariosDisponiveis ? JSON.parse(horariosDisponiveis) : [];
      if (!horariosLiberados.includes(agendamentoCancelado.horario)) {
        horariosLiberados.push(agendamentoCancelado.horario);
        await AsyncStorage.setItem('configHorarios', JSON.stringify(horariosLiberados));
      }

     
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
      setAgendamentos(novosAgendamentos); 
      setMensagem('Agendamento cancelado com sucesso!');
    } catch (error) {
      setMensagem('Erro ao cancelar agendamento');
    }
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
        Agendamento de Consultas
      </Text>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dataButton}
        icon="calendar"
      >
        {formatarData(dataSelecionada)}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          locale="pt-BR"
        />
      )}

      <FlatList
        data={horariosDisponiveis}
        numColumns={2}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.card,
              horariosOcupados.includes(item) && styles.cardOcupado,
            ]}
            disabled={horariosOcupados.includes(item)}
          >
            <Card.Content style={styles.cardContent}>
              <Text variant="bodyLarge">{item}</Text>
              <Button
                mode={horariosOcupados.includes(item) ? "text" : "contained"}
                onPress={() => {
                  setHorarioSelecionado(item);
                  setModalVisivel(true);
                }}
                disabled={horariosOcupados.includes(item)}
                compact
                style={styles.botaoHorario}
              >
                {horariosOcupados.includes(item) ? 'Ocupado' : 'Agendar'}
              </Button>
            </Card.Content>
          </Card>
        )}
      />

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Agendados')}
        style={styles.botaoAgendados}
      >
        Ver Agendados
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CadastroDentista')}
        style={styles.botaoCadastroDentista}
      >
        Cadastrar Dentista
      </Button>

      <Portal>
        <Modal
          visible={modalVisivel}
          onDismiss={() => setModalVisivel(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Title
              title="Novo Agendamento"
              subtitle={`${formatarData(dataSelecionada)} - ${horarioSelecionado}`}
            />
            <Card.Content>
              <TextInput
                label="Nome *"
                mode="outlined"
                value={formulario.nome}
                onChangeText={(text) => setFormulario({ ...formulario, nome: text })}
                style={styles.input}
              />
              <TextInput
                label="Sobrenome"
                mode="outlined"
                value={formulario.sobrenome}
                onChangeText={(text) => setFormulario({ ...formulario, sobrenome: text })}
                style={styles.input}
              />
              <TextInput
                label="RG Militar *"
                mode="outlined"
                value={formulario.rg}
                onChangeText={(text) => setFormulario({ ...formulario, rg: text })}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Celular"
                mode="outlined"
                value={formulario.celular}
                onChangeText={(text) => setFormulario({ ...formulario, celular: text })}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                label="Observações"
                mode="outlined"
                value={formulario.observacao}
                onChangeText={(text) => setFormulario({ ...formulario, observacao: text })}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
              <TextInput
                label="Dentista *"
                mode="outlined"
                value={formulario.dentista}
                onChangeText={(text) => setFormulario({ ...formulario, dentista: text })}
                style={styles.input}
              />
              <View style={styles.botoesModal}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisivel(false)}
                  style={styles.botaoCancelar}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAgendar}
                  style={styles.botaoConfirmar}
                >
                  Confirmar
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      <Snackbar
        visible={!!mensagem}
        onDismiss={() => setMensagem('')}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setMensagem(''),
        }}
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
  dataButton: {
    margin: 8,
    borderColor: '#2196F3',
  },
  lista: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: 'white',
    elevation: 2,
    padding: 8,
  },
  cardOcupado: {
    backgroundColor: '#FFF3F3',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  botaoHorario: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  botaoAgendados: {
    marginTop: 16,
    backgroundColor: '#2196F3',
  },
  botaoCadastroDentista: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
  modal: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  botaoCancelar: {
    flex: 1,
    marginRight: 8,
  },
  botaoConfirmar: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AgendamentoScreen;