/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

let IconFuwu: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M740.918713 161.776524c-9.842159 0.73985-19.808138 0.760317-29.488615 2.431376-8.927323 1.541099-17.663288 4.519943-26.276457 7.471159-10.68741 3.663436-21.313422 7.601118-31.671327 12.097526-6.331195 2.7486-12.332886 6.437619-18.08796 10.293437-11.113105 7.444553-22.569018 14.57188-32.741705 23.178909-12.81998 10.846022-24.658609 22.880103-36.633339 34.69315-18.037818 17.793248-35.818787 35.845393-53.722552 53.774741-18.258852 18.286482-36.512588 36.577057-54.80521 54.828746-18.061354 18.022469-36.19434 35.974329-54.247508 54.004985-15.998369 15.978926-31.949666 32.004925-47.877427 48.054459-3.608178 3.635807-5.684466 3.618411-9.289574-0.030699-7.179516-7.267521-14.363126-14.537088-21.779026-21.560038-2.486634-2.354628-2.53166-3.625574-0.078795-6.085602 76.194356-76.389808 152.23317-152.935158 228.508367-229.244124 13.804401-13.81054 28.835745-26.317389 45.512566-36.674271 9.887184-6.139837 19.495006-12.795421 29.721929-18.303878 8.868995-4.776793 18.381649-8.388041 27.706015-12.281721 7.011694-2.927679 14.177907-5.485945 21.273513-8.214079 0.476861-0.183172 0.916882-0.50142 1.406023-0.604774 15.087627-3.192715 29.964452-7.43432 45.571918-7.861038 6.711865-0.184195 13.372565-1.812275 20.092617-2.348488 2.400676-0.191358 4.883217 1.052982 7.362688 1.376347 6.51846 0.852414 13.037944 1.822508 19.589151 2.251274 6.983041 0.457418 13.680581 1.059122 20.38119 3.8814 7.582699 3.193739 16.086373 4.15667 23.777543 7.148817 8.812713 3.429099 17.441231 7.549953 25.660426 12.230556 10.128685 5.767354 20.020986 12.045337 29.504988 18.816554 7.02295 5.0142 13.746072 10.679223 19.690458 16.922415 11.363815 11.936867 22.647813 24.042579 32.832779 36.97103 5.536087 7.027044 9.149381 15.705704 12.904914 23.967878 4.960988 10.916631 10.41521 21.838378 13.449313 33.341363 3.437286 13.030781 5.495154 26.647917 6.223748 40.114626 0.935302 17.302061 0.064468 34.709523-0.293689 52.065819-0.079818 3.861958-1.199315 7.713682-1.956561 11.546987-0.692778 3.50687-1.808182 6.947226-2.278903 10.477632-2.349511 17.626449-7.737218 34.382065-14.205537 50.850132-4.196579 10.68434-8.05342 21.51399-12.618389 32.03767-2.318812 5.346775-5.915733 10.131755-8.846482 15.220656-3.288906 5.711072-6.073322 11.757788-9.79611 17.163915-7.586792 11.015891-14.908548 22.354124-23.692608 32.373315-15.096836 17.21815-30.965246 33.786501-46.982034 50.164516-31.534204 32.244378-63.297628 64.265676-95.148034 96.198969-22.218024 22.275329-44.648896 44.339858-67.149353 66.329684-17.274432 16.883529-34.819017 33.490765-52.219315 50.246381-13.125949 12.638855-26.214035 25.316595-39.318494 37.97694-17.745153 17.143449-35.505655 34.270525-53.207829 51.458999-1.422396 1.381463-2.14792 3.665483-3.742231 4.627391-1.364067 0.822738-4.320399 1.169639-5.183046 0.319272-6.751774-6.659677-13.031804-13.794168-19.712971-20.528546-21.459754-21.633716-42.943045-43.24799-64.590064-64.693418-12.682857-12.565177-25.814945-24.677029-38.533618-37.20639-18.055215-17.787108-35.93749-35.749202-53.852512-53.67855-17.793248-17.808598-35.504632-35.701107-53.308113-53.499471-17.928325-17.924231-35.956933-35.749202-53.886281-53.673433-18.044982-18.040888-36.435841-35.760458-53.907771-54.341652-16.390295-17.430998-32.133861-35.507702-47.457872-53.888328-7.886621-9.459442-14.870686-19.828604-21.109784-30.462802-6.53995-11.146874-11.748578-23.078625-17.442254-34.714639-2.88777-5.901407-6.01704-11.743462-8.219195-17.904789-2.611477-7.30743-4.348028-14.926968-6.451946-22.415522-0.596588-2.122337-1.196245-4.245697-1.711991-6.387477-1.147126-4.764514-2.38635-9.513678-3.325745-14.320147-1.333368-6.820336-2.921539-13.645788-3.511987-20.544919-0.809435-9.455349-1.541099-19.030425-0.935302-28.466332 0.812505-12.678764 2.333138-25.38618 4.686742-37.867446 1.806135-9.580193 5.194302-18.886139 8.218172-28.203342 1.868557-5.759167 4.266164-11.356652 6.620791-16.944927 2.227738-5.285377 4.266164-10.726296 7.170307-15.636119 6.269797-10.601452 12.644995-21.185508 19.73446-31.242562 5.556553-7.882528 11.811-15.392572 18.545378-22.299889 10.091846-10.350742 20.37198-20.642133 31.527041-29.794583 8.694009-7.133468 18.815531-12.537548 28.361955-18.61701 2.838651-1.807159 5.774517-3.5345 8.846482-4.892427 10.467399-4.628414 20.786419-9.753131 31.598672-13.390985 9.593496-3.227508 19.720134-4.980431 29.704532-6.89606 6.16542-1.182942 13.276375 0.132006 18.605753-2.462075 11.051707-5.378497 22.318308-2.331092 33.441647-3.173273 1.757017-0.13303 3.631714 1.155313 5.436826 1.826602 1.880837 0.698918 3.695159 1.88493 5.622044 2.092661 7.448646 0.802272 15.07023 0.608867 22.367427 2.075265 10.588149 2.12643 21.001313 5.198395 31.392988 8.197706 7.131421 2.057869 14.267958 4.278443 21.098527 7.148817 8.68787 3.65218 17.277502 7.65433 25.527396 12.19781 10.489912 5.777587 20.735253 12.034081 30.804586 18.521842 4.52506 2.915399 8.357342 6.904247 12.521175 10.385535 4.564969 3.815909 9.233292 7.513114 13.70207 11.438517 4.672416 4.103458 4.600785 7.203052 0.360204 10.908444-7.15291 6.251378-14.222933 12.600993-21.264303 18.978237-4.047176 3.665483-5.40408 3.27458-9.435906-0.01228-9.949606-8.110725-20.046568-16.078187-30.497595-23.52274-6.989181-4.978385-14.603603-9.110495-22.103414-13.326517-3.675716-2.067079-7.6574-3.659343-11.626805-5.119601-6.958482-2.560312-13.954827-5.052063-21.045315-7.210215-9.067516-2.759857-18.205641-5.308913-27.38879-7.653307-4.261047-1.087774-8.676613-1.792832-13.063527-2.131547-20.069081-1.547239-40.198537-1.938142-60.114123 1.1328-8.589632 1.325182-16.879436 4.76042-25.214265 7.516184-6.204305 2.051729-12.478196 4.107551-18.325367 6.969739-6.619768 3.240811-13.134135 6.92062-19.092847 11.239995-9.581216 6.945179-19.430538 13.803377-27.78788 22.089088-12.612249 12.502755-25.207102 25.264407-34.297131 40.774659-6.737448 11.496845-14.31503 22.753213-19.151176 35.048237-5.727445 14.561647-11.639085 29.418007-12.145621 45.525869-0.342808 10.886955-1.412163 21.810748-0.857531 32.650631 0.542352 10.616802 2.26867 21.239743 4.330632 31.691793 1.90028 9.628288 4.716418 19.097964 7.565303 28.505217 1.450025 4.787026 3.659343 9.382695 5.880941 13.889335 4.78191 9.698896 8.971325 19.827581 14.894222 28.794813 10.169617 15.395642 20.152992 31.251771 32.528857 44.799322 79.126128 86.621846 164.962076 166.661787 247.036349 250.403027 20.651342 21.070898 41.597397 41.85527 62.593594 62.58336 9.432837 9.312086 19.268856 18.218944 29.025057 27.198455 5.009084 4.609994 5.185093 4.296863 10.119475-0.611937 10.725272-10.670014 21.665439-21.12411 32.506345-31.677467 18.275225-17.790178 36.483936-35.648918 54.826699-53.369511 22.278399-21.522176 44.776809-42.817178 66.971297-64.425312 16.58677-16.148795 32.862455-32.618908 49.238424-48.982598 21.435195-21.419845 42.890856-42.819225 64.225767-64.338331 14.263865-14.385639 28.613688-28.703739 42.392506-43.545772 9.117658-9.82067 17.904789-20.078291 25.706475-30.952966 6.771217-9.438976 12.152784-19.908422 17.770735-30.131251 4.488221-8.167007 8.709359-16.513092 12.480242-25.031093 3.001357-6.779404 5.294586-13.890358 7.622608-20.946055 2.162246-6.55223 3.813862-13.272281 5.934153-19.839861 8.268314-25.615401 10.864442-51.984978 8.53642-78.585823-1.12666-12.876262-4.782933-25.64917-8.399297-38.148855-2.562359-8.859785-6.615675-17.35732-10.648524-25.705452-5.78475-11.973706-13.570063-22.666232-23.122627-31.951713-8.268314-8.037047-16.452717-16.213263-25.28078-23.605627-6.183839-5.177929-13.225209-9.410324-20.177552-13.573133-7.800663-4.670369-15.798824-9.063423-23.969924-13.047154-5.276167-2.572592-10.913561-4.561899-16.575514-6.147-7.506974-2.102894-15.118326-4.235464-22.826891-5.098111-7.740288-0.86674-15.654538-0.190335-23.49204-0.190335C740.950436 162.614611 740.934063 162.195056 740.918713 161.776524z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconFuwu.defaultProps = {
  size: 18,
};

IconFuwu = React.memo ? React.memo(IconFuwu) : IconFuwu;

export default IconFuwu;
