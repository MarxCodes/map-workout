let elems = { 
  markerContainerEl: 'leaflet-marker-pane',
  removeButtonEl: 'removeMarker',
  shadowContainerEl: 'leaflet-shadow-pane',
  linesContainerEl: 'leaflet-zoom-animated',
  overlayPanelEl: 'leaflet-overlay-pane',
  interactiveLineEl: 'leaflet-interactive',
  firstMarkerEl: '.leaflet-marker-icon',
  markUpContainerEl: '.control-container',
  routeEl: '.route-el',
  routesList: 'routes-list',
};

let removeButton = document.body.querySelector(`.${elems.removeButtonEl}`);
removeButton.style.visibility = 'hidden';
const form = document.querySelector('.save-form-container');
let mapid, mapEvent;
let polypoints = [];

let leafletCntainer, shadowContainer, linesContainer, indvidualLines, SVGLINES, firstMarker, overlayContainer;

const state = {
  mapMode: true,
  editMode: true,
  routeStarted: false
};

let bikeIcon = `<span class="material-icons-outlined">
pedal_bike
</span>`;
let runIcon = `<span class="material-icons-outlined">
directions_run
</span>`;


class Route {

  constructor(workouts) {
    this._assignDOMEls();
    removeButton.addEventListener('click', this.removeMarker.bind(this));
    this.workouts = workouts;

  }
  _assignDOMEls() {
    leafletCntainer = document.body.querySelector(`.${elems.markerContainerEl}`);
    shadowContainer = document.body.querySelector(`.${elems.shadowContainerEl}`);
    linesContainer = document.body.querySelectorAll(`.${elems.linesContainerEl}`);
    indvidualLines = document.body.querySelectorAll(`.${elems.interactiveLineEl}`);
    SVGLINES = document.body.querySelector('.leaflet-overlay-pane');
    firstMarker = document.body.querySelector(`${elems.firstMarkerEl}`);
    overlayContainer = document.body.querySelector(`.${elems.overlayPanelEl}`);
  }
  
  removeMarker(e) {
    e.stopPropagation();
    let SVGDOM = overlayContainer.childNodes;
    let Gz = SVGDOM[0].childNodes[0];
    let lastLine = Gz.lastChild;
    polypoints.pop();
    let domMarkerArr = Array.from(leafletCntainer.childNodes);
    let domShadowArr = Array.from(shadowContainer.childNodes);
    let boggo = leafletCntainer.removeChild(domMarkerArr[domMarkerArr.length - 1]);
     shadowContainer.removeChild(domShadowArr[domShadowArr.length - 1]);
    Gz.removeChild(lastLine);
  }
  onMapClick(e){

    if(state.editMode === false) {
      return;
    }
    let  {latlng} = e;
    let { lat: lat2, lng: lng2 } = latlng;
    let lat1, lng1, latDiff, lngDiff, withinLatProx, withinLngProx;
    
    if( polypoints.length === 0){

      this._addMarker(latlng);        
      removeButton.style.visibility = 'initial';

    }
    else  {
      lat1 = polypoints[0][0];
      lng1 = polypoints[0][1];
      latDiff = this._calcDiff(lat2, lat1);
      lngDiff = this._calcDiff(lng2, lng1);
      withinLatProx = this._withinProximityOfStart(latDiff);
      withinLngProx = this._withinProximityOfStart(lngDiff);
      // if(!!withinLatProx && !!withinLngProx === true) {  
      //   this._decisionMaker(areTheyTrue, latlng);
      // }
      let areTheyTrue = this._ifBothTrue(withinLatProx, withinLngProx);
      this.decisionMaker(areTheyTrue, latlng);

    }
  }

  _calcDiff(num1, num2) {
    return num2 - num1;
  }

  _withinProximityOfStart(num) {
    if (Math.sign(num) === 1) {
      return num < 0.001 ? true : false;
    }
    if (Math.sign(num) === -1) {
      return num > -0.001 ? true : false;
    }
  }

  LngwithinProximityOfStart(num) {
    return num < 0.09 ? true : false;
  }

  ifBothTrue (val, val2) {val && val2}

  _addMarker(latlng) {
      L.marker(latlng).addTo(mapid);
      this._drawPolyLines(latlng);
  }

  _drawPolyLines(latlng) {
    let {lat, lng} =  latlng;
    polypoints.push([lat,lng]);
    L.polyline(polypoints, {color: 'red'}).addTo(mapid);
  }

  finalPolygonLine() {
    L.polyline(polypoints, { color: 'red'}).addTo(mapid);
  } 

  placeFinalMarker() {

    polypoints.push(polypoints[0]);
    this.finalPolygonLine();
    state.editMode = false;
    L.marker(polypoints[0]).addTo(mapid);
    let distance = this.distanceINIT();
    distance.shift();
    let reduced = distance.reduce((acc, curr) =>  acc + curr);
    let totalDistance = (reduced / 1000).toFixed(2);

    this._saveLocalStorageRoutes(totalDistance);
    app._checkLocalStorage();
    app._renderWorkoutForm(totalDistance);
    app._registerRouteListeners();
    this.addActiveClass();

  }

  addActiveClass() {
    const routeList = document.querySelector('.routes-list');
    routeList.lastElementChild.classList.add('active-route');
  }

  _saveLocalStorageRoutes(totalDistance) {
    let index = localStorage.length;
    polypoints.push(totalDistance);
    localStorage.setItem(`routes-${index}`, JSON.stringify(polypoints));
    // this.cleanUpDom(leafletCntainer);
    // this.cleanUpDom(SVGLINES.childNodes[0].childNodes[0]);
    // this.cleanUpDom(shadowContainer);

    polypoints = [];
    state.editMode = true;
  }
  cleanUpDom(container){
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  decisionMaker(isIt, latlng) {
    return isIt ? this.placeFinalMarker() : this._addMarker(latlng); 
  }
  _ifBothTrue (val, val2) { return val && val2; }

  distanceINIT(radius = 6371e3) {

    const R = radius;
    let φ1, λ1, φ2, λ2, Δφ, Δλ; 
    let a,c,d, distanceTotal = [];
    let coords = polypoints.map(i => {
      φ2 = this.toRadians(i[0]);
      λ2 = this.toRadians(i[1]);
      Δφ = φ2 - φ1;
      Δλ = λ2 - λ1;  
      φ1 = φ2;
      λ1 = λ2;
      
      a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      d = R * c;
      distanceTotal.push(d);
    })

      return distanceTotal;    
}

 toRadians(num) { return num * Math.PI / 180; };
}

let route;
class App { 
  routeButton
  mapEvent;
  qMarkers; 
  qLines;
  qShadows;
  distance;
  workoutForm;
  workouts = [];

constructor() {
  this._checkLocalStorage();
  this._getPosition();
  this._registerRouteListeners();

}

_registerRouteListeners() {
  console.log('regsiter routebuttons: ', this.routeButton, 'clickkky')
  this.routeButton = document.querySelectorAll(`${elems.routeEl}`);

  this.routeButton.forEach(i => i.addEventListener('click', (e) => {
    this.qMarkers = document.body.querySelector(`.${elems.markerContainerEl}`);
    this.qShadows = document.body.querySelector(`.${elems.shadowContainerEl}`)
    this.qLines = document.body.querySelector(`.${elems.overlayPanelEl}`);
    
    if (this.qLines.firstChild !== null) {
      this._cleanUpLines(this.qLines.childNodes[0].childNodes[0]);  
    }

    this._cleanUpMarkers(this.qMarkers);
    this._cleanUpMarkers(this.qShadows);
    
      this.routeButton.forEach(x => x.classList.remove('active-route'))
      i.classList.add('active-route');
      let activeClass = i.classList[1];
      this._placeMarkers(activeClass);
      this._renderWorkoutForm(this.distance);

  }));
}

_newWorkout(e) {

  const hours = document.getElementById('hours');
  const minutes = document.getElementById('mins');
  let hoursZeroLess = this._removeLeadingZero(hours.value);
  let minuteZeroLess = this._removeLeadingZero(minutes.value);
  let distance = document.getElementById('distance').value;
  let duration = minuteZeroLess + this._calculateHours(hoursZeroLess);
  let workout;
  this.workoutName = document.getElementById('name').value;
  this.workoutDate = document.getElementById('date').value;
  this.workoutDuration = (duration / 60);
  this.workoutType = document.getElementById('type').value;
  this.workoutDistance = distance;
  console.log(this.workoutName, this.workoutDate, this.workoutDuration)

  if(this.workoutType === 'cycling'){
    workout = new Cycle(this.workoutDistance, this.workoutDuration, this.workoutName, this.workoutType)

  }
  if(this.workoutType === 'running'){
    workout = new Run(this.workoutDistance, this.workoutDuration, this.workoutName, this.workoutType);
  }
  this.workouts.push(workout);
  this.workouts.forEach(i =>{
    console.log(i);
    this._renderWorkout(i)
  });
}

_removeLeadingZero(num){
    let regExp = /^0[0-9]/;
    if(regExp.test(num) === true){
      num.substring(1);
      let toNum = parseInt(num);
      return toNum;
    }
    return parseInt(num);
}

_calculateHours(hour) {
  let numberConvert = parseInt(hour);
  let calc = numberConvert * 60;
  return calc;
}

_cleanUpLines(container) { 
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

_placeMarkers(i) {
  let itemLines = JSON.parse(localStorage.getItem(i));
  this.distance = itemLines.pop();
  itemLines.map(i => {
    if(i === typeof string) return;
      L.marker(i).addTo(mapid);
      L.polyline([itemLines], {color: 'red'}).addTo(mapid);
    })
}

_cleanUpMarkers(container){
  if(container === undefined) alert('yeh');
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this));
  }
  
  _loadMap(position) {
    let { latitude, longitude } = position.coords;
      mapid = L.map('mapid').setView([latitude, longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapid);
    route = new Route(this.workouts);
    mapid.on('click',this._handleMap.bind(this));
  }

  _handleMap(e) {
    route.onMapClick(e);
  }

  _checkLocalStorage() {
    let localStorageLength = Array.from(localStorage);
 
    if (localStorage.length >= 1) {
      let html = `
             ${localStorageLength.map((el,i) => this._generateRoute(i)).join('')}
             
      `;
          let routesList = document.querySelector('.routes-list');
          if(routesList.firstChild !== null) {
            while (routesList.firstChild) {
              routesList.removeChild(routesList.lastChild);
        }
          
          }
          routesList.insertAdjacentHTML('beforeend',html);
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
    return routesArr.map(i => JSON.parse(i))
  }
  _renderRoutes(i) {
    let pool = this._generateRoute(i);
    console.log(pool);
    
  }

  _generateRoute(index) {
    return `
    <div class="route-el routes-${index}">
    <p>routes-${index}</p>
    </div>
    `;
  }

  _renderWorkoutForm(totalDistance) {
    let html = `
    <div class="save-form-container">
    <h2 class="workout-form-header"> Workout Form</h2>
    <div class="input-container">
    <select id="type">
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
    </select>
      </div>
      <div class="input-container">
        <input placeholder="name" type="text" name="name" id="name" />
      </div>
      <div class="input-container">
        <input placeholder="distance" readonly type="text" name="" id="distance" value=${totalDistance} />
      </div>
      <div class="input-container">
        <input placeholder="date" type="date" name="" id="date" />
      </div>

      <div class="input-container time-container">
      <p>h:</p>
      <select id="hours">
        <option>00</option>
        <option>01</option>
        <option>02</option>
        <option>03</option>
        <option>04</option>
        <option>05</option>
        <option>06</option>
        <option>07</option>
        <option>08</option>
        <option>09</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
        <option>13</option>
        <option>14</option>
        <option>15</option>
        <option>16</option>
        <option>17</option>
        <option>18</option>
        <option>19</option>
        <option>20</option>
        <option>21</option>
        <option>22</option>
        <option>23</option>
      </select>
        <p>m:</p>
      <select id="mins">
        <option>00</option>
        <option>01</option>
        <option>02</option>
        <option>03</option>
        <option>04</option>
        <option>05</option>
        <option>06</option>
        <option>07</option>
        <option>08</option>
        <option>09</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
        <option>13</option>
        <option>14</option>
        <option>15</option>
        <option>16</option>
        <option>17</option>
        <option>18</option>
        <option>19</option>
        <option>20</option>
        <option>21</option>
        <option>22</option>
        <option>23</option>
        <option>24</option>
        <option>25</option>
        <option>26</option>
        <option>27</option>
        <option>28</option>
        <option>29</option>
        <option>30</option>
        <option>31</option>
        <option>32</option>
        <option>33</option>
        <option>34</option>
        <option>35</option>
        <option>36</option>
        <option>37</option>
        <option>38</option>
        <option>39</option>
        <option>40</option>
        <option>41</option>
        <option>42</option>
        <option>43</option>
        <option>44</option>
        <option>45</option>
        <option>46</option>
        <option>47</option>
        <option>48</option>
        <option>49</option>
        <option>50</option>
        <option>51</option>
        <option>52</option>
        <option>53</option>
        <option>54</option>
        <option>55</option>
        <option>56</option>
        <option>57</option>
        <option>58</option>
        <option>59</option>
      </select>
       <p>s:</p>
      <select id="seconds">
        <option>00</option>
        <option>01</option>
        <option>02</option>
        <option>03</option>
        <option>04</option>
        <option>05</option>
        <option>06</option>
        <option>07</option>
        <option>08</option>
        <option>09</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
        <option>13</option>
        <option>14</option>
        <option>15</option>
        <option>16</option>
        <option>17</option>
        <option>18</option>
        <option>19</option>
        <option>20</option>
        <option>21</option>
        <option>22</option>
        <option>23</option>
        <option>24</option>
        <option>25</option>
        <option>26</option>
        <option>27</option>
        <option>28</option>
        <option>29</option>
        <option>30</option>
        <option>31</option>
        <option>32</option>
        <option>33</option>
        <option>34</option>
        <option>35</option>
        <option>36</option>
        <option>37</option>
        <option>38</option>
        <option>39</option>
        <option>40</option>
        <option>41</option>
        <option>42</option>
        <option>43</option>
        <option>44</option>
        <option>45</option>
        <option>46</option>
        <option>47</option>
        <option>48</option>
        <option>49</option>
        <option>50</option>
        <option>51</option>
        <option>52</option>
        <option>53</option>
        <option>54</option>
        <option>55</option>
        <option>56</option>
        <option>57</option>
        <option>58</option>
        <option>59</option>
      </select>
      </div>
      <button id="submit">Save</button>
    </div>`;

    const muc = document.querySelector(`${elems.markUpContainerEl}`);
    muc.removeChild(muc.lastChild);
    muc.insertAdjacentHTML('beforeend',html);

    this.submitButton = document.getElementById('submit');
    this.submitButton.addEventListener('click', this._newWorkout.bind(this))
  }

  _renderWorkout(workOut) {
      let html = `
      <div class="workout_item">
        <div class="meter_container">
          <span class="material-icons"> outlined_flag </span>
          <p class="distance_meter">${workOut.distance}<span>km</span></p>
        </div>
        <div class="meter_container">
          <span class="material-icons"> speed </span>
          <p class="speed_meter">${workOut.speed}<span>mph</span></p>
        </div>
        <div class="meter_container">
          <span class="material-icons"> timer </span>
          <p class="time_meter">${workOut.duration.toFixed(2)}<span>Mins</span></p>
        </div>
        <div class="meter_container">
          <span class="material-icons"> calendar_today </span>
          <p class="type_meter">${workOut.type}</p>
        </div>
      </div>`;
    

    const muc = document.querySelector(`${elems.markUpContainerEl}`);
    // console.log()
    if(muc.lastChild.classList.contains('save-form-container')) {
      muc.removeChild(muc.lastChild);
    }
    muc.insertAdjacentHTML('beforeend',html);
  }
}


app = new App()


class Workout {
  id = (Date.now() + '').slice(-10);
  duration;
  date = new Date();

  speed; 

  constructor(duration, distance, name, type){
    this.duration = duration;
    this.distance = distance;
    this.name = name;
    this.type = type;
  }

  calculateSpeed() {
    this.speed = (this.distance / this.duration).toFixed(2);
    return this.speed; 
  }


}

class Cycle extends Workout {
  constructor(distance, duration, name, type) {
    super(duration, distance, name, type);
    this.calculateSpeed()
  }

}

class Run extends Workout { 
  constructor(distance, duration, name, type) {

    super(duration, distance, name, type);
    this.calculateSpeed()

  }

}

