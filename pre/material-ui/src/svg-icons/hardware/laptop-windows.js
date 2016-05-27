import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from '../../SvgIcon';

let HardwareLaptopWindows = (props) => (
  <SvgIcon {...props}>
    <path d="M20 18v-1c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2v1H0v2h24v-2h-4zM4 5h16v10H4V5z"/>
  </SvgIcon>
);
HardwareLaptopWindows = pure(HardwareLaptopWindows);
HardwareLaptopWindows.displayName = 'HardwareLaptopWindows';

export default HardwareLaptopWindows;
