import React, { memo, ReactText, useMemo } from 'react'
import { Switch } from 'react-native'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors } from '../../../theme/themeHooks'

import CarotRight from '../../../assets/images/carot-right.svg'

export type SelectProps = {
  onDonePress?: () => void
  onValueSelect: (value: ReactText, index: number) => void
}

export type MoreListItemType = {
  onPress?: () => void
  onToggle?: (value: boolean) => void
  value?: boolean | string | number
}

const MoreListItem = ({
  item: { title, value, onToggle, onPress },
  isTop = false,
  isBottom = false,
}: {
  item: MoreListItemType
  isTop?: boolean
  isBottom?: boolean
}) => {
  const colors = useColors()

  const handlePress = () => {

    if (onPress) {
      onPress()
    }
  }

  const trackColor = useMemo(
    () => ({
      false: colors.secondaryBackground,
      true: colors.primaryBackground,
    }),
    [colors],
  )


  return (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="secondaryBackground"
      alignItems="center"
      height={48}
      paddingHorizontal="ms"
      marginBottom="xxxs"
      onPress={handlePress}
      disabled={!(onPress)}
      borderTopLeftRadius={isTop ? 'm' : 'none'}
      borderTopRightRadius={isTop ? 'm' : 'none'}
      borderBottomLeftRadius={isBottom ? 'm' : 'none'}
      borderBottomRightRadius={isBottom ? 'm' : 'none'}
    >
      {!onToggle  && onPress && (
        <CarotRight color={colors.secondaryBackground} />
      )}
      {onToggle && (
        <Switch
          value={value as boolean}
          onValueChange={onToggle}
          trackColor={trackColor}
          thumbColor={colors.white}
        />
      )}
      
    </TouchableOpacityBox>
  )
}

export default memo(MoreListItem)
