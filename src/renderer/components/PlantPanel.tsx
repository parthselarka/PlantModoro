import plant1 from "../assets/stage1.png"
import plant2 from "../assets/stage2.png"
import plant3 from "../assets/stage3.png"
import plant4 from "../assets/stage4.png"
import plant5 from "../assets/stage5.png"
import plant6 from "../assets/stage6.png"

type PlantPanelProps = {
  stage: number;
};
export default function PlantPanel({ stage }: PlantPanelProps) {
  const images = [plant1, plant2, plant3, plant4, plant5, plant6];

  // assume stage is 1-based; clamp to valid range
  const index = Math.max(0, Math.min(images.length - 1, (Number(stage) || 1) - 1));
  const src = images[index];

  return (
    <div className="plant-panel">
      <img style={{maxHeight:"40vh", bottom:0, maxWidth:"400px"}} src={src} alt={`plant stage ${index + 1}`} />
    </div>
  );
}
