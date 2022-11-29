import React from "react";
import { StyleSheet, View, Text } from "react-native";
import SnapCarousel, { ParallaxImage, AdditionalParallaxProps, Pagination } from "react-native-snap-carousel";
import { viewportWidth, wp, hp } from "@/utils/index";
import { ICarousel } from "@/models/home";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
// const data = [
//   "https://cdn.barnimages.com/wp-content/uploads/2022/10/20221012-barnimages-2-320x213@2x.jpg",
//   "https://cdn.barnimages.com/wp-content/uploads/2022/10/20221012-barnimages-1-320x213@2x.jpg",
//   "https://cdn.barnimages.com/wp-content/uploads/2022/10/20221012-barnimages-4-320x213@2x.jpg",
//   "https://cdn.barnimages.com/wp-content/uploads/2022/10/20221012-barnimages-3-320x213@2x.jpg",
// ];
const sliderWidth = viewportWidth;
const sideWidth = wp(90);
export const sideHeight = hp(26);
const itemWidth = sideWidth + wp(2) * 2;
// interface IProps {
//   data: ICarousel[];
// }

const mapStateToProps = ({ home }: RootState) => ({
  data: home.carousels,
  activeCarouselIndex:home.activeCarouselIndex
})
const connector = connect(mapStateToProps);
type ModelState = ConnectedProps<typeof connector>;
interface IProps extends ModelState {
  // navigation: RootStackNavigation;
}


class ACarousel extends React.Component<IProps> {
  // state = {
  //   activeSlide: 0,
  // };
  onSnapToItem = (index: number) => {
    // this.setState({
    //   activeSlide: index,
    // });
    const {dispatch} = this.props;
    dispatch({
      type:'home/setState',
      payload:{
        activeCarouselIndex:index
      }
    })
  };
  renderItem = (
    { item }: { item: ICarousel },
    parallaxProps?: AdditionalParallaxProps,
  ) => {
    return (
      <ParallaxImage
        source={{ uri: item.image }}
        style={styles.image}
        containerStyle={styles.imageContainer}
        parallaxFactor={0.8}
        showSpinner
        spinnerColor="rgba(0,0,0,0.25)"
        {...parallaxProps}
      />
    );
  };
  // renderItem = (
  //   {item}:{item:string}
  // ) =>{
  //   return <Image source={{uri:item}} style={styles.images}  />
  // };
  get pagination() {
    const {data,activeCarouselIndex} = this.props;
    return (
      <View style={styles.paginationWrapper}>
        <Pagination
          containerStyle={styles.paginationContainer}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dot}
          activeDotIndex={activeCarouselIndex}
          dotsLength={data.length}
          inactiveDotScale={0.7}
          inactiveDotOpacity={0.4}
        />
      </View>
    )
  };
  render() {
    const { data } = this.props;
    return (
      <View>
        <SnapCarousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages
          onSnapToItem={this.onSnapToItem}
          loop
          autoplay
        />
        {this.pagination}
        <Text>aa</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: itemWidth,
    height: sideHeight,
    borderRadius: 8,
  },
  images: {
    width: itemWidth,
    height: sideHeight,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  paginationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    top: -20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dotContainer: {
    marginHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.92)'
  },
})
export default connector(ACarousel);
