import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenericTable from '../../Components/Table/GenericTable';
import GlobalContext from '../../Context/GlobalContext';

// Mock the react-translate-component
jest.mock('react-translate-component', () => ({ children }) => children);

// Mock the material-ui components
jest.mock('@material-ui/core', () => ({
  Tooltip: ({ children }) => children,
}));

// Mock the mui icons
jest.mock('@mui/icons-material/Add', () => () => 'AddIcon');
jest.mock('@mui/icons-material/Edit', () => () => 'EditIcon');
jest.mock('@mui/icons-material/Delete', () => () => 'DeleteIcon');

describe('GenericTable', () => {
  const mockContext = {
    mode: 'light',
    counterpart: jest.fn().mockReturnValue('Add'),
  };

  const defaultProps = {
    title: 'Test Table',
    addNewItem: jest.fn(),
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    columns: [
      { header: 'Name', accessor: (item) => item.name },
    ],
    noItemsMessage: 'No items',
    editItem: jest.fn(),
    deleteItem: jest.fn(),
  };

  const setup = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return render(
      <GlobalContext.Provider value={mockContext}>
        <GenericTable {...mergedProps} />
      </GlobalContext.Provider>
    );
  };

  it('renders the add button', () => {
    setup();
    expect(screen.getByText('AddIcon')).toBeInTheDocument();
  });

  it('renders table rows with correct data', () => {
    setup();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each row', () => {
    setup();
    expect(screen.getAllByText('EditIcon')).toHaveLength(2);
    expect(screen.getAllByText('DeleteIcon')).toHaveLength(2);
  });

  it('calls addNewItem when add button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('AddIcon'));
    expect(defaultProps.addNewItem).toHaveBeenCalledTimes(1);
  });

  it('calls editItem when edit button is clicked', () => {
    setup();
    fireEvent.click(screen.getAllByText('EditIcon')[0]);
    expect(defaultProps.editItem).toHaveBeenCalledWith(0);
  });

  it('calls deleteItem when delete button is clicked', () => {
    setup();
    fireEvent.click(screen.getAllByText('DeleteIcon')[0]);
    expect(defaultProps.deleteItem).toHaveBeenCalledWith(0);
  });

  it('does not render actions column when showActions is false', () => {
    setup({ showActions: false });
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });
});