let elems = { 
  markerContainerEl: 'leaflet-marker-pane',
  removeButtonEl: 'removeMarker',
  shadowContainerEl: 'leaflet-shadow-pane',
  linesContainerEl: 'leaflet-zoom-animated',
  overlayPanelEl: 'leaflet-overlay-pane',
  interactiveLineEl: 'leaflet-interactive',
  firstMarkerEl: '.leaflet-marker-icon',

};


class Route { 
  constructor() {
    this._assignDOMEls();
    //need to bind the L.MAP
    // need to bind to DOM ELs
  }
  // assign DOM Els
  // Check LocalStorage for routes
  // 
  _assignDOMEls() {
    leafletCntainer = document.body.querySelector(`.${elems.markerContainerEl}`);
    shadowContainer = document.body.querySelector(`.${elems.shadowContainerEl}`);
    linesContainer = document.body.querySelectorAll(`.${elems.linesContainerEl}`);
    indvidualLines = document.body.querySelectorAll(`.${elems.interactiveLineEl}`);
    SVGLINES = document.body.querySelector('.leaflet-overlay-pane');
    fisrstMarker = document.body.querySelector(`${elems.firstMarkerEl}`);
    overlayContainer = document.body.querySelector(`.${elems.overlayPanelEl}`);
    distanceEl = document.body.querySelector('.distance-clock');
  }

  _saveLocalStorageRoutes() {
    let index = localStorage.length;
    let route;
    localStorage.setItem(`routes-${index}`, JSON.stringify(route))
  }

  _calcDiff(num1, num2) {
    return num2 - num1;
  }

  withinProximityOfStart(num) {
    if (Math.sign(num) === 1) {
      return num < 0.0008 ? true : false;
    }
    if (Math.sign(num) === -1) {
      return num > -0.0008 ? true : false;
    }
  }

  LngwithinProximityOfStart(num) {
    return num < 0.09 ? true : false;
  }

  ifBothTrue (val, val2) {val && val2}

  addMarker(latlng) {
      L.marker(latlng).addTo(mapid);
      drawPolyLines(latlng);
      return polypoints;
  }

  drawPolyLines(boo) {
    let {lat, lng} =  boo;
    polypoints.push([lat,lng]);
    L.polyline(polypoints, {color: 'red'}).addTo(mapid);
  }

  finalPolygonLine() {
    L.polyline(polypoints, { color: 'red'}).addTo(mapid);
  } 

  placeFinalMarker() {

    polypoints.push(polypoints[0]);
    finalPolygonLine();
    state.editMode = false;
    console.log(state.editMode);
    L.marker(polypoints[0]).addTo(mapid);
    console.log(polypoints);
    popUp();
    let distance = distanceINIT();
    // console.log(distance);
    distance.shift();
    let reduced = distance.reduce((acc, curr) =>  acc + curr);
    let totalDistance = (reduced / 1000).toFixed(2);

    addDistance2DOM(totalDistance);
  }

  addDistance2DOM(arg) {
    distanceEl.textContent = arg;
  }

  decisionMaker(isIt, latlng) {
    return isIt ? placeFinalMarker() : addMarker(latlng); 
  }

  distanceINIT(radius = 6371e3) {

    const R = radius;
    let φ1, λ1, φ2, λ2, Δφ, Δλ; 
    let a,c,d, distanceTotal = [];
    let coords = polypoints.map(i => {
      φ2 = toRadians(i[0]);
      λ2 = toRadians(i[1]);
      Δφ = φ2 - φ1;
      Δλ = λ2 - λ1;
      console.log( Δφ)
      
      
      φ1 = φ2;
      λ1 = λ2;
      
      a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      d = R * c;
      distanceTotal.push(d);
    })

      return distanceTotal;    
}
}