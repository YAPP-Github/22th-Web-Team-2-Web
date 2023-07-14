import { palette } from '@/styles/color';
import { RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { variants } from '../Typography/Typography.css';
import { createVar, style } from '@vanilla-extract/css';

const width = createVar('width');
export const ButtonWrapper = recipe({
  base: {
    width,
    height: '48px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer'
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: palette.primary300,
        color: palette.white,
        transitionTimingFunction: 'ease-out',
        transitionDuration: '0.2s',

        '&:hover, &:active': {
          backgroundColor: palette.primary400
        },
        '&:disabled': {
          backgroundColor: palette.primary100
        }
      },
      line: {
        border: `solid 1px ${palette.gray300}`,
        backgroundColor: palette.gray50,
        color: palette.gray600,

        selectors: {
          '&:active': {
            border: `solid 1px ${palette.primary300}`,
            color: palette.primary300
          },
          '&:disabled': {
            border: 'inherit',
            color: 'inherit'
          }
        }
      }
    },
    disabled: {
      true: {
        transitionDuration: '0.4s',
        cursor: 'not-allowed'
      }
    },
    size: {
      // 추후 사이즈 variants 추가 여부에 따라서 변경
      xsmall: [
        variants.caption1,
        {
          height: '34px',
          borderRadius: '4px'
        }
      ],
      small: [
        variants.button1,
        {
          height: '40px',
          borderRadius: '4px'
        }
      ],
      middle: variants.h4,
      large: variants.h4
    }
  },
  compoundVariants: [
    {
      variants: {
        variant: 'line',
        size: 'middle'
      },
      style: variants.button2
    }
  ]
});

export const prefixIcon = style({
  width: '20px',
  height: '20px',
  marginRight: '8px',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: palette.gray500,

  selectors: {
    [`button:active &`]: {
      backgroundColor: palette.primary300
    }
  }
});

type ButtonVariants = RecipeVariants<typeof ButtonWrapper>;
export type ButtonSizeType = NonNullable<ButtonVariants>['size'];
export type ButtonVariant = NonNullable<ButtonVariants>['variant'];
