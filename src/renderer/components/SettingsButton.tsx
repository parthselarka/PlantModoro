import 'bootstrap-icons/font/bootstrap-icons.css';

interface SettingButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingButtonProps) {
  return (
    <button
      type="button"
      aria-label="Settings"
      onClick={onClick}
      style={{ backgroundColor: 'transparent', border: 'none' }}
    >
      <i
        className="bi bi-gear-fill"
        style={{ fontSize: '2em', color: '#e74c3c' }}
      />
    </button>
  );
}
