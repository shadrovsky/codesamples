// Один из основных компонентов собственной библиотеки для адаптивной вёрстки и минимизации CSS-кода

import { withStyles } from '@bruitt/classnames'

import s from './Box.module.scss'
import { BackgroundColorProps, ColorProps } from '../../types/colors'

const sx = withStyles(s)

type Factor = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
type Display = 'none' | 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'hidden'
type Rad = '16' | '24' | '32' | 'half' | 'bottom-16'

type DivElementPropsWithoutColor = Omit<JSX.IntrinsicElements['div'], 'color' | 'dir'>

interface BoxModelProps {
  // margins
  m?: Factor
  mx?: Factor
  my?: Factor
  mt?: Factor
  mb?: Factor
  ml?: Factor
  mr?: Factor
  // margins s
  m_s?: Factor
  mx_s?: Factor
  my_s?: Factor
  mt_s?: Factor
  mb_s?: Factor
  ml_s?: Factor
  mr_s?: Factor
  // margins m
  m_m?: Factor
  mx_m?: Factor
  my_m?: Factor
  mt_m?: Factor
  mb_m?: Factor
  ml_m?: Factor
  mr_m?: Factor
  // margins l
  m_l?: Factor
  mx_l?: Factor
  my_l?: Factor
  mt_l?: Factor
  mb_l?: Factor
  ml_l?: Factor
  mr_l?: Factor
  // paddings
  p?: Factor
  px?: Factor
  py?: Factor
  pt?: Factor
  pb?: Factor
  pl?: Factor
  pr?: Factor
  // paddings s
  p_s?: Factor
  px_s?: Factor
  py_s?: Factor
  pt_s?: Factor
  pb_s?: Factor
  pl_s?: Factor
  pr_s?: Factor
  // paddings m
  p_m?: Factor
  px_m?: Factor
  py_m?: Factor
  pt_m?: Factor
  pb_m?: Factor
  pl_m?: Factor
  pr_m?: Factor
  // paddings l
  p_l?: Factor
  px_l?: Factor
  py_l?: Factor
  pt_l?: Factor
  pb_l?: Factor
  pl_l?: Factor
  pr_l?: Factor
  // Hidden (display: none)
  hidden?: boolean
  hidden_s?: boolean
  hidden_m?: boolean
  hidden_l?: boolean
  // Display
  display?: Display
  display_s?: Display
  display_m?: Display
  display_l?: Display
}

export interface BoxProps
  extends BoxModelProps,
    ColorProps,
    BackgroundColorProps,
    DivElementPropsWithoutColor {
  // border radius
  rad?: Rad
  // others
  as?: React.ElementType
  dataTestId?: string
  children?: React.ReactNode
}

export const Box = ({
  children,
  className,
  onClick,
  dataTestId,
  as: Tag = 'div',
  ...rest
}: BoxProps) => {
  return (
    <Tag onClick={onClick} className={sx(className, rest)} data-testid={dataTestId}>
      {children}
    </Tag>
  )
}
