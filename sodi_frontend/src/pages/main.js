
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { GeolocateControl, Map, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import { uberMapApiKey } from '../utils/api';
// import Geocoder from 'react-map-gl-geocoder/src';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { GeoJsonLayer, DeckGL } from 'deck.gl';
// import 'maplibre-gl/dist/maplibre-gl.css';

const transformRequest = (url, resourceType) => {
  if (resourceType === 'Tile' && url.match('localhost')) {
    return {
      url: url,
      headers: { Authorization: 'Bearer ' + publicKey },
    };
  }
};

export const Main = () => {
  // return <Map mapLib={maplibregl} />;
  // 원하는 포크 사용 시 사용

  const [viewState, setViewState] = React.useState({
    longitude: 0,
    latitude: 0,
    zoom: 3.5,
    transitionDuration: 100,
  });

  const geolocateControlRef = React.useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
      console.log('safasfsaf');
    }
  }, []);

  const [searchResultLayer, setSearchResultLayer] = useState(null);
  const mapRef = useRef();
  const handleOnResult = (event) => {
    console.log(event.result);
    setSearchResultLayer(
        new GeoJsonLayer({
          id: 'search-result',
          data: event.result.geometry,
          getFillColor: [255, 0, 0, 128],
          getRadius: 1000,
          pointRadiusMinPixels: 10,
          pointRadiusMaxPixels: 10,
        })
    );
  };
  const handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    console.log('Updating');
    return setViewState({
      ...viewState,
      ...geocoderDefaultOverrides,
    });
  };

  useEffect(() => {
      /*
      * searchType
      *  - place
      *  - postcode
      *  - address
      *  - country
      *  - region
      *  - district
      *  - locality
      *  - neighborhood
      *  - poi
      *
      * search Optional parameters
      *  - ip
      *  - coordinate
      *  - none
      *
      *
      * */
      (async () => {
          let data = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/can.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${process.env.REACT_APP_PUBLIC_KEY}`).then(result => result.json());
          console.log(data)
      })();
  }, []);

  return (
      <div>
        <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={(evt) => console.log(evt)}
            onViewPortChange={setViewState}
            mapboxAccessToken={publicKey}
            style={{ width: window.innerWidth, height: window.innerHeight }}
            mapStyle="mapbox://styles/janghyuck/claib2r2b000115nv6hdl2oct"
        >
          <GeolocateControl ref={mapRef} />

          {/*<MapboxGeocoder*/}
          {/*    mapRef={mapRef}*/}
          {/*    onResult={handleOnResult}*/}
          {/*    onViewportChange={handleGeocoderViewportChange}*/}
          {/*    mapboxApiAccessToken={publicKey}*/}
          {/*    position={'top-left'}*/}
          {/*/>*/}

          <Marker
              longitude={-100}
              latitude={40}
              anchor={'bottom'}
              onClick={(e) => console.log('asfsaf')}
          />
        </Map>
          <DeckGL {...viewState} layers={[searchResultLayer]} />
      </div>
  );
};

