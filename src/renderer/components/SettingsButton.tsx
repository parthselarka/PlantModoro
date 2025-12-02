import "bootstrap-icons/font/bootstrap-icons.css"

interface SettingButtonProps {
  style?: React.CSSProperties; // Make style optional with '?'
  onClick: () => void;
}

export default function SettingsButton({style, onClick}:SettingButtonProps){
    return(
        <button onClick={onClick} style={{backgroundColor:"transparent", border:"none"}}>
            <i className="bi bi-gear-fill" style={{fontSize:"2em", color:"#e74c3c"}}></i>
        </button>
    )
}