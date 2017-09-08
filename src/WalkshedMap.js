import React, { Component } from 'react';
import { Map, GeoJSON, CircleMarker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import LeafletPrintPlugin from './LeafletPrintPlugin';
import './WalkshedMap.css';

const shedColorMap = {
    'shed_20': "00FFFF",
    'shed_15': "#6600CC",
    'shed_10': "#9966FF",
    'shed_05': "#FF33FF"
};

const modes = {
  'w':  { color: '#004DF1', name: 'Walk' },
  'fv': { color: '#DC533C', name: 'Family Vehicle (only children in your family)' },
  'cp': { color: '#D49AE8', name: 'Carpool (with children from other families)' },
  'sb': { color: '#FFF760', name: 'School Bus' },
  'b':  { color: '#B4E299', name: 'Bicycle' },
  't':  { color: '#6C357C', name: 'Transit (city bus, subyway, etc.)' },
  'o':  { color: '#D3D3D3', name: 'Other (skateboard, scooter, inline skates, etc.)' },
};


// initialize non-AMD/reacty leaflet plugin
LeafletPrintPlugin();

class WalkshedMap extends Component {

  componentDidMount() {
    const map = this.refs.map.leafletElement;        
    L.browserPrint().addTo(map);
  }

  style = (feature) => {
    return {
      color: shedColorMap[feature.properties.distance]
    }
  }

  render() {
    const geojson = () => {
        if (this.props.walksheds) {
            return <GeoJSON data={this.props.walksheds}
                            style= { 
                              (feature) => {
                                return {
                                  color: shedColorMap[feature.properties.shed],
                                  weight: 1,
                                  opacity: 0.3 
                                } 
                              }
                            } />

        }
    };

    const school = () => {
      if(this.props.school) {
        return <CircleMarker  center={this.props.school}
                              color={'red'}
                              fillColor={'#f03'}
                              fillOpacity={0.5} />
      }
    };

    const survey_responses = () => {
      const points = this.props.points;

      if (points.length > 0) {
        return points.map((point, index) => {
          var geom = point.geometry;

          return <CircleMarker center={[geom.coordinates[1], geom.coordinates[0]]} 
                        key={index} 
                        radius={3}
                        fillColor={modes[point.to_school].color}
                        color={"#000"}
                        weight={1}
                        opacity={1}
                        fillOpacity={0.8} />
        });
      }
    };

    return (
      <div className="WalkshedMap">
        <Map bounds={this.props.bounds} ref='map'>
          <TileLayer
            url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
          />
          {geojson()}
          {school()}
          {survey_responses()}
        </Map>
      </div>
    );
  }
}

export default WalkshedMap;
