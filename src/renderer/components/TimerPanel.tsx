import { useEffect, useState, useRef } from "react"
import { useTimer } from "react-timer-hook"
import "./main.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import timeupSound from "../assets/sound/timeup.mp3"

type Mode = "pomodoro" | "short" | "long";

type TimerPanelProps = {
    mode: Mode
    onModeChange: (mode: Mode) => void
    onPomodoroExpire?: () => void
    onTimerExpire?: (expiredMode: Mode) => void
}

type SkipButtonProps = {
    disabled: boolean
    onClick: () => void
}

function SkipButton({ disabled, onClick }: SkipButtonProps) {
    return (
        <button
            className={`SkipBtn ${disabled ? "SkipBtn--hidden" : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            <i className="bi bi-skip-end-fill" style={{ fontSize: "2em" }}></i>
        </button>
    )
}

// Timer durations in seconds
const DURATION: Record<Mode, number> = {
    pomodoro: 25*60,
    short: 5*60,
    long: 15*60,
};

// Helper to create expiry date from seconds
function getExpiryFromSeconds(seconds: number): Date {
    const time = new Date();
    time.setSeconds(time.getSeconds() + seconds);
    return time;
}

// Helper to play timeup sound
function playTimeupSound() {
    try {
        const audio = new Audio(timeupSound);
        audio.play().catch(err => console.warn("Failed to play sound:", err));
    } catch (err) {
        console.warn("Error creating audio element:", err);
    }
}

export default function TimerPanel({ mode, onModeChange, onPomodoroExpire, onTimerExpire }: TimerPanelProps) {
    // Store remaining seconds for each mode independently
    const [savedTimes, setSavedTimes] = useState<Record<Mode, number>>({
        pomodoro: DURATION.pomodoro,
        short: DURATION.short,
        long: DURATION.long,
    });

    // Track which mode was last running (to know which one to reset when starting a new one)
    const [lastRunningMode, setLastRunningMode] = useState<Mode | null>(null);

    // Track the previous mode to detect mode switches
    const prevModeRef = useRef<Mode>(mode);

    // Timer hook
    const {
        seconds,
        minutes,
        isRunning,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp: getExpiryFromSeconds(savedTimes[mode]),
        onExpire: () => {
            console.log("Timer expired!", mode);
            // Play sound
            playTimeupSound();
            // Reset the expired mode's saved time to full duration
            setSavedTimes(prev => ({
                ...prev,
                [mode]: DURATION[mode],
            }));
            // Notify parent (for pomodoro count and mode switching logic)
            if (typeof onTimerExpire === "function") {
                onTimerExpire(mode);
            }
            // Pomodoro-specific callback
            if (mode === "pomodoro" && typeof onPomodoroExpire === "function") {
                onPomodoroExpire();
            }
        },
        autoStart: false,
    });

    // Calculate total seconds currently displayed
    const currentTotalSeconds = minutes * 60 + seconds;

    // When mode changes: reset ALL timers to original duration and load new mode
    useEffect(() => {
        if (prevModeRef.current !== mode) {
            // Reset ALL timers to their original durations
            setSavedTimes({
                pomodoro: DURATION.pomodoro,
                short: DURATION.short,
                long: DURATION.long,
            });

            // Pause the timer
            pause();

            // Load the new mode's full duration (since we're resetting)
            const newExpiry = getExpiryFromSeconds(DURATION[mode]);
            restart(newExpiry, false);

            prevModeRef.current = mode;
        }
    }, [mode]);

    // Start/Stop button logic
    const handleToggle = () => {
        if (isRunning) {
            // Pause and save current time
            pause();
            setSavedTimes(prev => ({
                ...prev,
                [mode]: currentTotalSeconds,
            }));
        } else {
            // If starting a new mode (different from last running), reset others
            if (lastRunningMode !== null && lastRunningMode !== mode) {
                // Reset the last running mode to full duration
                setSavedTimes(prev => ({
                    ...prev,
                    [lastRunningMode]: DURATION[lastRunningMode],
                }));
            }
            setLastRunningMode(mode);
            resume();
        }
    };

    // Skip logic: toggles between pomodoro and short break
    const handleSkip = () => {
        if (!isRunning) return;

        // Save current mode's time and reset it
        setSavedTimes(prev => ({
            ...prev,
            [mode]: DURATION[mode], // Reset current mode
        }));

        const nextMode: Mode = mode === "pomodoro" ? "short" : "pomodoro";
        
        // Reset the next mode and start it
        const newExpiry = getExpiryFromSeconds(DURATION[nextMode]);
        setSavedTimes(prev => ({
            ...prev,
            [nextMode]: DURATION[nextMode],
        }));
        setLastRunningMode(nextMode);
        
        // Switch the mode in parent (this will update header tabs too)
        onModeChange(nextMode);
        
        restart(newExpiry, true); // Auto-start the new mode
        
        console.log("Skipped to", nextMode);
    };

    // Container class based on current mode prop
    let containerClass = "TimerPanelContainer pomodoroContainer";
    if (mode === "long") {
        containerClass = "TimerPanelContainer longContainer";
    } else if (mode === "short") {
        containerClass = "TimerPanelContainer shortContainer";
    }

    // Format time as MM:SS
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return (
        <div className={containerClass}>
            <div>{formattedTime}</div>
            <div className="TimerControls">
                <SkipButton disabled={true} onClick={handleSkip} />
                <button className="StartBtn" onClick={handleToggle}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                <SkipButton disabled={!isRunning} onClick={handleSkip} />
            </div>
        </div>
    );
}
