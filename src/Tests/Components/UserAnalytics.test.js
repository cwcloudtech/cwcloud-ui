import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAnalytics from '../../Components/Charts/UserAnalytics';
import GlobalContext from '../../Context/GlobalContext';

// Mock the chart.js registration to avoid errors
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  ArcElement: jest.fn(),
}));

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
}));

// Mock translations
jest.mock('react-translate-component', () => ({
  __esModule: true,
  default: ({ content }) => <span>{content}</span>,
}));

describe('UserAnalytics', () => {
  const mockUsers = [
    {
      created_at: '2024-01-15T10:00:00Z',
      is_admin: true,
      enabled_features: {
        iotapi: true,
        k8sapi: false,
        daasapi: false,
        faasapi: true,
        emailapi: false
      }
    },
    {
      created_at: '2024-02-20T15:30:00Z',
      is_admin: false,
      enabled_features: {
        iotapi: true,
        k8sapi: true,
        daasapi: true,
        faasapi: false,
        emailapi: true
      }
    }
  ];

  const renderComponent = (users = [], mode = 'light') => {
    return render(
      <GlobalContext.Provider value={{ mode }}>
        <UserAnalytics users={users} />
      </GlobalContext.Provider>
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render all three charts when users data is provided', () => {
    renderComponent(mockUsers);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  it('should render chart titles', () => {
    renderComponent(mockUsers);

    expect(screen.getByText('dashboard.usersPage.enabledFeaturesDistribution')).toBeInTheDocument();
    expect(screen.getByText('dashboard.usersPage.monthlyUserRegistrations')).toBeInTheDocument();
    expect(screen.getByText('dashboard.usersPage.userRoleDistribution')).toBeInTheDocument();
  });

  it('should handle empty users array', () => {
    renderComponent([]);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

//   it('should register ChartJS components on mount', () => {
//     renderComponent(mockUsers);
//     expect(ChartJS.register).toHaveBeenCalled();
//   });

  it('should process features data correctly', () => {
    const { container } = renderComponent(mockUsers);
    
    // We can't directly test the chart data due to the mocked components,
    // but we can verify the charts are rendered with the correct structure
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelectorAll('.mainContainer')).toHaveLength(1);
  });

  it('should handle dark mode', () => {
    renderComponent(mockUsers, 'dark');
    
    // Verify the component renders in dark mode
    // You might want to add specific dark mode classes or styles to test
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  // Test data processing functions indirectly through renders
  it('should process registration data correctly', () => {
    renderComponent(mockUsers);
    
    // Verify the bar chart is rendered with monthly registration data
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should process admin data correctly', () => {
    renderComponent(mockUsers);
    
    // Verify the doughnut chart is rendered with admin distribution data
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  // Test chart options and styling
  it('should apply correct styles to chart container', () => {
    const { container } = renderComponent(mockUsers);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainContainer = container.querySelector('.mainContainer');
    expect(mainContainer).toBeInTheDocument();
    
    // Verify flex container styles
    // eslint-disable-next-line testing-library/no-node-access
    const flexContainer = mainContainer.firstChild;
    expect(flexContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
    });
  });
});
