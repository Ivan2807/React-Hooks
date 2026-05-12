import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  // Estados
  const [tiempoRestante, settiempoRestante] = useState(1500); // 25 minutos en segundos
  const [Funcionando, setFuncionando] = useState(false);

// useRef para el intervalo
  const intervalRef = useRef(null)

  //useEffect para el timer
  useEffect(() => {
    if ( Funcionando && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        settiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setFuncionando(false);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [Funcionando, tiempoRestante]);

  // Formatear tiempo MM:SS
  const formatearTiempo = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para iniciar/detener el timer
  const Control = () => {
    setFuncionando(prev => !prev);
  };
  
    return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{formatTime(timeLeft)}</h1>
      
      <p>{timeLeft === 0 ? "¡Sesión completada!" : ""}</p>

      <button onClick={toggleTimer}>
        {isRunning ? 'Pausar' : 'Iniciar'}
      </button>

      <button onClick={resetTimer} style={{ marginLeft: '10px' }}>
        Reiniciar
      </button>
    </div>
  );
  
}
export default Pomodoro;