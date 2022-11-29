import { useTheme } from '@shopify/restyle'
import { viewportWidth } from '../utils/index'
import { Theme } from './theme'

export const useColors = () => {
  const { colors } = useTheme<Theme>()
  return colors
}

export const useSpacing = () => {
  const { spacing } = useTheme<Theme>()
  return spacing
}

export const useBorderRadii = () => {
  const { borderRadii } = useTheme<Theme>()
  return borderRadii
}

export const useTextVariants = () => {
  const { textVariants } = useTheme<Theme>()
  return textVariants
}

export const useBreakpoints = () => {
  const { breakpoints } = useTheme<Theme>()
  const width = viewportWidth
  return {
    smallPhone: breakpoints.phone > width,
    phone: breakpoints.phone <= width,
  }
}
