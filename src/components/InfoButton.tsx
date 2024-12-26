import { Info } from "lucide-react";
import { Button } from "./ui/button";

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Info />
    </Button>
  );
};

export { InfoButton };
