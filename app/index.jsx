import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from "react";
import { Link } from 'expo-router'; // <<< IMPORTANTE: Para navegação
import { Platform } from 'react-native'; // Estava dando erro no meu tive que adicionar isso para integrar com o calendario 

const pomodoro = [
  {
    id: 'focus',
    initialValue: 25 * 60,
    image: require('./image1.png'), // Certifique-se que o caminho está correto
    display: 'Foco'
  },
  {
    id: 'short',
    initialValue: 5 * 60, // Ajustei para 5 minutos (antes era 5 segundos)
    image: require('./image2.png'), // Certifique-se que o caminho está correto
    display: 'Pausa curta'
  },
  {
    id: 'long',
    initialValue: 15 * 60,
    image: require('./image3.png'), // Certifique-se que o caminho está correto
    display: 'Pausa longa'
  }
];

export default function Index() { // Nome da função padrão para Expo Router
  const sound = useRef(null);
  const alarmSound = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true); // Assume que a música começa tocando

  const [timerType, setTimerType] = useState(pomodoro[0]);
  const [timeLeft, setTimeLeft] = useState(timerType.initialValue);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function loadSounds() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false, // Adicionado para consistência
        });

        const { sound: bgSound } = await Audio.Sound.createAsync(
          require('./assets/lofi.mp3'), // Certifique-se que o caminho está correto
          {
            shouldPlay: true, // Música começa tocando
            isLooping: true,
            volume: 1.0,
          }
        );
        sound.current = bgSound;
        // await sound.current.playAsync(); // Removido, pois shouldPlay: true já faz isso

        const { sound: loadedAlarm } = await Audio.Sound.createAsync(
          require('./assets/alarm.mp3'), // Certifique-se que o caminho está correto
          { shouldPlay: false }
        );
        alarmSound.current = loadedAlarm;

      } catch (error) {
        console.log('Erro carregando áudio:', error);
      }
    }

    loadSounds();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
      if (alarmSound.current) {
        alarmSound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(timerType.initialValue);
    setIsRunning(false); // Para o timer ao trocar o tipo
  }, [timerType]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) { // Adicionado isRunning para tocar alarme só se estava rodando
      if (alarmSound.current) {
        alarmSound.current.replayAsync();
      }
      if (sound.current && isPlaying) { // Só pausa a música se ela estiver tocando
        sound.current.pauseAsync();
        setIsPlaying(false);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleSound = async () => {
    if (sound.current) {
      if (isPlaying) {
        await sound.current.pauseAsync();
      } else {
        await sound.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleTimer = async () => {
    if (!isRunning && timeLeft === 0) { // Se o timer zerou e está iniciando novamente
        setTimeLeft(timerType.initialValue); // Reinicia o tempo do tipo atual
    }

    if (!isRunning) {
      // Início do cronômetro: parar alarme e retomar música, se necessário
      if (alarmSound.current) {
        try {
          await alarmSound.current.stopAsync();
        } catch (e) {
          // Alarme já parado ou não carregado
        }
      }

      if (sound.current && !isPlaying) {
        // Não retomar a música automaticamente ao iniciar o timer,
        // Deixar o controle de música independente, a menos que seja um requisito específico
        // await sound.current.playAsync();
        // setIsPlaying(true);
      }
    }
    setIsRunning(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Botão/Link para o Calendário */}
      <View style={styles.calendarLinkContainer}>
        <Link href="/calendario" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>📅 Calendário</Text>
          </Pressable>
        </Link>
      </View>

      <Image source={timerType.image} style={styles.pomodoroImage} />

      <View style={styles.actions}>
        <View style={styles.context}>
          {pomodoro.map(p => (
            <Pressable
              key={p.id}
              style={[
                styles.contextButton, // Estilo base
                timerType.id === p.id ? styles.contextButtonActive : null
              ]}
              onPress={() => setTimerType(p)}
            >
              <Text style={styles.contextButtonText}>
                {p.display}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.timer}>
          {new Date(timeLeft * 1000).toLocaleTimeString('pt-BR', {
            minute: '2-digit',
            second: '2-digit'
          })}
        </Text>

        <Pressable style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>
            {isRunning ? 'Pausar' : (timeLeft === 0 ? 'Reiniciar' : 'Começar')}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.muteButton} onPress={toggleSound}>
        <Text style={styles.muteButtonText}>
          {isPlaying ? "Mutar Música" : "Tocar Música"}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Projeto fictício e sem fins comerciais.
        </Text>
        <Text style={styles.footerText}>
          Desenvolvido por Acriative.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around", // Distribui melhor o espaço vertical
    alignItems: "center",
    backgroundColor: '#021123',
    paddingVertical: 20, // Adiciona um padding vertical geral
  },
  calendarLinkContainer: {
    position: 'absolute',
    top: 60, // Ajustado para dar espaço para a barra de status
    right: 20,
    zIndex: 10,
  },
  navButton: {
    backgroundColor: '#6A0DAD', // Roxo mais vibrante
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pomodoroImage: {
    width: 150, // Defina um tamanho ou use aspectRatio
    height: 150, // Defina um tamanho ou use aspectRatio
    resizeMode: 'contain',
    marginTop: 40, // Margem para não colar no botão de calendário
  },
  actions: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(20, 68, 128, 0.5)', // Uso do rgba para transparência
    width: '85%', // Um pouco mais largo
    borderRadius: 32,
    borderWidth: 1, // Borda mais sutil
    borderColor: 'rgba(20, 68, 128, 0.8)',
    gap: 28, // Espaçamento interno
    alignItems: 'center', // Centraliza os itens internos como o timer e o botão
  },
  context: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%', // Ocupa toda a largura do card de ações
  },
  contextButton: { // Estilo base para os botões de contexto
    padding: 8,
    borderRadius: 8,
  },
  contextButtonActive: {
    backgroundColor: '#144480', // Azul mais forte para ativo
  },
  contextButtonText: {
    fontSize: 13, // Levemente maior
    color: '#FFF',
    paddingHorizontal: 5, // Padding horizontal para texto
  },
  timer: {
    fontSize: 60, // Maior
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace', // Fonte monoespaçada para o timer
  },
  button: {
    backgroundColor: '#B872FF', // Roxo claro
    borderRadius: 32,
    paddingVertical: 12, // Mais padding vertical
    paddingHorizontal: 30, // Mais padding horizontal
    width: '80%', // Largura do botão
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    color: '#021123',
    fontSize: 18,
    fontWeight: '600', // Um pouco mais de peso
  },
  muteButton: {
    marginTop: 20, // Margem acima
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(184, 114, 255, 0.7)', // Com transparência
    borderRadius: 20,
  },
  muteButtonText: {
    color: '#FFF', // Texto branco para contraste
    fontWeight: 'bold',
  },
  footer: {
    // position: 'absolute', // Se quiser fixar no rodapé
    // bottom: 20,
    alignItems: 'center',
    paddingBottom: 10, // Pequeno padding inferior
  },
  footerText: {
    textAlign: 'center',
    color: '#98A0A8',
    fontSize: 12.5,
  }
});