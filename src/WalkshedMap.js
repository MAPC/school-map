import React, { Component } from 'react';
import { Map, GeoJSON, CircleMarker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import $ from 'jquery';
import LeafletPrintPlugin from './LeafletPrintPlugin';
import './WalkshedMap.css';

const endpoint = window.endpoint || '/data/school2.json';
const bounds = [[40.712, -74.227],[40.774, -74.125]];
const points = [ { coordinates: [42,-71]}, { coordinates: [42,-71]}];
const shed_column_names = ['shed_05','shed_10','shed_15','shed_20'];
const color_map = {
    'shed_20': "00FFFF",
    'shed_15': "#6600CC",
    'shed_10': "#9966FF",
    'shed_05': "#FF33FF"
};

// initialize non-AMD/reacty leaflet plugin
LeafletPrintPlugin();

class WalkshedMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bounds,
      points,
      walksheds: false
    }
  }

  componentDidMount() {
    const map = this.refs.map.leafletElement;        
    L.browserPrint().addTo(map);
    this.fetchSchoolData();
  }

  // filter for non-null values and roll them up into a Leaflet geoJSON object
  collect(cols, data) {
    return cols.filter((col) => {
        return data[col];
      })
      .reduce((geojson, current) => {
        let newObject = {};
        if(data[current]) {
          newObject.type = "Feature";
          newObject.properties = { shed: current };
          newObject.geometry = data[current];
        }
        return geojson.addData(newObject);
      }, L.geoJson(null));
  }

  fetchSchoolData() {
    return $.getJSON(endpoint)
      .then((data) => {

        // flatten survey responses across surveys into one
        let responses = data.surveys.reduce(
          (a,b) => {
            return a.concat(b.survey_responses.map(
              response => { 
                return response.geometry 
              })
            );
          }, 
          []
        );

        let sheds = this.collect(shed_column_names, data);

        this.setState({ bounds: sheds.getBounds(),
                        points: responses,
                        walksheds: sheds.toGeoJSON(),
                        school: { lat: data.wgs84_lat, lng: data.wgs84_lng } });
      });
  }

  style = (feature) => {
    return {
      color: color_map[feature.properties.distance]
    }
  }

  render() {
    const geojson = () => {
        if(this.state.walksheds) {
            return <GeoJSON data={this.state.walksheds}
                            style= { 
                              (feature) => {
                                console.log(feature);
                                return {
                                  color: color_map[feature.properties.shed],
                                  weight: 1,
                                  opacity: 0.3 
                                } 
                              }
                            } />

        }
    }

    const school = () => {
      if(this.state.school) {
        return <CircleMarker  center={this.state.school}
                              color={'red'}
                              fillColor={'#f03'}
                              fillOpacity={0.5} />
      }
    }

    const survey_responses = () => {
      let points = this.state.points;
      if (points.length) {
        return points.map((point, index) => 
          <CircleMarker center={[point.coordinates[1], point.coordinates[0]]} 
                        key={index} 
                        radius={3}
                        fillColor={"#ff7800"}
                        color={"#000"}
                        weight={1}
                        opacity={1}
                        fillOpacity={0.8} />
        )
      }
    }

    return (
      <div className="WalkshedMap">
        <Map bounds={this.state.bounds} ref='map'>
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
