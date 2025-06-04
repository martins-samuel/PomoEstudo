import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Link } from 'expo-router';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [eventos, setEventos] = useState({});

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setMarkedDates({
      [day.dateString]: { selected: true, selectedColor: '#B872FF', marked: true, dotColor: '#FF5C8D' },
    });
  };

  const salvarEvento = () => {
    if (!selectedDate) return;

    const novoEvento = {
      ...eventos,
      [selectedDate]: {
        marked: true,
        dotColor: '#FF5C8D', // Rosa neon
        activeOpacity: 0,
      },
    };
    setEventos(novoEvento);
    Alert.alert('Evento salvo', `Evento salvo para o dia ${selectedDate}`);
  };

  const excluirEvento = () => {
    if (!selectedDate || !eventos[selectedDate]) return;

    const novosEventos = { ...eventos };
    delete novosEventos[selectedDate];
    setEventos(novosEventos);
    Alert.alert('Evento excluído', `Evento removido do dia ${selectedDate}`);
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={'2024-01-01'}
        maxDate={'2026-12-31'}
        onDayPress={onDayPress}
        markedDates={{ ...eventos, ...markedDates }}
        theme={{
          backgroundColor: '#021123',
          calendarBackground: '#021123',
          textSectionTitleColor: '#B872FF',
          selectedDayBackgroundColor: '#B872FF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#FF5C8D',
          dayTextColor: '#ffffff',
          textDisabledColor: '#3a3a3a',
          dotColor: '#FF5C8D',
          selectedDotColor: '#ffffff',
          arrowColor: '#B872FF',
          monthTextColor: '#B872FF',
          indicatorColor: '#B872FF',
        }}
      />

      {selectedDate ? <Text style={styles.selectedText}>Data Selecionada: {selectedDate}</Text> : null}

      <Pressable style={styles.button} onPress={salvarEvento}>
        <Text style={styles.buttonText}>Salvar Evento</Text>
      </Pressable>

      <Pressable style={[styles.button, { backgroundColor: '#FF5C8D' }]} onPress={excluirEvento}>
        <Text style={styles.buttonText}>Excluir Evento</Text>
      </Pressable>

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Voltar para Pomodoro</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
    paddingTop: 40,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#B872FF',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#021123',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
