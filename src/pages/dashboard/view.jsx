import { useEffect, useMemo, useState } from 'react';

import {
  Card,
  styled,
  Divider,
  useTheme,
  Typography,
  CardHeader,
  CardContent,
  Button,
} from '@mui/material';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import Chart, { useChart } from 'src/components/chart';
import Iconify from 'src/components/iconify/iconify';
import Api from 'src/utils/api';
import ModalAddAsset from './modals/ModalAddAsset';

const StyledChart = styled(Chart)(({ theme }) => ({
  height: 300,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: 50,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${300 - 50}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function Dashboard() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const [modalAddAsset, setModalAddAsset] = useState(false);
  const [userQuotes, setUserQuotes] = useState([]);

  useEffect(() => {
    Api.get("/user/quotes").then((response) => {
      setUserQuotes(response);
    });
  }, []);


  const seriesData = useMemo(() => {
    if (!userQuotes || userQuotes.length === 0) return [];

    return userQuotes
      .sort((a, b) => new Date(a.date_creation) - new Date(b.date_creation))
      .map((quote) => ({
        x: new Date(quote.date_creation).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        y: quote.double_value,
      }));
  }, [userQuotes]);

  const chartLineOptions = useChart({
    colors: [theme.palette.primary.main],
    chart: { type: 'line', height: 350, sparkline: { enabled: false } },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (value) => `${value} $`,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => `${value} $`,
      },
    },
  });

  const series = [
    { label: 'Desktop', data: [44] },
    { label: 'Tablet', data: [55] },
    { label: 'Mobile', data: [41] },
  ];
  const chartPieOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main],
    labels: series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `$${value}`,
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  useEffect(() => {
    // Api.get(`${endpoints.user.action}`).then((response) => {
    //   console.log(response);
    // });
  }, []);

  return (
    <>
      <ModalAddAsset isOpen={modalAddAsset} onClose={() => setModalAddAsset(false)} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Typography variant="h4">Welcome back, {user.str_username}</Typography>
          <div>
            {/* <Button variant="contained" sx={{ mt: 2 }}>
              Upgrade to PRO
            </Button> */}
            <Button
              sx={{
                mt: 2,
              }}
              variant='contained'
              color='info'
              onClick={() => {
                setModalAddAsset(true);
              }}
            >
              <Iconify icon="material-symbols:add" />
              <Typography variant="body2">Add an asset</Typography>
            </Button>
          </div>
        </div>
      </div>
      <Divider sx={{ mb: 3, mt: 3 }} />
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Chart
            options={chartLineOptions}
            series={[{ name: 'Value', data: seriesData }]}
            type="line"
            height={250}
          />
        </CardContent>
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <Card sx={{ width: '90%', marginRight: '20px' }}>
          <CardContent>
            <StyledChart type="pie" options={chartPieOptions} series={[44, 55, 41]} height={250} />
          </CardContent>
        </Card>
        <Card sx={{ width: '90%' }}>
          <CardHeader title="Recent transactions" />
          <Divider sx={{ mt: 2 }} />
        </Card>
      </div>
    </>
  );
}
