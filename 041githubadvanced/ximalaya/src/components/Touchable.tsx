import React from "react";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
const Touchable: React.FC<TouchableOpacityProps> = React.memo(props => (
  <TouchableOpacity activeOpacity={0.8} {...props} />
));
export default Touchable;
