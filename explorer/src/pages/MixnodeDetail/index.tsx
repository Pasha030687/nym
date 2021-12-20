import * as React from 'react';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColumnsType, DetailTable } from 'src/components/DetailTable';
import { mixnodeToGridRow, scrollToRef } from 'src/utils';
import { useParams } from 'react-router-dom';
import { BondBreakdownTable } from 'src/components/BondBreakdown';
import { ComponentError } from 'src/components/ComponentError';
import { ContentCard } from 'src/components/ContentCard';
import { MixNodeResponseItem } from 'src/typeDefs/explorer-api';
import { Title } from 'src/components/Title';
import { TwoColSmallTable } from 'src/components/TwoColSmallTable';
import { UptimeChart } from 'src/components/UptimeChart';
import { WorldMap } from 'src/components/WorldMap';
import { useMainContext } from 'src/context/main';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

const columns: ColumnsType[] = [
  {
    field: 'owner',
    title: 'Owner',
    headerAlign: 'left',
    width: 230,
  },
  {
    field: 'identity_key',
    title: 'Identity Key',
    headerAlign: 'left',
    width: 230,
  },

  {
    field: 'bond',
    title: 'Bond',
    flex: 1,
    headerAlign: 'left',
  },
  {
    field: 'self_percentage',
    title: 'Self %',
    headerAlign: 'left',
    width: 99,
  },
  {
    field: 'host',
    title: 'Host',
    headerAlign: 'left',
    flex: 1,
  },
  {
    field: 'location',
    title: 'Location',
    headerAlign: 'left',
    flex: 1,
  },
  {
    field: 'layer',
    title: 'Layer',
    headerAlign: 'left',
    flex: 1,
  },
];

export const PageMixnodeDetail: React.FC = () => {
  const ref = React.useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [row, setRow] = React.useState<MixNodeResponseItem[]>([]);
  const {
    fetchMixnodeById,
    mixnodeDetailInfo,
    fetchStatsById,
    fetchDelegationsById,
    fetchUptimeStoryById,
    fetchStatusById,
    stats,
    status,
    uptimeStory,
  } = useMainContext();
  const { id }: any = useParams();

  React.useEffect(() => {
    const hasNoDetail = id && !mixnodeDetailInfo;
    const hasIncorrectDetail =
      id &&
      mixnodeDetailInfo?.data &&
      mixnodeDetailInfo?.data[0].mix_node.identity_key !== id;
    if (hasNoDetail || hasIncorrectDetail) {
      fetchMixnodeById(id);
      fetchDelegationsById(id);
      fetchStatsById(id);
      fetchStatusById(id);
      fetchUptimeStoryById(id);
    } else if (mixnodeDetailInfo?.data !== undefined) {
      setRow(mixnodeDetailInfo?.data);
    }
  }, [id, mixnodeDetailInfo]);

  React.useEffect(() => {
    scrollToRef(ref);
  }, [ref]);

  return (
    <>
      <Box component="main" ref={ref}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Title text="Mixnode Detail" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                }}
              >
                <AccountCircleOutlinedIcon
                  style={{ height: '66px', width: '66px' }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, ml: isMobile ? 0 : 2 }}
                >
                  Mixnode
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                {!isMobile && (
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, textAlign: 'end' }}
                  >
                    Node Status:
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'end',
                    color: '#60D7EF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    mt: isMobile ? 2 : 0,
                    mb: isMobile ? 2 : 0,
                  }}
                >
                  <PauseCircleOutlineIcon />
                  &nbsp;Stand-by
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'darkgrey',
                    textAlign: isMobile ? 'center' : 'end',
                  }}
                >
                  This node is on standy by in this epoch
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: isMobile ? 4 : 2 }}>
              <Typography sx={{ fontSize: 21 }}>
                This node has not yet set a name.
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: isMobile ? 2 : 2 }}>
              <Typography sx={{ fontSize: 16 }}>
                This node has not yet set a description
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => null}
                  sx={{
                    background:
                      'linear-gradient(90deg, #F4731B 1.05%, #F12D50 100%)',
                    borderRadius: 30,
                    fontWeight: 800,
                  }}
                >
                  THIS IS A LINK
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container>
          <Grid item xs={12}>
            <DetailTable
              columnsData={columns}
              tableName="Mixnode detail table"
              rows={mixnodeToGridRow(row)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={0}>
          <Grid item xs={12}>
            <ContentCard title="Bond Breakdown">
              <BondBreakdownTable />
            </ContentCard>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={0}>
          <Grid item xs={12} md={4}>
            <ContentCard title="Mixnode Stats">
              {stats && (
                <>
                  {stats.error && (
                    <ComponentError text="There was a problem retrieving this nodes stats." />
                  )}
                  <TwoColSmallTable
                    loading={stats.isLoading}
                    error={stats?.error?.message}
                    title="Since startup"
                    keys={['Received', 'Sent', 'Explicitly dropped']}
                    values={[
                      stats?.data?.packets_received_since_startup || 0,
                      stats?.data?.packets_sent_since_startup || 0,
                      stats?.data?.packets_explicitly_dropped_since_startup ||
                        0,
                    ]}
                  />
                  <TwoColSmallTable
                    loading={stats.isLoading}
                    error={stats?.error?.message}
                    title="Since last update"
                    keys={['Received', 'Sent', 'Explicitly dropped']}
                    values={[
                      stats?.data?.packets_received_since_last_update || 0,
                      stats?.data?.packets_sent_since_last_update || 0,
                      stats?.data
                        ?.packets_explicitly_dropped_since_last_update || 0,
                    ]}
                    marginBottom
                  />
                </>
              )}
              {!stats && <Typography>No stats information</Typography>}
            </ContentCard>
          </Grid>
          <Grid item xs={12} md={8}>
            {uptimeStory && (
              <ContentCard title="Uptime story">
                {uptimeStory.error && (
                  <ComponentError text="There was a problem retrieving uptime history." />
                )}
                <UptimeChart
                  loading={uptimeStory.isLoading}
                  xLabel="date"
                  yLabel="uptime"
                  uptimeStory={uptimeStory}
                />
              </ContentCard>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={0}>
          <Grid item xs={12} md={4}>
            {status && (
              <ContentCard title="Mixnode Status">
                {status.error && (
                  <ComponentError text="There was a problem retrieving port information" />
                )}
                <TwoColSmallTable
                  loading={status.isLoading}
                  error={status?.error?.message}
                  keys={['Mix port', 'Verloc port', 'HTTP port']}
                  values={[1789, 1790, 8000].map((each) => each)}
                  icons={
                    (status?.data?.ports &&
                      Object.values(status.data.ports)) || [false, false, false]
                  }
                />
              </ContentCard>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            {mixnodeDetailInfo && (
              <ContentCard title="Location">
                {mixnodeDetailInfo?.error && (
                  <ComponentError text="There was a problem retrieving this mixnode location" />
                )}
                {mixnodeDetailInfo.data &&
                  mixnodeDetailInfo?.data[0]?.location && (
                    <WorldMap
                      loading={mixnodeDetailInfo.isLoading}
                      userLocation={[
                        mixnodeDetailInfo?.data[0]?.location?.lng,
                        mixnodeDetailInfo?.data[0]?.location?.lat,
                      ]}
                    />
                  )}
              </ContentCard>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
