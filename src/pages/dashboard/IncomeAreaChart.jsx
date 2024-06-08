import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart() {
  const data = [
    {
      "_count": {
        "_all": 66
      },
      "iEventType": 3
    },
    {
      "_count": {
        "_all": 29
      },
      "iEventType": 17
    }
  ];
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Transformasi data
    const newSeries = data.map(item => ({
      name: `EventType ${item.iEventType}`,
      data: [item._count._all] // Gunakan nilai count dari data Anda
    }));

    // Update state series
    setSeries(newSeries);
  }, [data]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: data.map((item, index) => `Event ${index + 1}`), // Gunakan kategori yang sesuai dengan data Anda
        labels: {
          style: {
            colors: Array(data.length).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: data.length
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      }
    }));
  }, [primary, secondary, line, theme, data]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = { data: PropTypes.array.isRequired };
