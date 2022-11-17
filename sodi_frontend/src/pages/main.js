
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';

import {GeolocateControl, Layer, Map, Marker, Source} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GeoJsonLayer, DeckGL } from 'deck.gl';
import styled from 'styled-components';
import {Box, Button, Card, CardActions, CardContent, TextField, Typography} from "@mui/material";
import {debounce} from "../utils/util";
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import Geocoder from 'react-map-gl-geocoder/src';
// import 'maplibre-gl/dist/maplibre-gl.css';

const publicKey = process.env.REACT_APP_PUBLIC_KEY;

const transformRequest = (url, resourceType) => {
  if (resourceType === 'Tile' && url.match('localhost')) {
    return {
      url: url,
      headers: { Authorization: 'Bearer ' + publicKey },
    };
  }
};

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  flex:0.75;
  
  & canvas {
    width: 100%;
    height: 100%;
  }
`;

const SearchContainer = styled.div`
  flex:0.25;
  position: relative;
  height: 100%;
  box-shadow: 10px 10px 10px rgba(0,0,0, .1);
  z-index: 1;
  padding: 15px;
  
  & .inputContainer {
    margin-bottom: 35px;
  }
  
  & .searchResults {
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
    
    & .searchResult {
      margin-bottom: 10px;
    }
  }
`;

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
          // let data = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/can.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${publicKey}`).then(result => result.json());
          // console.log(data)
      })();
  }, []);

  const testObj = {
      "type": "FeatureCollection",
      "query": [
          "moscow",
          "russia"
      ],
      "features": [
          {
              "id": "place.558274",
              "type": "Feature",
              "place_type": [
                  "region",
                  "place"
              ],
              "relevance": 1,
              "properties": {
                  "short_code": "RU-MOW",
                  "wikidata": "Q649"
              },
              "text": "Moscow",
              "place_name": "Moscow, Russia",
              "bbox": [
                  36.803169905,
                  55.1421259,
                  37.967345053,
                  56.0214791
              ],
              "center": [
                  37.6174943,
                  55.7504461
              ],
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      37.6174943,
                      55.7504461
                  ]
              },
              "context": [
                  {
                      "id": "country.8898",
                      "short_code": "ru",
                      "wikidata": "Q159",
                      "text": "Russia"
                  }
              ]
          },
          {
              "id": "address.3022552080865126",
              "type": "Feature",
              "place_type": [
                  "address"
              ],
              "relevance": 0.9,
              "properties": {
                  "accuracy": "street"
              },
              "text": "Московская Улица",
              "place_name": "Russia, Kabardino-Balkaria, Майский, 361115, Московская Улица",
              "center": [
                  44.0598701152369,
                  43.6342368
              ],
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      44.0598701152369,
                      43.6342368
                  ]
              },
              "context": [
                  {
                      "id": "postcode.115699394",
                      "text": "361115"
                  },
                  {
                      "id": "place.73681090",
                      "wikidata": "Q25952",
                      "text": "Майский"
                  },
                  {
                      "id": "district.6940354",
                      "wikidata": "Q26007",
                      "text": "Майский район"
                  },
                  {
                      "id": "region.345282",
                      "short_code": "RU-KB",
                      "wikidata": "Q5267",
                      "text": "Kabardino-Balkaria"
                  },
                  {
                      "id": "country.8898",
                      "short_code": "ru",
                      "wikidata": "Q159",
                      "text": "Russia"
                  }
              ]
          },
          {
              "id": "address.5131920528675574",
              "type": "Feature",
              "place_type": [
                  "address"
              ],
              "relevance": 0.9,
              "properties": {
                  "accuracy": "street"
              },
              "text": "Московская Улица",
              "place_name": "Russia, Kabardino-Balkaria, Нальчик, 360030, Московская Улица",
              "center": [
                  43.56918863611,
                  43.47527985
              ],
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      43.56918863611,
                      43.47527985
                  ]
              },
              "context": [
                  {
                      "id": "postcode.115322562",
                      "text": "360030"
                  },
                  {
                      "id": "place.83208386",
                      "wikidata": "Q5265",
                      "text": "Нальчик"
                  },
                  {
                      "id": "region.345282",
                      "short_code": "RU-KB",
                      "wikidata": "Q5267",
                      "text": "Kabardino-Balkaria"
                  },
                  {
                      "id": "country.8898",
                      "short_code": "ru",
                      "wikidata": "Q159",
                      "text": "Russia"
                  }
              ]
          },
          {
              "id": "address.396910919964880",
              "type": "Feature",
              "place_type": [
                  "address"
              ],
              "relevance": 0.9,
              "properties": {
                  "accuracy": "street"
              },
              "text": "Московская Улица",
              "place_name": "Russia, Kabardino-Balkaria, Яникой, 361423, Московская Улица",
              "center": [
                  43.5307664473525,
                  43.5333451
              ],
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      43.5307664473525,
                      43.5333451
                  ]
              },
              "context": [
                  {
                      "id": "postcode.116223682",
                      "text": "361423"
                  },
                  {
                      "id": "place.163342530",
                      "text": "Яникой"
                  },
                  {
                      "id": "district.13354690",
                      "wikidata": "Q870979",
                      "text": "Чегемский район"
                  },
                  {
                      "id": "region.345282",
                      "short_code": "RU-KB",
                      "wikidata": "Q5267",
                      "text": "Kabardino-Balkaria"
                  },
                  {
                      "id": "country.8898",
                      "short_code": "ru",
                      "wikidata": "Q159",
                      "text": "Russia"
                  }
              ]
          },
          {
              "id": "address.5017173411233516",
              "type": "Feature",
              "place_type": [
                  "address"
              ],
              "relevance": 0.5,
              "properties": {
                  "accuracy": "street"
              },
              "text": "Russia",
              "place_name": "Russia, 12598 Peníscola, Castellón, Spain",
              "center": [
                  0.3900472,
                  40.3637777
              ],
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      0.3900472,
                      40.3637777
                  ]
              },
              "context": [
                  {
                      "id": "postcode.17870406",
                      "text": "12598"
                  },
                  {
                      "id": "locality.299092550",
                      "text": "Peníscola"
                  },
                  {
                      "id": "place.43886662",
                      "wikidata": "Q845424",
                      "text": "Peníscola"
                  },
                  {
                      "id": "region.107590",
                      "short_code": "ES-CS",
                      "wikidata": "Q54942",
                      "text": "Castellón"
                  },
                  {
                      "id": "country.8774",
                      "short_code": "es",
                      "wikidata": "Q29",
                      "text": "Spain"
                  }
              ]
          }
      ],
      "attribution": "NOTICE: © 2022 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."
  };

    const layerStyle = {
        id: 'point',
        type: 'circle',
        paint: {
            'circle-radius': 7,
            'circle-color': '#007cbf'
        }
    };

    const [timer, setTimer] = useState(0); // 디바운싱 타이머
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchLayer, setSearchLayer] = useState({});

    const onChangeBySearch = useCallback(({ target }) => {
    setSearchKeyword(target.value);
        // 디바운싱 - 마지막 호출만 적용 (put api)
        if (timer) {
            console.log('clear timer');
            clearTimeout(timer);
        }
        const newTimer = setTimeout(async () => {
            try {
                let data = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${target.value}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${publicKey}`).then(result => result.json());
                console.log('data',data)
                setSearchLayer(data);
            } catch (e) {
                console.error('error', e);
            }
        }, 800);
        setTimer(newTimer);

    }, [searchKeyword, searchLayer]);



  return (
      <FlexContainer>
          <SearchContainer>
              <Box className="inputContainer">
                  <TextField fullWidth id="outlined-basic" value={searchKeyword} label="Search" variant="outlined" onChange={onChangeBySearch} />
              </Box>
              <Box className="searchResults">
                  {(searchLayer?.features || []).map(({ place_name}) => (
                      <Card variant="outlined" className={'searchResult'}>
                          <CardContent>
                              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                  Test Title
                              </Typography>
                              <Typography variant="h5" component="div">
                                  {place_name}
                              </Typography>
                              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                  Test
                              </Typography>
                              <Typography variant="body2">
                                  well meaning and kindly.
                                  <br />
                                  {'"a benevolent smile"'}
                              </Typography>
                          </CardContent>
                          <CardActions>
                              <Button size="small">Go to the place</Button>
                          </CardActions>
                      </Card>
                  ))}

              </Box>
          </SearchContainer>
          <MapContainer>
              <Map
                  ref={mapRef}
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  onClick={(evt) => console.log(evt)}
                  onViewPortChange={setViewState}
                  mapboxAccessToken={publicKey}
                  // style={{ width: window.innerWidth, height: window.innerHeight }}
                  mapStyle="mapbox://styles/janghyuck/claib2r2b000115nv6hdl2oct"
              >
                  <GeolocateControl ref={mapRef} />

                  {/*<MapboxGeocoder*/}
                  {/*    mapRef={mapRef}*/}
                  {/*    onResult={handleOnResult}*/}
                  {/*    onViewportChange={handleGeocoderViewportChange}*/}
                  {/*    mapboxApiAccessToken={}*/}
                  {/*    position={'top-left'}*/}
                  {/*/>*/}

                  <Source id={'my-Data'} type={'geojson'} data={testObj}>
                      <Layer {...layerStyle} />
                  </Source>

                  <Marker
                      longitude={-100}
                      latitude={40}
                      anchor={'bottom'}
                      onClick={(e) => console.log('asfsaf')}
                  />
              </Map>
          </MapContainer>
      </FlexContainer>
  );
};

