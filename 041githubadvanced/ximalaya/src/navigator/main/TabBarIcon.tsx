import React, { memo } from 'react'
import Cog from '@/assets/images/cog.svg'
import Box from '../../components/Box'
import { MainTabType, TabBarIconType } from './tabTypes'
import { useColors } from '../../theme/themeHooks'

type Props = {
  name: MainTabType
} & TabBarIconType

const Icona = ({
  size,
  color,
  name,
}: {
  color: string
  size: number
  name: MainTabType
}) => {
  
  return <Cog color={color} height={size} width={size} />
}

const TabBarIcon = ({ name, focused, size }: Props) => {
  const { black, bobcatRed } = useColors()
  const color = focused ? bobcatRed : black

  return (
    <Box
      alignItems="center"
      flex={1}
      justifyContent="center"
      padding="xxxs"
      paddingTop="s"
    >
      <Icona size={size} color={color} name={name} />
    </Box>
  )
}

export default memo(TabBarIcon)
