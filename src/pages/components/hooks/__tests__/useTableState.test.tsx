import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { executeQuery, ingestData } from 'services/KustoClient';
import { useStateStore } from 'state';
import { useTableState } from '../useTableState';

// mock Kusto Client.
jest.mock('services/KustoClient', () => ({
  executeQuery: jest.fn(),
  ingestData: jest.fn(),
}));

// mock useStateStore class
jest.mock('state', () => ({
  useStateStore: jest.fn(),
}));

describe('useTableState', () => {
  const tableName = 'testTable';
  const tableFunction = 'testFunction';
  const columnsMetadata = [
    {
      Display: 'Date',
      Key: 'Date',
      Type: 'datetime',
    },
    {
      Display: 'CPU',
      Key: 'CPU',
      PrimaryKey: true,
      Type: 'string',
    },
    {
      Display: 'Generation',
      Key: 'Generation',
      PrimaryKey: true,
      Type: 'string',
    },
    {
      Display: 'SKU',
      Key: 'SKU',
      PrimaryKey: true,
      Type: 'string',
    },
    {
      Display: 'Efficiency',
      Key: 'Efficiency',
      Type: 'real',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  beforeEach(() => {
    (useStateStore as jest.Mock).mockReturnValue({
      effects: {
        login: jest.fn(),
      },
      state: {
        user: {
          isAuthenticated: true,
          userName: 'testUser',
        },
      },
    });

    (executeQuery as jest.Mock).mockReturnValue({
      columns: [
        {
          name: 'CPU',
          type: 'string',
        },
        {
          name: 'Generation',
          type: 'string',
        },
        {
          name: 'SKU',
          type: 'string',
        },
        {
          name: 'GoLiveTargetDate',
          type: 'datetime',
        },
        {
          name: 'SellablevCorePerNode',
          type: 'real',
        },
        {
          name: 'Source',
          type: 'string',
        },
        {
          name: 'Note',
          type: 'string',
        },
      ],
      data: [
        ['Intel', 'Gen9', '28.8KW', 90.0, 3.0, 'L', ''],
        ['Intel', 'Gen10', '34.4KW', 78.0, 2.0, 'L', ''],
      ],
    });

    (ingestData as jest.Mock).mockReturnValue({
      columns: [],
      data: [],
    });
  });

  it('should return initial state', () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );
    const {
      state: { columns, error, isLoading, tableRows, isEditable },
      effects: {
        addNewRow,
        deleteRow,
        enableEdit,
        updateTableRow,
        hasUpdates,
        resetTableData,
        saveUpdatedRows,
      },
    } = result.current;

    // Assert
    expect(columns).toEqual([]);
    expect(error).toEqual('');
    expect(isLoading).toEqual(true);
    expect(tableRows).toEqual([]);
    expect(isEditable).toEqual(false);

    expect(addNewRow).toBeInstanceOf(Function);
    expect(deleteRow).toBeInstanceOf(Function);
    expect(enableEdit).toBeInstanceOf(Function);
    expect(updateTableRow).toBeInstanceOf(Function);
    expect(hasUpdates).toBeInstanceOf(Function);
    expect(resetTableData).toBeInstanceOf(Function);
    expect(saveUpdatedRows).toBeInstanceOf(Function);

    unmount();
  });

  it('should add new row', () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    // Assert
    expect(result.current.state.tableRows[0].currentState).toEqual('NEW');
    expect(result.current.effects.hasUpdates()).toEqual(true);

    unmount();
  });

  it('should update row', () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    act(() => {
      result.current.effects.updateTableRow(
        0,
        'testColumn',
        'string',
        'testValue',
        false,
      );
    });

    // Assert
    expect(result.current.state.tableRows[0].currentState).toEqual('UPDATED');
    expect(result.current.state.tableRows[0].testColumn).toEqual('testValue');
    expect(result.current.effects.hasUpdates()).toEqual(true);

    unmount();
  });

  it('should delete row', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    act(() => {
      result.current.effects.deleteRow(0);
    });

    // Assert
    expect(result.current.state.tableRows[0].currentState).toEqual('DELETED');
    expect(result.current.effects.hasUpdates()).toEqual(true);

    unmount();
  });

  it('should enable and disable edit', () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.enableEdit(true);
    });

    expect(result.current.state.isEditable).toEqual(true);

    act(() => {
      result.current.effects.enableEdit(false);
    });

    // Assert
    expect(result.current.state.isEditable).toEqual(false);

    unmount();
  });

  it('should save the row', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });
    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    // Assert
    expect(result.current.state.tableRows[0].currentState).toEqual(
      'INITIALIZED',
    );
    expect(result.current.state.error).toEqual('');
    expect(result.current.effects.hasUpdates()).toEqual(false);

    // Act
    act(() => {
      result.current.effects.deleteRow(0);
    });

    // Assert
    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    unmount();
  });

  it('should sort column', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Assert - initial state
    expect(result.current.state.order).toEqual('asc');
    expect(result.current.state.orderBy).toEqual('Generation');

    // Act
    act(() => {
      result.current.effects.handleSort('Generation');
    });

    // Assert
    expect(result.current.state.order).toEqual('desc');
    expect(result.current.state.orderBy).toEqual('Generation');

    // Act
    act(() => {
      result.current.effects.handleSort('CPU');
    });

    // Assert
    expect(result.current.state.order).toEqual('asc');
    expect(result.current.state.orderBy).toEqual('CPU');

    unmount();
  });

  it('should reset the table data', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    // Assert
    expect(result.current.state.tableRows[0].currentState).toEqual('NEW');
    expect(result.current.effects.hasUpdates()).toEqual(true);

    // Act
    act(() => {
      result.current.effects.resetTableData();
    });

    // Assert
    expect(result.current.state.tableRows).toEqual([]);
    expect(result.current.effects.hasUpdates()).toEqual(false);

    unmount();
  });

  it('should return error state for duplicate compsite key', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    act(() => {
      result.current.effects.addNewRow();
    });

    act(() => {
      result.current.effects.updateTableRow(0, 'CPU', 'string', 'Intel', false);
      result.current.effects.updateTableRow(0, 'Gen', 'string', 'Gen9', false);
      result.current.effects.updateTableRow(
        0,
        'SKU',
        'string',
        '28.8KW',
        false,
      );
      result.current.effects.updateTableRow(1, 'CPU', 'string', 'Intel', false);
      result.current.effects.updateTableRow(1, 'Gen', 'string', 'Gen9', false);
      result.current.effects.updateTableRow(
        1,
        'SKU',
        'string',
        '28.8KW',
        false,
      );
    });

    // Assert
    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    expect(result.current.state.error).toEqual(
      'The fields with an asterisk must be a unique combination for each row.',
    );

    unmount();
  });

  it('should return error state', async () => {
    // Arrange
    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    act(() => {
      result.current.effects.updateTableRow(
        0,
        'testColumn',
        'string',
        'testValue',
        true,
      );
    });

    // Assert
    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    expect(result.current.state.error).toEqual(
      'Please fill all the fields before saving.',
    );

    unmount();
  });

  it('should return error state when ingest data fails', async () => {
    // Arrange
    (ingestData as jest.Mock).mockRejectedValueOnce(
      new Error('Error saving data'),
    );

    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    await waitFor(() => {
      result.current.effects.saveUpdatedRows();
    });

    // Assert
    expect(result.current.state.error).toContain('Error saving data.');

    unmount();
  });

  it('should return error state when execute query fails', async () => {
    // Arrange
    (executeQuery as jest.Mock).mockRejectedValueOnce(
      new Error('Error fetching data'),
    );

    const { result, unmount } = renderHook(() =>
      useTableState(tableName, tableFunction, columnsMetadata),
    );

    // Act
    act(() => {
      result.current.effects.addNewRow();
    });

    // Assert
    await waitFor(() => {
      expect(result.current.state.error).toContain('Error fetching data.');
    });

    unmount();
  });
});
