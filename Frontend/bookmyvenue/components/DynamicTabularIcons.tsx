import * as Icon from "@tabler/icons-react"
import { ComponentType } from "react";

interface DynamicIconProps extends Icon.IconProps {
    // keyof -> is used to lock the in[ut of name to specific names and that is given by type0f Icon which gets the name of the icons to the name 
    name: keyof typeof Icon;
}

export default function DynamicTablerIcon({ name, ...props }: DynamicIconProps) {
//   ComponentType tells that it is a class or functional component

  const IconComponent = Icon[name] as ComponentType<Icon.IconProps>;   
  if (!IconComponent) {
    return <span style={{ color: "red" }}>⚠️</span>;
  }

  return <IconComponent {...props} />;
}