import React, { Component } from 'react';
import L from 'leaflet';

function LeafletPrintPlugin() {
  // couldn't figure out how to import this plugin ¯\_(ツ)_/¯
  !function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e){L.Control.BrowserPrint=L.Control.extend({options:{title:"Print map",position:"topleft",printLayer:null,printModes:["Portrait","Landscape","Auto","Custom"],printModesNames:{Portrait:"Portrait",Landscape:"Landscape",Auto:"Auto",Custom:"Custom"},closePopupsOnPrint:!0,contentSelector:"[leaflet-browser-print-content]"},onAdd:function(t){var e=L.DomUtil.create("div","leaflet-control-browser-print leaflet-bar leaflet-control");return L.DomEvent.disableClickPropagation(e),this._appendControlStyles(e),L.DomEvent.addListener(e,"mouseover",this._displayPageSizeButtons,this),L.DomEvent.addListener(e,"mouseout",this._hidePageSizeButtons,this),this.options.position.indexOf("left")>0?(this._createIcon(e),this._createMenu(e)):(this._createMenu(e),this._createIcon(e)),setTimeout(function(){e.className+=parseInt(L.version)?" v1":" v0-7"},10),t.printControl=this,e},_createIcon:function(t){var e=L.DomUtil.create("a","",t);return this.link=e,this.link.id="leaflet-browser-print",this.link.title=this.options.title,this.link},_createMenu:function(t){this.holder=L.DomUtil.create("ul","browser-print-holder",t);for(var e=[],n=0;n<this.options.printModes.length;n++){var i=this.options.printModes[n],r=i[0].toUpperCase()+i.substring(1).toLowerCase();if(this["_print"+r]){var o=L.DomUtil.create("li","browser-print-mode",this.holder);this.options.printModesNames&&this.options.printModesNames[r]?o.innerHTML=this.options.printModesNames[r]:o.innerHTML=r,L.DomEvent.addListener(o,"click",this["_print"+r],this),e.push(o)}}this.options.printModes=e},_displayPageSizeButtons:function(){this.options.position.indexOf("left")>0?(this.link.style.borderTopRightRadius="0px",this.link.style.borderBottomRightRadius="0px"):(this.link.style.borderTopLeftRadius="0px",this.link.style.borderBottomLeftRadius="0px"),this.options.printModes.forEach(function(t){t.style.display="inline-block"})},_hidePageSizeButtons:function(){this.options.position.indexOf("left")>0?(this.link.style.borderTopRightRadius="",this.link.style.borderBottomRightRadius=""):(this.link.style.borderTopLeftRadius="",this.link.style.borderBottomLeftRadius=""),this.options.printModes.forEach(function(t){t.style.display=""})},_printLandscape:function(){this._addPrintClassToContainer(this._map,"leaflet-browser-print--landscape"),this._print("Landscape")},_printPortrait:function(){this._addPrintClassToContainer(this._map,"leaflet-browser-print--portrait"),this._print("Portrait")},_printAuto:function(){this._addPrintClassToContainer(this._map,"leaflet-browser-print--auto");var t=this._getBoundsForAllVisualLayers();this._print(this._getPageSizeFromBounds(t),t)},_printCustom:function(){this._addPrintClassToContainer(this._map,"leaflet-browser-print--custom"),this._map.on("mousedown",this._startAutoPoligon,this)},_addPrintClassToContainer:function(t,e){var n=t.getContainer();-1===n.className.indexOf(e)&&(n.className+=" "+e)},_removePrintClassFromContainer:function(t,e){var n=t.getContainer();n.className&&n.className.indexOf(e)>-1&&(n.className=n.className.replace(" "+e,""))},_startAutoPoligon:function(t){t.originalEvent.preventDefault(),t.originalEvent.stopPropagation(),this._map.dragging.disable(),this.options.custom={start:t.latlng},this._map.off("mousedown",this._startAutoPoligon,this),this._map.on("mousemove",this._moveAutoPoligon,this),this._map.on("mouseup",this._endAutoPoligon,this)},_moveAutoPoligon:function(t){this.options.custom&&(t.originalEvent.preventDefault(),t.originalEvent.stopPropagation(),this.options.custom.rectangle?this.options.custom.rectangle.setBounds(L.latLngBounds(this.options.custom.start,t.latlng)):(this.options.custom.rectangle=L.rectangle([this.options.custom.start,t.latlng],{color:"gray",dashArray:"5, 10"}),this.options.custom.rectangle.addTo(this._map)))},_endAutoPoligon:function(t){if(t.originalEvent.preventDefault(),t.originalEvent.stopPropagation(),this._map.off("mousemove",this._moveAutoPoligon,this),this._map.off("mouseup",this._endAutoPoligon,this),this._map.dragging.enable(),this.options.custom&&this.options.custom.rectangle){var e=this.options.custom.rectangle.getBounds();this._map.removeLayer(this.options.custom.rectangle),this.options.custom=void 0,this._print(this._getPageSizeFromBounds(e),e)}else this._clearPrint()},_getPageSizeFromBounds:function(t){return Math.abs(t.getNorth()-t.getSouth())>Math.abs(t.getEast()-t.getWest())?"Portrait":"Landscape"},_setupMapSize:function(t,e){switch(e){case"Landscape":t.style.width="1040px",t.style.height="715px";break;default:case"Portrait":t.style.width="715px",t.style.height="1040px"}},_print:function(t,e){var n=this,i=this._map.getContainer(),r={bounds:this._map.getBounds(),width:i.style.width,height:i.style.height,printLayer:L.browserPrintUtils.cloneLayer(this._validatePrintLayer())};this._map.fire("browser-pre-print",{printObjects:this._getPrintObjects()});var o=this._addPrintMapOverlay(this._map,t,r);this._map.fire("browser-print-start",{printLayer:r.printLayer,printMap:o.map,printObjects:o.objects}),o.map.fitBounds(e||r.bounds),o.map.invalidateSize({reset:!0,animate:!1,pan:!1});var a=setInterval(function(){o.map.isLoading()||(clearInterval(a),n._completePrinting(o.map,r.printLayer,o.objects))},50)},_completePrinting:function(t,e,n){var i=this;setTimeout(function(){i._map.fire("browser-print",{printLayer:e,printMap:t,printObjects:n}),window.print(),i._printEnd(t,e,n)},1e3)},_getBoundsForAllVisualLayers:function(){var t=null;for(var e in this._map._layers){var n=this._map._layers[e];n._url||(t?n.getBounds?t.extend(n.getBounds()):n.getLatLng&&t.extend(n.getLatLng()):n.getBounds?t=n.getBounds():n.getLatLng&&(t=L.latLngBounds(n.getLatLng(),n.getLatLng())))}return t},_clearPrint:function(){this._removePrintClassFromContainer(this._map,"leaflet-browser-print--landscape"),this._removePrintClassFromContainer(this._map,"leaflet-browser-print--portrait"),this._removePrintClassFromContainer(this._map,"leaflet-browser-print--auto"),this._removePrintClassFromContainer(this._map,"leaflet-browser-print--custom")},_printEnd:function(t,e,n,i){this._clearPrint();var r=document.getElementById("leaflet-print-overlay");document.body.removeChild(r),document.body.className=document.body.className.replace(" leaflet--printing",""),this._map.invalidateSize({reset:!0,animate:!1,pan:!1}),this._map.fire("browser-print-end",{printLayer:e,printMap:t,printObjects:n})},_validatePrintLayer:function(){var t=null;if(this.options.printLayer)t=this.options.printLayer;else for(var e in this._map._layers){var n=this._map._layers[e];n._url&&(t=n)}return t},_getPrintObjects:function(){var t={};for(var e in this._map._layers){var n=this._map._layers[e];if(!n._url){var i=L.browserPrintUtils.getType(n);i&&(t[i]||(t[i]=[]),t[i].push(n))}}return t},_addPrintCss:function(t){var e=document.createElement("style");switch(e.id="leaflet-browser-print-css",e.setAttribute("type","text/css"),e.innerHTML="@media print { .leaflet-control-container > .leaflet-bottom.leaflet-left, .leaflet-control-container > .leaflet-top.leaflet-left, .leaflet-control-container > .leaflet-top.leaflet-right { display: none!important; } }",e.innerHTML+="@media print { .leaflet-popup-content-wrapper, .leaflet-popup-tip { box-shadow: none; }",t){case"Landscape":e.innerText+="@media print { @page { size : landscape; }}";break;default:case"Portrait":e.innerText+="@media print { @page { size : portrait; }}"}return e},_appendControlStyles:function(t){var e=document.createElement("style");e.setAttribute("type","text/css"),e.innerHTML+=" .leaflet-control-browser-print { display: flex; } .leaflet-control-browser-print a { background: #fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcCCi8Vjp+aNAAAAGhJREFUOMvFksENgDAMA68RC7BBN+Cf/ZU33QAmYAT6BolAGxB+RrrIsg1BpfNBVXcPMLMDI/ytpKozMHWwK7BJJ7yYWQbGdBea9wTIkRDzKy0MT7r2NiJACRgotCzxykFI34QY2Ea7KmtxGJ+uX4wfAAAAAElFTkSuQmCC') no-repeat 5px; background-size: 16px 16px; display: block; border-radius: 4px; }",e.innerHTML+=" .v0-7.leaflet-control-browser-print a#leaflet-browser-print { width: 26px; height: 26px; } .v1.leaflet-control-browser-print a#leaflet-browser-print { background-position-x: 7px; }",e.innerHTML+=" .browser-print-holder { margin: 0px; padding: 0px; list-style: none; white-space: nowrap; } .browser-print-holder-left li:last-child { border-top-right-radius: 2px; border-bottom-right-radius: 2px; } .browser-print-holder-right li:first-child { border-top-left-radius: 2px; border-bottom-left-radius: 2px; }",e.innerHTML+=" .browser-print-mode { display: none; background-color: #919187; color: #FFF; font: 11px/19px 'Helvetica Neue', Arial, Helvetica, sans-serif; text-decoration: none; padding: 4px 10px; text-align: center; } .v1 .browser-print-mode { padding: 6px 10px; } .browser-print-mode:hover { background-color: #757570; cursor: pointer; }",e.innerHTML+=" .leaflet-browser-print--custom, .leaflet-browser-print--custom path { cursor: crosshair!important; }",e.innerHTML+=" .leaflet-print-overlay { width: 100%; height: 100%; position: absolute; top: 0; background-color: white!important; left: 0; z-index: 1001; display: block!important; } ",e.innerHTML+=" .leaflet--printing { overflow: hidden!important; margin: 0px!important; padding: 0px!important; } body.leaflet--printing > * { display: none; }",e.innerHTML+=" .grid-print-container { grid-template: 1fr / 1fr; } .grid-map-print { grid-row: 1; grid-column: 1; } body.leaflet--printing [leaflet-browser-print-content]:not(style) { display: unset!important; }",t.appendChild(e)},_addPrintMapOverlay:function(t,e,n){var i=document.createElement("div");i.id="leaflet-print-overlay",i.className=t.getContainer().className+" leaflet-print-overlay",document.body.appendChild(i),i.appendChild(this._addPrintCss(e));var r=document.createElement("div");if(r.id="grid-print-container",r.className="grid-print-container",r.style.width=n.width,r.style.height=n.height,r.style.display="grid",this._setupMapSize(r,e),this.options.contentSelector){var o=document.querySelectorAll(this.options.contentSelector);if(o&&o.length)for(var a=0;a<o.length;a++){var s=o[a].cloneNode(!0);r.appendChild(s)}}i.appendChild(r);var l=document.createElement("div");return l.id=t.getContainer().id+"-print",l.className="grid-map-print",l.style.width="100%",l.style.height="100%",r.appendChild(l),document.body.className+=" leaflet--printing",this._setupPrintMap(l.id,L.browserPrintUtils.cloneBasicOptionsWithoutLayers(t.options),n.printLayer,t._layers)},_setupPrintMap:function(t,e,n,i,r){e.zoomControl=!1;var o=L.map(t,e),a={};n.addTo(o);for(var s in i){var l=i[s];if(!l._url){var p=L.browserPrintUtils.cloneLayer(l,r);if(p){l instanceof L.Popup?(l.isOpen||(l.isOpen=function(){return this._isOpen}),l.isOpen()&&!this.options.closePopupsOnPrint&&p.openOn(o)):p.addTo(o);var c=L.browserPrintUtils.getType(p);a[c]||(a[c]=[]),a[c].push(p)}}}if(!o.isLoading)if("1.2.0"==L.version){var u=this;o.isLoading=function(){return u._getLoadingLayers(this)}}else o.isLoading=function(){return this._tilesToLoad||this._tileLayersToLoad};return{map:o,objects:a}},_getLoadingLayers:function(t){for(var e in t._layers){var n=t._layers[e];if(n._url&&n._loading)return!0}return!1}}),L.browserPrint=function(t){if(t&&t.printModes&&(!t.printModes.filter||!t.printModes.length))throw"Please specify valid print modes for Print action. Example: printModes: ['Portrait', 'Landscape', 'Auto', 'Custom']";return new L.Control.BrowserPrint(t)}},function(t,e){L.browserPrintUtils={cloneOptions:function(t){var e=this,n={};for(var i in t){var r=t[i];r&&r.clone?n[i]=r.clone():r&&r.onAdd?n[i]=e.cloneLayer(r):n[i]=r}return n},cloneBasicOptionsWithoutLayers:function(t){var e={},n=Object.getOwnPropertyNames(t);if(n.length){for(var i=0;i<n.length;i++){var r=n[i];r&&"layers"!=r&&(e[r]=t[r])}return this.cloneOptions(e)}return e},cloneLayer:function(t,e){var n=this,i=t.options;return L.SVG&&t instanceof L.SVG?L.svg(i):L.Canvas&&t instanceof L.Canvas?L.canvas(i):L.TileLayer.WMS&&t instanceof L.TileLayer.WMS?L.tileLayer.wms(t._url,i):t instanceof L.TileLayer?L.tileLayer(t._url,i):t instanceof L.ImageOverlay?L.imageOverlay(t._url,t._bounds,i):t instanceof L.Marker?L.marker(t.getLatLng(),i):t instanceof L.Popup?L.popup(i).setLatLng(t.getLatLng()).setContent(t.getContent()):t instanceof L.Circle?L.circle(t.getLatLng(),t.getRadius(),i):t instanceof L.CircleMarker?L.circleMarker(t.getLatLng(),i):t instanceof L.Rectangle?L.rectangle(t.getBounds(),i):t instanceof L.Polygon?L.polygon(t.getLatLngs(),i):L.MultiPolyline&&t instanceof L.MultiPolyline?L.polyline(t.getLatLngs(),i):L.MultiPolygon&&t instanceof L.MultiPolygon?L.multiPolygon(t.getLatLngs(),i):t instanceof L.Polyline?L.polyline(t.getLatLngs(),i):t instanceof L.GeoJSON?L.geoJson(t.toGeoJSON(),i):t instanceof L.FeatureGroup?L.featureGroup(n.cloneInnerLayers(t)):t instanceof L.LayerGroup?L.layerGroup(n.cloneInnerLayers(t)):t instanceof L.Tooltip?L.tooltip(i):(console.info("Unknown layer, cannot clone this layer. Leaflet-version: "+L.version),null)},getType:function(t){return L.SVG&&t instanceof L.SVG?"L.SVG":L.Canvas&&t instanceof L.Canvas?"L.Canvas":t instanceof L.TileLayer.WMS?"L.TileLayer.WMS":t instanceof L.TileLayer?"L.TileLayer":t instanceof L.ImageOverlay?"L.ImageOverlay":t instanceof L.Marker?"L.Marker":t instanceof L.Popup?"L.Popup":t instanceof L.Circle?"L.Circle":t instanceof L.CircleMarker?"L.CircleMarker":t instanceof L.Rectangle?"L.Rectangle":t instanceof L.Polygon?"L.Polygon":L.MultiPolyline&&t instanceof L.MultiPolyline?"L.MultiPolyline":L.MultiPolygon&&t instanceof L.MultiPolygon?"L.MultiPolygon":t instanceof L.Polyline?"L.Polyline":t instanceof L.GeoJSON?"L.GeoJSON":t instanceof L.FeatureGroup?"L.FeatureGroup":t instanceof L.LayerGroup?"L.LayerGroup":t instanceof L.Tooltip?"L.Tooltip":null},cloneInnerLayers:function(t){var e=this,n=[];return t.eachLayer(function(t){var i=e.cloneLayer(t);i&&n.push(i)}),n}}},function(t,e,n){n(0),t.exports=n(1)}]);
}

export default LeafletPrintPlugin;
