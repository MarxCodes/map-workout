// Number.prototype.toRadians = function() { return this * Math.PI / 180; };
// Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };

let popUpMarkUp = ` 
    <div>

    </div>
      `;

//Main App
// Get Location of user
// event listener on add Routine
// event listener on add button
// event listener click map 
// create arr for [running/cylcing]


// remove marker -  back button
// add responsiveness - when clicking near a marker
    /*
    function (latlng) {
      polypoints.map(i => i.map(v = > {
        let calced = _calc(v.lat, lat, v.lng, lng)

        if 
        )
      }))
    }
    
    __helperFunc
    
    _calc(lat, latlng) {
      return lat - latng
    }


    */
//state 
// Create Journey Map
// 

//function that makes distance calc 
/*
    function calcDistance(){
      let total = 0;
      let [firstLat, firstLng] = polypoints[0];

      let [recentLat, recentLng] = polypoints[polypoints.length] - 1;
      let [prevLat, prevLng] = polypoints[polypoints.length] - 2; >
      let firstOFf = _calc(firstLat, recentLat, firstLng, recentLng);

      isLessThan() ? endJourney() : addMarker()
    }

    endJourney() {
      documentc
    }
*/

/*
    DOM ASSIGNMENTS
*/



let elems = { 
  markerContainerEl: 'leaflet-marker-pane',
  removeButtonEl: 'removeMarker',
  shadowContainerEl: 'leaflet-shadow-pane',
  linesContainerEl: 'leaflet-zoom-animated',
  overlayPanelEl: 'leaflet-overlay-pane',
  interactiveLineEl: 'leaflet-interactive',
  firstMarkerEl: '.leaflet-marker-icon',

};


class App {
  constructor() {
    this._getPosition();
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap);
  }
  _checkLocalStorage() {
    if (localStorage.length >= 1) {
      _iterateLocalStorageRoutes();
    }
    else {
      prompt('No routes found, Click on Map to start route.')
    }
  }

  _iterateLocalStorageRoutes() {
    let routesArr = []
    for (var i = 0; i < localStorage.length; i++){
      routesArr.push(localStorage.getItem(localStorage.key(i)));
  }
  }

  _saveLocalStorageRoutes() {
    let index = localStorage.length;
    let route;
    localStorage.setItem(`routes-${index}`, JSON.stringify(route))
  }
 
  _loadMap(position) {
      let { latitude, longitude } = position.coords;
      mapid = L.map('mapid').setView([latitude, longitude], 13);
    
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapid);
      
      mapid.on('click', onMapClick);
     
    }
  }

  class Map {
    constructor() {

    }

    _onMapClick(e){
      this._assignDOMEls();
      mapEvent = e;
      // Only allow marker pressed when journey has been saved.
      if(state.editMode === false) {
        return;
      }
      let  {latlng} = mapEvent;
      // destructuring most recent coords to check if it's pressed to end route
      let { lat: lat2, lng: lng2 } = latlng;
      let lat1, lng1, latDiff, lngDiff;
  
      // pressendbuttons.push([lat2,lng2]);
      //1) CALCULATE LATLNG
      //2) IF UNDER 0.0008 FROM 1ST MARKER ADDMARKER TO 1ST MARKER ;
      //3) DISALLOW ANY NEW MARKERS BEING PLACED 
      //4) ADDPOPUP TO E
      
      // when map is Clear dont check 
      
      if( polypoints.length === 0){
        this._addMarker(latlng);        
      }
      else  {
        lat1 = polypoints[0][0];
        lng1 = polypoints[0][1];
        latDiff = this._calcDiff(lat2, lat1);
        lngDiff = this._calcDiff(lng2, lng1);
        withinLatProx = this._withinProximityOfStart(latDiff);
        withinLngProx = this._withinProximityOfStart(lngDiff);
        console.log( { latDiff, lngDiff });
  
        let areTheyTrue = this._ifBothTrue(withinLatProx, withinLngProx);
        this._decisionMaker(areTheyTrue, latlng);
      }
    }

  
    _removeMarker(e) {
      e.stopPropagation();
      let SVGDOM = overlayContainer.childNodes;
      let Gz = SVGDOM[0].childNodes[0];
      let lastLine = Gz.lastChild;
      polypoints.pop();
      let domMarkerArr = Array.from(leafletCntainer.childNodes);
      let domShadowArr = Array.from(shadowContainer.childNodes);
  
      leafletCntainer.removeChild(domMarkerArr[domMarkerArr.length - 1]);
      shadowContainer.removeChild(domShadowArr[domShadowArr.length - 1]);
      Gz.removeChild(lastLine);
    }
  
    _calcDiff(num1, num2) {
      return num2 - num1;
    }
    // check whether coords is positive or negative from firstMarker coords  
  
    _withinProximityOfStart(num) {
      if (Math.sign(num) === 1) {
        return num < 0.0008 ? true : false;
      };
      if (Math.sign(num) === -1) {
        return num > -0.0008 ? true : false;
      }
      // else {
      //  return placeFinalMarker();
      // }
    }
  
  
    _LngwithinProximityOfStart(num) {
      return num < 0.09 ? true : false;
    }
    _ifBothTrue (val, val2) { return val && val2; }
  
    _addMarker(latlng) {
        L.marker(latlng).addTo(mapid);
        this._drawPolyLines(latlng);
        return polypoints;
    }
  
    _drawPolyLines(boo) {
      let {lat, lng} =  boo;
      polypoints.push([lat,lng]);
      L.polyline(polypoints, {color: 'red'}).addTo(mapid);
    }

        
    _finalPolygonLine() {
      L.polyline(polypoints, { color: 'red'}).addTo(mapid);
    } 
  
    _placeFinalMarker() {
  
      polypoints.push(polypoints[0]);
      this._finalPolygonLine();
      state.editMode = false;  
      console.log(state.editMode);
      L.marker(polypoints[0]).addTo(mapid);
      console.log(polypoints);
      this._popUp();
      let distance = this._distanceINIT();
      // console.log(distance);
      distance.shift();
      let reduced = distance.reduce((acc, curr) =>  acc + curr);
      let totalDistance = (reduced / 1000).toFixed(2);
  
      this._addDistance2DOM(totalDistance)
      // distanceEl.textContent = distance;
      
    }
  
    _addDistance2DOM(arg) {
      distanceEl.textContent = arg;
    }
  
  
    _popUp(){}
  
    _decisionMaker(isIt, latlng) {
      // latlng = mapEvent;
      return isIt ? this._placeFinalMarker() : this._addMarker(latlng); 
    }
    _toRadians(num) { return num * Math.PI / 180; };


  _distanceINIT(radius = 6371e3) {
  
    const R = radius;
    let φ1, λ1, φ2, λ2, Δφ, Δλ; 
    let a,c,d, distanceTotal = [];
    let coords = polypoints.map(i => {
      // latLat = i[0] + φ1;
      // lastLng = i[1] + lastlng;
  
      φ2 = this._toRadians(i[0]);
      λ2 = this._toRadians(i[1]);
      Δφ = φ2 - φ1;
      Δλ = λ2 - λ1;

      
      φ1 = φ2;
      λ1 = λ2;
      
      a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      d = R * c;
      distanceTotal.push(d);
    });
      return distanceTotal;    
  }



  }

// class 


let mapid, mapEvent;
let polypoints = [];

let  leafletCntainer, shadowContainer, linesContainer, indvidualLines, SVGLINES, firstMarker, overlayContainer;
let removeButton = document.body.querySelector(`.${elems.removeButtonEl}`);
let distanceEl = document.body.querySelector('.distance-clock');

let here = navigator.geolocation.getCurrentPosition(position =>  {
  let { latitude, longitude } = position.coords;
  mapid = L.map('mapid').setView([latitude, longitude], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapid);

    mapid.on('click', onMapClick);
 
  });


        // if(withinLatProx && withinLngProx === true ) {
        //   placeFinalMarker();
        //   return;
          
        // } else {
        //   addMarker(latlng);
        //   return;
        //  /////// // drawPolyLines(dog);
        //   ////////// console.log('still happening')
        // }

        // !!bothLatLng(withinLatProx, withinLngProx);
        // if (!!withinProximityOfStart(latDiff) )
        

  // Function Assign Map Items when marker has been placed;

  function onMapClick(e) {
    assignDOMEls();
    mapEvent = e;
    // Only allow marker pressed when journey has been saved.
    if(state.editMode === false) {
      return;
    }
    let  {latlng} = mapEvent;
    // destructuring most recent coords to check if it's pressed to end route
    let { lat: lat2, lng: lng2 } = latlng;
    let lat1, lng1, latDiff, lngDiff;

    // pressendbuttons.push([lat2,lng2]);
    //1) CALCULATE LATLNG
    //2) IF UNDER 0.0008 FROM 1ST MARKER ADDMARKER TO 1ST MARKER ;
    //3) DISALLOW ANY NEW MARKERS BEING PLACED 
    //4) ADDPOPUP TO E
    
    // when map is Clear dont check 
    
    if( polypoints.length === 0){
      addMarker(latlng);        
    }

    else  {
      lat1 = polypoints[0][0];
      lng1 = polypoints[0][1];
      latDiff = _calcDiff(lat2, lat1);
      lngDiff = _calcDiff(lng2, lng1);
      withinLatProx = withinProximityOfStart(latDiff);
      withinLngProx = withinProximityOfStart(lngDiff);
      console.log( { latDiff, lngDiff });

      let areTheyTrue = ifBothTrue(withinLatProx, withinLngProx);
      decisionMaker(areTheyTrue, latlng);
    }
  }

  function assignDOMEls() {
    leafletCntainer = document.body.querySelector(`.${elems.markerContainerEl}`);
    shadowContainer = document.body.querySelector(`.${elems.shadowContainerEl}`);
    linesContainer = document.body.querySelectorAll(`.${elems.linesContainerEl}`);
    indvidualLines = document.body.querySelectorAll(`.${elems.interactiveLineEl}`);
    SVGLINES = document.body.querySelector('.leaflet-overlay-pane');
    fisrstMarker = document.body.querySelector(`${elems.firstMarkerEl}`);
    overlayContainer = document.body.querySelector(`.${elems.overlayPanelEl}`);
    distanceEl = document.body.querySelector('.distance-clock');
  }

  function removeMarker(e) {
    e.stopPropagation();
    let SVGDOM = overlayContainer.childNodes;
    let Gz = SVGDOM[0].childNodes[0];
    let lastLine = Gz.lastChild;
    polypoints.pop();
    let domMarkerArr = Array.from(leafletCntainer.childNodes);
    let domShadowArr = Array.from(shadowContainer.childNodes);

    leafletCntainer.removeChild(domMarkerArr[domMarkerArr.length - 1]);
    shadowContainer.removeChild(domShadowArr[domShadowArr.length - 1]);
    Gz.removeChild(lastLine);
    console.log(indvidualLines);
  }

  function _calcDiff(num1, num2) {
    return num2 - num1;
  }
  // check whether coords is positive or negative from firstMarker coords  

  function withinProximityOfStart(num) {
    if (Math.sign(num) === 1) {
      return num < 0.0008 ? true : false;
    };
    if (Math.sign(num) === -1) {
      return num > -0.0008 ? true : false;
    }
    // else {
    //  return placeFinalMarker();
    // }
  }


  function LngwithinProximityOfStart(num) {
    return num < 0.09 ? true : false;
  }
  let ifBothTrue = (val, val2) => val && val2;

  function addMarker(latlng) {
    // L.marker([layerPoint.lat, layerPoint.lng]).addTo(mapid)

      L.marker(latlng).addTo(mapid);
      drawPolyLines(latlng);
      return polypoints;
  }

  function drawPolyLines(boo) {
    // console.log(boo)
    let {lat, lng} =  boo;
    // if (polypoints.length > 1) polypoints.shift();
    polypoints.push([lat,lng]);
    L.polyline(polypoints, {color: 'red'}).addTo(mapid);
  }

   // function drawPologon(boo) {
    //   boo = mapEvent;
    //   let {lat, lng} =  boo._latlng;
    //   if (polypoints.length > 1) polypoints.shift();
    //   polypoints.push([lat,lng]);
    //   console.log(polypoints);

    //   L.polygon(polypoints).addTo(mapid);
    // }   
  

      
  function finalPolygonLine() {
    L.polyline(polypoints, { color: 'red'}).addTo(mapid);
  } 

  function placeFinalMarker() {

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

    addDistance2DOM(totalDistance)
    // distanceEl.textContent = distance;
    
  }

  function addDistance2DOM(arg) {
    distanceEl.textContent = arg;
  }

  function toggleClass() {
    console.log(elems.firstMarkerEl.style)
  }

  function addHomeClass() {
    let cssPos = firstMarker.style.cssText;
    // firstMarker..
  }

  function popUp(){}

  function decisionMaker(isIt, latlng) {
    // latlng = mapEvent;
    return isIt ? placeFinalMarker() : addMarker(latlng); 
  }

  removeButton.addEventListener('click', removeMarker);


  /*
    Function to end Journey
    1) Iterate through PolyPoints or get the map location ???
       OR  
       PolyPoints[0]
    2) if e.lat/e.lng is less than 0.005 from Polypoints[0]
    3) Add endJourneyMarker class on start
    4) draw line to start marker coords 
    5) dont allow anymore AddMarkers();
  */


function laps(num) {
  this.distance * num;
}



// WorkOut Distance.
// Iterate through polypoints and check between n + n+1 

let lastnum = 0;
let total;
// let latInit = polypoints.map(i => {
//   total = i[0] + lastnum;
//   lastnum = i[0];
//   return total;
// }).map(i => toRadians(i));

// let lngInit = polypoints.map(i => {
//   total = i[1] + lastnum;
//   lastnum = i[1];
//   return total;
// }).map(i => { 
//   λ1 = toRadians(i)
// });

function distanceINIT(radius = 6371e3) {

  const R = radius;
  let φ1, λ1, φ2, λ2, Δφ, Δλ; 
  let a,c,d, distanceTotal = [];
  let coords = polypoints.map(i => {
    // latLat = i[0] + φ1;
    // lastLng = i[1] + lastlng;

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
    // return d; 
    // return pythag(φ1, φ2, Δφ, Δλ)
    
  })
  // .reduce((acc, curr) => {
    //     acc + curr
    // },0 )
    // let removed = coords.shift(0);

    return distanceTotal;    
    // return reduced;
}

function pythag(φ1, φ2, Δφ, Δλ) {
  const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
}

function accumumlateDistance () {
  let initalLat = latInit();
  let itinalLng = lngInit();
  let initialCoords = [initalLat,itinalLng];


}

function distanceTo(point, radius = 6371e3) {
  let initalLat = latInit();
  let itinalLng = lngInit();
  const R = radius;
  const φ1 = toRadians(lat),  λ1 = toRadians(lon);
  const φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;

  return d;

}
class Routine {

    
  constructor() {

  }

  _distance() {
    // create array of all lat/lng potnts
    let locations = [];


  }



  _avergeSpeed() {
    
  }

  



  // get timeStamp() {
  //   return this.timeStamp();
  // }

  // set timeStamp() {
  //   return new Date();
  // }

}

function toRadians(num) { return num * Math.PI / 180; };
function toDegrees(num) { return num * 180 / Math.PI; };

class Route { 

  constructor() {}

  _takePoint(e) {

  }


}

class Workout {
  constructor() {

  }

  distanceTo(point, radius = 6371e3) {
    
    const R = radius;
    const φ1 = toRadians(lat),  λ1 = toRadians(lon);
    const φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    return d;

  }
}

/*
  calculate average speed
  calculate distance
  calculate journey 
  
  create date 
  start time
  end time

*/

