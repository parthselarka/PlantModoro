import './Buttons.css';
import './main.css';

type HeaderButtonsProps = {
  title: string;
  onClick: () => void;
};

export default function HeaderButtons({ onClick, title }: HeaderButtonsProps) {
  return (
    <button type="button" className="header-btn" onClick={onClick}>
      {title}
    </button>
  );
}
