import React from "react";
import Icon from "../../Icon";

export default function PremiumRightArrow({
  size = 24,
  color = "#292D32",
  className = "",
  ...props
}) {
  return (
    <Icon
      size={size}
      color={color}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
    </Icon>
  );
}
