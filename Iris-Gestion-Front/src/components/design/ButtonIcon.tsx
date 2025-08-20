import { Button } from "@chakra-ui/react";
import type { ElementType, ReactElement } from "react";

interface ButtonIconProps {
  label: string;
  icon: ReactElement;
  colorScheme?: string;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  onClick?: () => void;
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  size?: string;
  variant?: string;
}

const ButtonIcon = ({
  target = "_blank",
  rel = "noopener noreferrer",
  as,
  href,
  label,
  icon,
  colorScheme = "blue",
  bgColor = "brand.200",
  textColor = "brand.600",
  hoverBgColor = "brand.100",
  onClick,
}: ButtonIconProps) => {
  return (
    <Button
      label=""
      as={as}
      href={href}
      rightIcon={icon}
      colorScheme={colorScheme}
      variant="outline"
      size="lg"
      bg={bgColor}
      color={textColor}
      border="none"
      _hover={{ bg: hoverBgColor }}
      onClick={onClick}
      target = {target}
      rel = {rel}
    >
      {label}
    </Button>
  );
};

export default ButtonIcon;