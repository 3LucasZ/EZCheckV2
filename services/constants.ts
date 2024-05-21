import { transition } from "@chakra-ui/react";

export const debugMode = true;
export const PINLen = 6;

//common props
export const responsivePx = [2, "5vw", "10vw", "15vw"];
export const responsiveHeaderFontSize = ["2xl", "2xl", "2xl", "3xl", "4xl"];
export const responsiveSubheaderFontSize = ["lg", "lg", "lg", "xl", "2xl"];

//common styles
export const btnBase = {
  color: "white",
  transition: "background-color 0.3s",
};

export const tealBtn = {
  bg: "teal.300",
  _hover: { bg: "teal.400" },
  _active: { bg: "teal.500" },
  ...btnBase,
};

export const redBtn = {
  bg: "red.300",
  _hover: { bg: "red.400" },
  _active: { bg: "red.500" },
  ...btnBase,
};

export const orangeBtn = {
  bg: "orange.200",
  _hover: { bg: "orange.300" },
  _active: { bg: "orange.400" },
  ...btnBase,
};
