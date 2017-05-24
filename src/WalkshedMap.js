import React, { Component } from 'react';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import $ from 'jquery';
import './WalkshedMap.css';

const endpoint = window.endpoint || '/data/school.json';
const bounds = [[40.712, -74.227],[40.774, -74.125]];
const points = [[42,-71],[42,-71]];
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
      points
    }
  }

  componentDidMount() {
    this.fetchSchoolData();
  }

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
        this.setState({ bounds: this.collect(shed_column_names, data).getBounds() });
      });
  }

  style = (feature) => {
    return {
      color: color_map[feature.properties.distance]
    }
  }

  render() {
    return (
      <div className="WalkshedMap">
        <Map bounds={this.state.bounds}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          <GeoJSON data={this.state.bounds} style={this.style.bind(this)} />
        </Map>
      </div>
    );
  }
}

export default WalkshedMap;
