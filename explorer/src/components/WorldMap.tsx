import React from 'react';
import { scaleLinear } from 'd3-scale';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import { Box, Typography } from '@mui/material';
import { MainContext } from '../context/main';
import { CountryDataResponse, ApiState } from 'src/typeDefs/explorer-api';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

type MapProps = {
  title?: string,
  userLocation?: [number, number],
  countryData?: ApiState<CountryDataResponse>,
  loading: boolean
}

export const WorldMap: React.FC<MapProps> = ({ title, countryData, userLocation, loading }) => {

  const [hasNoContent, setHasNoContent] = React.useState<boolean>(true);
  const [tooltipContent, setTooltipContent] = React.useState<string | null>(null);
  const { mode } = React.useContext(MainContext);

  const colorScale: any = scaleLinear()
    .domain([0, 1200])
    // @ts-ignore
    .range(mode === 'dark' ? ['#ffedea', '#ff5233'] : ['orange', 'red']);


  React.useEffect(() => {
    if (userLocation || countryData) {
      setHasNoContent(false);
    }
  }, [countryData, userLocation])
  return (
    <>
      <Box>
        <ComposableMap
          data-tip=""
          style={{
            backgroundColor:
              mode === 'dark'
                ? 'rgba(50, 60, 81, 1)'
                : 'rgba(241, 234, 234, 1)',
            '-webkit-filter': hasNoContent ? 'blur(5px)' : null,
            filter: hasNoContent ? 'blur(5px)' : null,
          }}
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 180,
          }}
        >
          <ZoomableGroup>

            <Geographies geography={geoUrl}>
              {({ geographies }: any) =>
                geographies.map((geo: any) => {
                  // @ts-ignore
                  const d = countryData && countryData.data && countryData.data.find((s) => s.ISO3 === geo.properties.ISO_A3)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // @ts-ignore
                      fill={d ? colorScale(d.nodes) : '#F5F4F6'}
                      onMouseEnter={() => {
                        const { NAME_LONG } = geo.properties;
                        if (!userLocation) {
                          setTooltipContent(
                            // @ts-ignore
                            `${NAME_LONG} | ${d?.nodes || 0}`,
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      style={
                        !userLocation && countryData && {
                          hover: {
                            fill: 'black',
                            outline: 'white',
                          },
                        }
                      }
                    />
                  );
                })
              }
            </Geographies>


            {userLocation && (
              <Marker coordinates={userLocation}>
                <g
                  fill="grey"
                  stroke="#FF5533"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-12, -10)"
                >
                  <circle cx="12" cy="10" r="5" />
                </g>
              </Marker>
            )}

          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip>{tooltipContent}</ReactTooltip>
      </Box>
    </>
  );
};
