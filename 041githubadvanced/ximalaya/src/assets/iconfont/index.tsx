/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconShouye from './IconShouye';
import IconFuwu from './IconFuwu';
import IconHuodong from './IconHuodong';
import IconFuwu1 from './IconFuwu1';
export { default as IconShouye } from './IconShouye';
export { default as IconFuwu } from './IconFuwu';
export { default as IconHuodong } from './IconHuodong';
export { default as IconFuwu1 } from './IconFuwu1';

export type IconNames = 'icon-shouye' | 'icon-fuwu' | 'icon-huodong' | 'icon-fuwu1';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'icon-shouye':
      return <IconShouye key="1" {...rest} />;
    case 'icon-fuwu':
      return <IconFuwu key="2" {...rest} />;
    case 'icon-huodong':
      return <IconHuodong key="3" {...rest} />;
    case 'icon-fuwu1':
      return <IconFuwu1 key="4" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
