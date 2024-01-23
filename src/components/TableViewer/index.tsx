import './styles.scss';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { EditableTableCell } from './EditableCell';

export type Order = 'asc' | 'desc';

interface ITableViewerProps {
  columns: IColumns[];
  dataSource: any[];
  isEditableTable: boolean;
  onChangeCallback: (
    rowKey: number,
    columnKey: string,
    columnType: string,
    value: any,
    isInvalid: boolean,
  ) => void;
  onDeleteCallback: (rowKey: number) => void;
  onSortCallback: (property: string) => void;
  orderBy: string;
  order: Order;
}

/**
 * A generic table that takes in columns and a data source. The data source's
 * properties should be able to map back to the column key value.
 * @param columns The column information.
 * @param dataSource A generic object that should map to the columns. Each
 * property represents a table cell.
 * @returns A JSX element.
 */
export function TableViewer({
  columns,
  dataSource,
  isEditableTable,
  onChangeCallback,
  onDeleteCallback,
  onSortCallback,
  order,
  orderBy,
}: ITableViewerProps): JSX.Element {
  const sortHandler = (property: string) => () => {
    onSortCallback(property);
  };

  return (
    <TableContainer className="tableviewer-container" component={Paper}>
      <Table size="small">
        <TableHead className="tableviewer-header">
          <TableRow className="tableviewer-row-header" key="table-header">
            {columns.map((column: IColumns) => (
              <TableCell className="tableview-column-header" key={column.key}>
                <TableSortLabel
                  active={orderBy === column.key}
                  direction={orderBy === column.key ? order : 'asc'}
                  onClick={sortHandler(column.key)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            {isEditableTable ? (
              <TableCell
                className="tableview-column-header tableviewer-action-cell"
                key="clear"
              />
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSource?.map((row: any, index) => (
            <TableRow key={`table-row-${index}`}>
              {columns.map((column: IColumns, cIndex) => {
                return (
                  <EditableTableCell
                    key={`table-row-${index}-cell-${cIndex}`}
                    rowKey={index}
                    cellValue={!(column.key in row) ? '' : row[`${column.key}`]}
                    isEditMode={isEditableTable}
                    column={column}
                    onChangeCallback={onChangeCallback}
                  />
                );
              })}
              {isEditableTable ? (
                <TableCell key="clear" className="tableviewer-action-cell">
                  <IconButton
                    size="small"
                    sx={{
                      '&:hover': { color: 'red' },
                    }}
                    onClick={() => {
                      onDeleteCallback(index);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              ) : (
                <></>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
