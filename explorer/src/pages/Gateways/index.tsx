import * as React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { printableCoin } from '@nymproject/nym-validator-client';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  cellStyles,
  UniversalDataGrid,
} from 'src/components/Universal-DataGrid';
import { MainContext } from 'src/context/main';
import { gatewayToGridRow } from 'src/utils';
import { GatewayResponse } from 'src/typeDefs/explorer-api';
import { TableToolbar } from 'src/components/TableToolbar';
import { ContentCard } from 'src/components/ContentCard';
import { CustomColumnHeading } from 'src/components/CustomColumnHeading';
import { Title } from 'src/components/Title';

export const PageGateways: React.FC = () => {
  const { gateways } = React.useContext(MainContext);
  const [filteredGateways, setFilteredGateways] =
    React.useState<GatewayResponse>([]);
  const [pageSize, setPageSize] = React.useState<string>('50');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const handleSearch = (str: string) => {
    setSearchTerm(str.toLowerCase());
  };

  React.useEffect(() => {
    if (searchTerm === '' && gateways?.data) {
      setFilteredGateways(gateways?.data);
    } else {
      const filtered = gateways?.data?.filter((g) => {
        if (
          g.gateway.location.toLowerCase().includes(searchTerm) ||
          g.gateway.identity_key.toLocaleLowerCase().includes(searchTerm) ||
          g.owner.toLowerCase().includes(searchTerm)
        ) {
          return g;
        }
        return null;
      });
      if (filtered) {
        setFilteredGateways(filtered);
      }
    }
  }, [searchTerm, gateways?.data]);

  const columns: GridColDef[] = [
    {
      field: 'owner',
      renderHeader: () => <CustomColumnHeading headingTitle="Owner" />,
      width: 200,
      headerAlign: 'left',
      headerClassName: 'MuiDataGrid-header-override',
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={cellStyles}>{params.value}</Typography>
      ),
    },
    {
      field: 'identity_key',
      renderHeader: () => <CustomColumnHeading headingTitle="Identity Key" />,
      width: 200,
      headerAlign: 'left',
      headerClassName: 'MuiDataGrid-header-override',
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={cellStyles}>{params.value}</Typography>
      ),
    },
    {
      field: 'bond',
      width: 120,
      type: 'number',
      renderHeader: () => <CustomColumnHeading headingTitle="Bond" />,
      headerClassName: 'MuiDataGrid-header-override',
      headerAlign: 'left',
      renderCell: (params: GridRenderCellParams) => {
        const bondAsPunk = printableCoin({
          amount: params.value as string,
          denom: 'upunk',
        });
        return <Typography sx={cellStyles}>{bondAsPunk}</Typography>;
      },
    },
    {
      field: 'host',
      renderHeader: () => <CustomColumnHeading headingTitle="IP:Port" />,
      flex: 1,
      headerAlign: 'left',
      headerClassName: 'MuiDataGrid-header-override',
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={cellStyles}>{params.value}</Typography>
      ),
    },
    {
      field: 'location',
      renderHeader: () => <CustomColumnHeading headingTitle="Location" />,
      flex: 1,
      headerAlign: 'left',
      headerClassName: 'MuiDataGrid-header-override',
      renderCell: (params: GridRenderCellParams) => (
        <Button
          onClick={() => handleSearch(params.value as string)}
          sx={{ ...cellStyles, justifyContent: 'flex-start' }}
        >
          {params.value}
        </Button>
      ),
    },
  ];

  const handlePageSize = (event: SelectChangeEvent<string>) => {
    setPageSize(event.target.value);
  };

  if (gateways?.data) {
    return (
      <>
        <Title text="Gateways" />
        <Grid container>
          <Grid item xs={12} md={12} lg={10} xl={10}>
            <ContentCard>
              <TableToolbar
                onChangeSearch={handleSearch}
                onChangePageSize={handlePageSize}
                pageSize={pageSize}
                searchTerm={searchTerm}
              />
              <UniversalDataGrid
                loading={gateways?.isLoading}
                columnsData={columns}
                rows={gatewayToGridRow(filteredGateways)}
                pageSize={pageSize}
                pagination={gateways?.data?.length > 12}
              />
            </ContentCard>
          </Grid>
        </Grid>
      </>
    );
  }
  return null;
};
