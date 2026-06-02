import React from "react";
import Icon from "../../Icon";

export default function PremiumDownArrow({
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
      <path d="m6 9 6 6 6-6"></path>
    </Icon>
  );
}
