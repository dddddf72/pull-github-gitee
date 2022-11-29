import * as React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from 'navigator';

interface IProps {
  route: RouteProp<RootStackParamList, 'Detail'>
}
// export default function Detail() {
//     return (
//       <View>
//         <Text>Detail</Text>
//       </View>
//     );
// }
class Detail extends React.Component<IProps> {
  render() {
    const { route } = this.props
    return (
      <View>
        <Text>Detail</Text>
        <Text>{route.params.id}</Text>
      </View>
    )
  }
}
export default Detail;
