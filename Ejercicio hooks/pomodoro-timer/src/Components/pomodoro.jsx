import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);

  const [tiempoRestante, setTiempoRestante] = useState(workMins * 60);
  const [funcionando, setFuncionando] = useState(false);
  const [modo, setModo] = useState("Trabajo");
  const [sessions, setSessions] = useState([]);

  const intervalRef = useRef(null);

  // ------------------Temporizador ------------------------------------
useEffect(() => {
    if (funcionando && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setFuncionando(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [funcionando, tiempoRestante]);

  // --------Cambio de modo y Sonido (Nivel 2 y 3)-----------------
  useEffect(() => {
    if (tiempoRestante === 0 && !funcionando) {


        //proteccion contra loop infinito si el usuario pone tiempos en 0
    const nextWork = modo === "Trabajo" ? breakMins : workMins;
      if (nextWork <= 0) {
        alert("El tiempo de Trabajo y Descanso debe ser mayor a 0 minutos");
        setFuncionando(false);
        return;
      }

      // Sonido al terminar
      try {
        new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
      } catch (e) {}

      if (modo === "Trabajo") {
        const newSession = {
          id: Date.now(),
          tipo: "work",
          duracion: workMins * 60,
          completadoEn: new Date()
        };
        setSessions(prev => [...prev, newSession]);
      }

      // Cambiar modo
      const newMode = modo === "Trabajo" ? "Descanso" : "Trabajo";
      setModo(newMode);

      // Nuevo tiempo
      const newTime = newMode === "Trabajo" ? workMins * 60 : breakMins * 60;
      setTiempoRestante(newTime);
      setFuncionando(true);
    }
  }, [tiempoRestante, funcionando, modo, workMins, breakMins]);

  // Actualizar tiempo cuando cambie la configuración
  useEffect(() => {
    if (!funcionando) {
      setTiempoRestante(modo === "Trabajo" ? workMins * 60 : breakMins * 60);
    }
  }, [workMins, breakMins, modo]);

  //-------------Funciones de control-----------------
const Control = () => setFuncionando(prev => !prev);

  const resetTimer = () => {
    setFuncionando(false);
    setModo("Trabajo");
    setTiempoRestante(workMins * 60);
    setSessions([]);
  };

  const guardarParcial = () => {
    const total = modo === "Trabajo" ? workMins * 60 : breakMins * 60;
    if (tiempoRestante === total) return;

    setSessions(prev => [...prev, {
      id: Date.now(),
      tipo: modo === "Trabajo" ? "work (parcial)" : "descanso (parcial)",
      duracion: total - tiempoRestante,
      completadoEn: new Date()
    }]);
  };

  const formatearTiempo = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  // Cálculos para Nivel 3
 const totalSegundos = modo === "Trabajo" ? workMins * 60 : breakMins * 60;
  const progreso = totalSegundos > 0 ? Math.round(((totalSegundos - tiempoRestante) / totalSegundos) * 100) : 0;

  const sesionesTrabajo = sessions.filter(s => s.tipo.includes("work")).length;
  const tiempoTotalTrabajo = sessions
    .filter(s => s.tipo.includes("work"))
    .reduce((sum, s) => sum + s.duracion, 0);

  // ----------------Render----------------- 
  return (
   <div style={{ textAlign: 'center', padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      
      <h2>{modo}</h2>

      {/* Configuración con validación */}
      <div style={{ margin: '20px 0' }}>
        <label>Trabajo (min): </label>
        <input 
          type="number" 
          value={workMins} 
          onChange={(e) => setWorkMins(Math.max(1, Number(e.target.value)))}
          disabled={funcionando}
          min="1" 
          max="60"
          style={{ width: '70px', marginRight: '15px' }}
        />

        <label>Descanso (min): </label>
        <input 
          type="number" 
          value={breakMins} 
          onChange={(e) => setBreakMins(Math.max(1, Number(e.target.value)))}
          disabled={funcionando}
          min="1" 
          max="30"
          style={{ width: '70px' }}
        />
      </div>

      {/* Barra de progreso */}
      <div style={{ height: '15px', background: '#ddd', borderRadius: '10px', margin: '15px 0', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progreso}%`,
          background: modo === 'Trabajo' ? '#b44c33' : '#2a7d4f',
          transition: 'width 0.3s'
        }} />
      </div>

      <h1 style={{ fontSize: '60px' }}>{formatearTiempo(tiempoRestante)}</h1>

      <div>
        <button onClick={Control} style={{ marginRight: '10px', padding: '12px 24px' }}>
          {funcionando ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={guardarParcial} style={{ marginRight: '10px', padding: '12px 20px' }}>
          Guardar Parcial
        </button>
        <button onClick={resetTimer} style={{ padding: '12px 24px' }}>
          Reiniciar Todo
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Sesiones: {sessions.length}</h3>
      </div>
    </div>
  );
}

export default Pomodoro;
