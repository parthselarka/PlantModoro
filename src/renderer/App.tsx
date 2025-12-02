import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderButtons from './components/HeaderButtons';
import './App.css';
import TimerPanel from './components/TimerPanel';
import SettingsButton from './components/SettingsButton';
import MyVerticallyCenteredModal from "./components/SettingsModal"
import PlantPanel from './components/PlantPanel';

function Main() {
  const [modalShow, setModalShow] = React.useState(false);
  const [active, setActive] = useState<"pomodoro" | "short" | "long">('pomodoro');
  const [pomodoroCount, setPomodoroCount] = useState<number>(1);

  const handlePomodoro = () => {
    console.log('handlePomodoro');
    setActive('pomodoro');
  };

  const HandleLongBreak = () => {
    console.log('HandleLongBreak');
    setActive('long');
  };

  const handleShortBreak = () => {
    console.log('handleShortBreak');
    setActive('short');
  };

  // Handle timer expiry: auto-switch modes based on the expired mode
  // Every 4 pomodoros -> long break; otherwise pomodoro -> short break -> pomodoro
  const handleTimerExpire = (expiredMode: "pomodoro" | "short" | "long") => {
    let nextMode: "pomodoro" | "short" | "long";

    if (expiredMode === "pomodoro") {
      // Check if it's time for a long break (every 4 pomodoros)
      // pomodoroCount is the next count (already incremented in onPomodoroExpire)
      if (pomodoroCount % 4 === 0) {
        nextMode = "long";
      } else {
        nextMode = "short";
      }
    } else if (expiredMode === "short") {
      nextMode = "pomodoro";
    } else {
      // After long break, return to pomodoro
      nextMode = "pomodoro";
    }

    console.log(`Timer expired: ${expiredMode} -> switching to ${nextMode}`);
    setActive(nextMode);
  };;

  const tabs = [
    { key: 'pomodoro', title: 'Pomodoro', onClick: handlePomodoro },
    { key: 'short', title: 'Short Break', onClick: handleShortBreak },
    { key: 'long', title: 'Long Break', onClick: HandleLongBreak },
  ];

  return (
    <div className="app-body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:"center",
            width:"100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >

          {/* Center tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map(tab => (
              <HeaderButtons
                key={tab.key}
                title={tab.title}
                onClick={tab.onClick}
              />
            ))}
          </div>

          
        </div>
        
        <TimerPanel
          mode={active}
          onModeChange={setActive}
          onPomodoroExpire={() => setPomodoroCount(c => c + 1)}
          onTimerExpire={handleTimerExpire}
        />
        <div style={{height:"40vh"}}>
          <PlantPanel stage={((pomodoroCount -1) % 6) + 1}/>
        </div>
      </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
