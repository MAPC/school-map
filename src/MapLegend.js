import React, { Component } from 'react';
import hexToRgb from './utils/hex-to-rgb';
import { shedColorMap, modes } from './utils/data-maps';

import './styles/MapLegend.css';


class MapLegend extends Component {

  render() {

    const renderModes = () => {
      const uniqueModeCodes = [...new Set(this.props.points.map(point => point.to_school))].filter(x => x !== null);
      const uniqueModes = uniqueModeCodes.map(code => modes[code]);

      return uniqueModes.map((mode, index) => {
        return (
          <li key={index}>
            <span style={{background: mode.color}}></span>
            {mode.name}
          </li>
        );
      });
    };

    const renderWalksheds = () => {
      const shedKeys = Object.keys(shedColorMap).reverse();
      const colors = Object.values(shedColorMap).reverse();

      const distances = shedKeys.map(key => parseFloat(key.split('_')[1]) / 10);

      return distances.map((distance, index) => {
        var rgb = hexToRgb(colors[index]);

        return (
          <li key={index}>
            <span style={{background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .3)`}}></span>
            {distance.toFixed(1)} Mile
          </li>
        );
      });
    };


    return (
      <div className="MapLegend">

        <div className="modes">
          <h4>Approx. home locations and travel to school mode</h4>
          <ul>
            {renderModes()}
          </ul>
        </div>

        <div className="walksheds">
          <h4>Walksheds</h4>
          <ul>
            {renderWalksheds()}
          </ul>
        </div>

      </div>
    );
  }

}


export default MapLegend;
