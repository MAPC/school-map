import React, { Component } from 'react';
import { Map, GeoJSON, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import $ from 'jquery';
import './WalkshedMap.css';

const endpoint = window.endpoint || '/data/school2.json';
const bounds = [[40.712, -74.227],[40.774, -74.125]];
const points = [ { coordinates: [42,-71]}, { coordinates: [42,-71]}];
const shed_column_names = ['shed_05','shed_10','shed_15','shed_20'];
const color_map = {
    '2.0': "00FFFF",
    '1.5': "#6600CC",
    '1': "#9966FF",
    '0.5': "#FF33FF"
};

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
    this.fetchSchoolData();
  }

  // filter for non-null values and roll them up into a Leaflet geoJSON object
  collect(cols, data) {
    return cols.filter((col) => {
        return data[col]
      })
      .reduce((geojson, current) => {
        return geojson.addData(data[current]);
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
            return <GeoJSON data={this.state.walksheds} />
        }
    }

    const school = () => {
      if(this.state.school) {
        return <Marker position={this.state.school} />
      }
    }

    const survey_responses = () => {
      let points = this.state.points;
      if (points.length) {
        return points.map((point, index) => 
          <Marker position={[point.coordinates[1], point.coordinates[0]]} key={index} />
        )
      }
    }

    return (
      <div className="WalkshedMap">
        <Map bounds={this.state.bounds}>
          <TileLayer
            url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
          />
          {survey_responses()}
          {geojson()}
          {school()}
        </Map>
      </div>
    );
  }
}

export default WalkshedMap;
