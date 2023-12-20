import React from "react";
import Svg, { Path } from "react-native-svg";

export const ArrowIcon = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="currentColor"
    strokeWidth={1.5}
    stroke={"#EEF0E5"}
  >
    <Path
      fillRule="evenodd"
      d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </Svg>
);
