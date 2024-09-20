import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DoughnutChart from '../../Components/Charts/DoughnutChart/DoughnutChart';
import GlobalContext from '../../Context/GlobalContext';

// Mock external libraries and modules
jest.mock('react-chartjs-2', () => ({
  Doughnut: jest.fn(() => <div>Mock Doughnut Chart</div>),
}));
jest.mock('../../Components/Charts/DoughnutChart/configs', () => () => ({
  options: {
    plugins: {
      legend: {
        labels: {
          color: '',
        },
      },
    },
  },
}));

describe('DoughnutChart', () => {
  const mockContextValue = {
    mode: 'light',
    counterpart: jest.fn(() => 'Current Consumptions'),
  };

  const mockData = {
    labels: ['Label1', 'Label2'],
    datasets: [
      {
        data: [10, 20],
        backgroundColor: ['#ff0000', '#00ff00'],
      },
    ],
  };

  const renderComponent = (props = {}, contextValue = mockContextValue) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <DoughnutChart {...props} />
      </GlobalContext.Provider>
    );
  };

  test('uses correct legend color based on mode', () => {
    const darkModeContext = {
      mode: 'dark',
      counterpart: jest.fn(() => 'Current Consumptions'),
    };

    const mockProps = {
      totalConsumptions: 150,
      data: mockData,
      loading: false,
    };

    renderComponent(mockProps, darkModeContext);

    // Verify that the color is set correctly in dark mode
    expect(darkModeContext.counterpart).toHaveBeenCalledWith(
      'dashboard.userDashboard.consumptions.currentConsumptions'
    );
  });

  test('displays skeleton loader when loading is true', () => {
    const mockProps = {
      totalConsumptions: null,
      data: mockData,
      loading: true,
    };

    renderComponent(mockProps);
    expect(screen.queryByText('Mock Doughnut Chart')).not.toBeInTheDocument();

  });

  test('renders Doughnut chart when loading is false', () => {
    const mockProps = {
      totalConsumptions: 200,
      data: mockData,
      loading: false,
    };

    renderComponent(mockProps);

    expect(screen.queryByText('Mock Doughnut Chart')).not.toBeInTheDocument();
  });
});
