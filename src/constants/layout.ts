
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Converts a percentage of the screen width to dp.
 * @param widthPercent The percentage of the screen width (e.g., "50%").
 * @returns The calculated dp value.
 */
const widthPercentageToDP = (widthPercent: string | number): number => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Converts a percentage of the screen height to dp.
 * @param heightPercent The percentage of the screen height (e.g., "50%").
 * @returns The calculated dp value.
 */
const heightPercentageToDP = (heightPercent: string | number): number => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

export { widthPercentageToDP as wp, heightPercentageToDP as hp };
