import { palette } from '@/styles/color';
import { BREAK_POINT, GLOBAL_PADDING_X } from '@/styles/global.css';
import { style } from '@vanilla-extract/css';

export const fixedFooter = style({
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center'
});

export const wrapper = style({
  maxWidth: `${BREAK_POINT}px`,
  width: '100%',
  padding: `10px ${GLOBAL_PADDING_X}px 30px`,
  backgroundColor: palette.background,
  boxShadow: '0px -1px 5px 1px rgba(0, 0, 0, 0.1)'
});
