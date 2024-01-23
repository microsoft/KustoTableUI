import { executeQuery, ingestData } from 'services/KustoClient';
import { useEffect, useRef, useState } from 'react';
import { Order } from 'components/TableViewer';
import { useOutsideClick } from './useOutsideClick';
import { useStateStore } from 'state';

const ColumnType: IDictionary<string> = {
  datetime: 'date',
  real: 'number',
  string: 'text',
};

export enum RowState {
  DELETED = 'DELETED',
  INITIALIZED = 'INITIALIZED',
  INVALID = 'INVALID',
  NEW = 'NEW',
  UPDATED = 'UPDATED',
}

/**
 * The descendent comparator function to sort the table array.
 * @param rowA The first object to compare.
 * @param rowB The second object to compare.
 * @param orderBy The property to sort by.
 * @returns A number representing the sort order.
 */
function descendingComparator<T extends Record<keyof T, string | number>>(
  rowA: T,
  rowB: T,
  orderBy: keyof T,
) {
  if (typeof rowA[orderBy] === 'number' && typeof rowB[orderBy] === 'number') {
    if (rowB[orderBy] < rowA[orderBy]) {
      return -1;
    }
    if (rowB[orderBy] > rowA[orderBy]) {
      return 1;
    }
    return 0;
  } else if (
    typeof rowA[orderBy] === 'string' &&
    typeof rowB[orderBy] === 'string'
  ) {
    return rowB[orderBy]
      .toString()
      .localeCompare(rowA[orderBy].toString(), undefined, {
        numeric: true,
      });
  } else {
    return 0;
  }
}
/**
 * Get comparator function to sort the table array.
 * @param order The order to sort by.
 * @param orderBy The property to sort by.
 * @returns
 */
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  rowA: { [key in Key]: number | string },
  rowB: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (rowA, rowB) => descendingComparator(rowA, rowB, orderBy)
    : (rowA, rowB) => -descendingComparator(rowA, rowB, orderBy);
}

export function useTableState(
  tableName: string,
  tableFunction: string,
  columnMetadata?: any,
  defaultSort?: any,
) {
  const {
    state: { user },
  } = useStateStore();
  const [tableRows, setTableRows] = useState<any>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditable, setIsEditable] = useState(false);
  const [order, setOrder] = useState<Order>(defaultSort.Direction ?? 'asc');
  const [orderBy, setOrderBy] = useState<string>(defaultSort.ColumnKey);
  const RequiredColumns: string[] = columnMetadata
    .filter((column: any) => column.PrimaryKey)
    .map((column: any) => column.Key);

  // Store initial table data in state for reset.
  const [initialTableData, setInitialTableData] = useState<any>([]);
  const referrence = useRef<HTMLDivElement>(null);

  useOutsideClick(referrence, (event: any) => {
    if (hasUpdates()) {
      event.stopImmediatePropagation();
      alert('You have unsaved changes. Please save or cancel before leaving.');
    }
  });

  /**
   * Sort the table data based on the column key.
   * @param property The column key to sort.
   */
  function handleSort(property: string): void {
    const isAsc = orderBy === property && order === 'asc';
    const tableOrder = isAsc ? 'desc' : 'asc';
    setOrder(tableOrder);
    setOrderBy(property);
    tableRows.sort(getComparator(tableOrder, property));
    setTableRows(tableRows);
  }

  /**
   * Add a new row to the table.
   */
  function addNewRow(): void {
    const newRow = { currentState: RowState.NEW };
    const updatedTableRows = [...tableRows, newRow];
    setTableRows(updatedTableRows);
  }

  // Delete the row from the table. If the row is new, remove it from the table. If the row is existing, mark it as deleted.
  function deleteRow(rowKey: number): void {
    const updatedTableRows = [];
    for (let index = 0; index < tableRows.length; index++) {
      const row = tableRows[index];
      if (index === rowKey && row.currentState !== RowState.NEW) {
        row.currentState = RowState.DELETED;
      } else if (index === rowKey && row.currentState === RowState.NEW) {
        continue;
      }
      updatedTableRows.push(row);
    }
    if (!hasInvalidRows(updatedTableRows)) {
      setError('');
    }
    setTableRows(updatedTableRows);
  }

  // Enable or disable the edit mode.
  function enableEdit(isEditable: boolean) {
    setIsEditable(isEditable);
  }

  /**
   * Fetch the table data from the kusto table.
   * @returns A promise.
   * @example
   * await fetchTableData();
   * @throws An error if the query fails.
   */
  async function fetchTableData(): Promise<void> {
    setIsLoading(true);

    try {
      const dataResponse = await executeQuery(tableFunction);

      // Process the columns of the table and create an array of objects with IColumns type.
      const columns: IColumns[] = dataResponse.columns.map(column =>
        processColumnData(column),
      );
      setColumns(columns);
      // Add current state property to each row.
      const tableData = dataResponse.data.map((row: any) => {
        row.currentState = RowState.INITIALIZED;
        return row;
      });

      tableData.sort(getComparator(order, orderBy));
      setTableRows(tableData);
      setInitialTableData(JSON.parse(JSON.stringify(tableData)));
    } catch (error: any) {
      setError(`${error.message}.`);
    } finally {
      setIsLoading(false);
    }
  }

  // Process all the updated rows and create a new array of objects with only the updated rows to ingested into kusto table.
  function getUpdatedRows(): any[] {
    const updatedRows = tableRows.filter(
      (row: any) => row.currentState !== RowState.INITIALIZED,
    );
    return updatedRows;
  }

  // Check if any row where composite key of required fields value is duplicate. If yes, return true.
  function hasDuplicateCompositeKey(): boolean {
    const compositeKeySet = new Set();
    const requiredColumns = columns.filter((column: any) => column.required);

    for (const currentRow of tableRows) {
      const compositeKey = requiredColumns
        .map((column: any) => currentRow[column.key].toString().toLowerCase())
        .join('_');

      // Check if key already exists in the set. If yes, return true.
      if (compositeKeySet.has(compositeKey)) {
        return true;
      }
      // Add the key to the set.
      compositeKeySet.add(compositeKey);
    }
    return false;
  }

  // Check if any row has invalid rows for given table array. If yes, return true.
  function hasInvalidRows(rows: any[]): boolean {
    const invalidRows = rows.filter((row: any) => {
      return row.currentState === RowState.INVALID || isInvalidRow(row);
    });
    return invalidRows.length > 0;
  }

  // Check if any one rows have been updated. If yes, return true.
  function hasUpdates(): boolean {
    return getUpdatedRows().length > 0;
  }

  /**
   * Process the column data and create an object with IColumns type.
   * @param columnData The column data to process.
   * @returns An object with IColumns type.
   */
  function processColumnData(columnData: any): IColumns {
    const columnType = columnData?.type || 'string';
    const columnMeta: IColumns = {
      key: columnData.name || '',
      label: columnData.name || '',
      type: ColumnType[columnType],
    };

    if (RequiredColumns.includes(columnData.name)) {
      columnMeta.required = true;
      columnMeta.label = `${columnMeta.label}*`;
    }

    if (columnType === 'datetime') {
      columnMeta.formatValue = (value: string) => {
        return value.split('T')[0];
      };
    }

    if (columnType === 'real') {
      columnMeta.title = 'Please enter a positive number';
      columnMeta.min = 0;
    }
    return columnMeta;
  }

  // Check if any row is invalid by checking against column validator. If yes, return true.
  function isInvalidRow(row: any): boolean {
    for (const column of columns) {
      if (!column?.isEmptyAllowed) {
        const value = row[column.key];
        if (!value || value === '') {
          return true;
        }
      }
    }
    return false;
  }

  // Reset the table data to the initial state.
  function resetTableData(): void {
    initialTableData.sort(getComparator(order, orderBy));
    setTableRows(JSON.parse(JSON.stringify(initialTableData)));
    setError('');
  }

  /**
   * Save the updated rows to the kusto table.
   * @returns A promise.
   * @example
   * await saveUpdatedRows();
   * @throws An error if the ingest fails.
   */
  async function saveUpdatedRows(): Promise<void> {
    const updatedRows = getUpdatedRows();
    if (updatedRows.length === 0) {
      return;
    }

    if (hasInvalidRows(updatedRows)) {
      setError('Please fill all the fields before saving.');
      return;
    }

    if (hasDuplicateCompositeKey()) {
      setError(
        'The fields with an asterisk must be a unique combination for each row.',
      );
      return;
    }

    // Process updatedRows to create a new array without isUpdated property.
    const updatedRowsWithoutIsUpdated = updatedRows.map((row: any) => {
      const { currentState, ...tableData } = row;
      const currentDateTime = new Date().toISOString();
      const active = currentState === RowState.DELETED ? false : true;

      const updatedRow = {
        Active: active,
        Timestamp: currentDateTime,
        UserName: user.userName,
        ...tableData,
      };

      return updatedRow;
    });

    try {
      setIsLoading(true);
      await ingestData(tableName, updatedRowsWithoutIsUpdated);
      const resetRowsCurrentState = tableRows
        .filter((row: any) => row.currentState !== RowState.DELETED)
        .map((row: any) => {
          row.currentState = RowState.INITIALIZED;
          return row;
        })
        .sort(getComparator(order, orderBy));
      setInitialTableData(JSON.parse(JSON.stringify(resetRowsCurrentState)));
      setTableRows(JSON.parse(JSON.stringify(resetRowsCurrentState)));
      setIsEditable(false);
    } catch (error: any) {
      setIsEditable(true);
      setError(`${error.message}.`);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Update the table row with the new value.
   * @param rowKey The row key to update.
   * @param columnKey The column key to update.
   * @param columnType The column type to update.
   * @param value The new value to update.
   */
  function updateTableRow(
    rowKey: number,
    columnKey: string,
    columnType: string,
    value: any,
    isInvalid: boolean,
  ): void {
    const updatedTableRows = tableRows.map((row: any, index: number) => {
      if (index === rowKey) {
        row[columnKey] = columnType !== 'real' ? value : Number(value);
        row.currentState = isInvalid ? RowState.INVALID : RowState.UPDATED;
      }
      return row;
    });
    if (!hasInvalidRows(updatedTableRows)) {
      setError('');
    }
    setTableRows(JSON.parse(JSON.stringify(updatedTableRows)));
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  return {
    effects: {
      addNewRow,
      deleteRow,
      enableEdit,
      handleSort,
      hasUpdates,
      resetTableData,
      saveUpdatedRows,
      updateTableRow,
    },
    state: {
      columns,
      error,
      isEditable,
      isLoading,
      order,
      orderBy,
      referrence,
      tableRows,
    },
  };
}
