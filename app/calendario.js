import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Link } from 'expo-router'; // Para navegação de volta

// Configuração para o Português (opcional, mas recomendado)
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

export default function CalendarScreen() { // Renomeado para CalendarScreen
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = (day) => {
    console.log('selected day', day);
    setSelectedDate(day.dateString);
    setMarkedDates({
      [day.dateString]: { selected: true, selectedColor: '#00adf5', marked: true, dotColor: 'red' },
    });
  };

  const eventos = {
    // Use a data atual ou datas futuras para exemplos
    '2025-05-28': { marked: true, dotColor: 'red', activeOpacity: 0 }, // Ex: Prova
    '2025-06-05': { marked: true, dotColor: 'blue', activeOpacity: 0 }, // Ex: Trabalho
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]} // Mostra o mês atual
        minDate={'2024-01-01'}
        maxDate={'2026-12-31'}
        onDayPress={onDayPress}
        markedDates={{ ...eventos, ...markedDates }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#f0f0f0', // Um fundo um pouco diferente para a tela
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: 'blue',
          indicatorColor: 'blue',
        }}
      />
      {selectedDate ? <Text style={styles.selectedText}>Data Selecionada: {selectedDate}</Text> : null}

      <Link href="/" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>Voltar para Pomodoro</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Cor de fundo para a tela do calendário
    paddingTop: 40, // Espaço para o cabeçalho/status bar
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  navButton: {
    marginTop: 30,
    backgroundColor: '#B872FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  navButtonText: {
    color: '#021123',
    fontSize: 16,
    fontWeight: 'bold',
  }
});