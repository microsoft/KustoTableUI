import './styles.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { TableCell } from '@mui/material';

type Option = {
  label: string;
  value: string;
};

interface ITableCellProps {
  cellValue: any;
  rowKey: number;
  column: IColumns;
  onChangeCallback: (
    rowKey: number,
    columnKey: string,
    columnType: string,
    value: any,
    isInvalid: boolean,
  ) => void;
  isEditMode?: boolean;
}

/**
 * EditableTableCell component is used to render the table cell in edit mode or view mode based on the isEditMode prop value.
 * @param cellValue value of the cell.
 * @param rowKey key of the row.
 * @param column column metadata of the cell.
 * @param onChangeCallback callback function to be called on change of the cell value.
 * @param isEditMode flag to indicate whether the cell is in edit mode or not.
 * @returns EditableTableCell component.
 */
export const EditableTableCell = ({
  cellValue,
  rowKey,
  column,
  onChangeCallback,
  isEditMode = false,
}: ITableCellProps) => {
  const initialValue = cellValue;
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!isEditMode) {
      setIsInvalid(false);
    }
  }, [isEditMode]);

  const onBlur = () => {
    // If value is not changed, do not call the callback.
    if (value === initialValue) {
      return;
    }
    const isInvalid = !column.isEmptyAllowed && (!value || value === '');
    setIsInvalid(isInvalid);
    onChangeCallback(rowKey, column?.key || '', column.type, value, isInvalid);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChangeCallback(
      rowKey,
      column?.key || '',
      column.type,
      e.target.value,
      false,
    );
  };

  return (
    <TableCell
      key={`table-row-${rowKey}-cell-${column?.key}`}
      className={`table-cell${isEditMode ? '-edit-mode' : ''}${
        isInvalid ? '-invalid' : ''
      }`}
    >
      {isEditMode ? (
        column?.type === 'select' ? (
          <select onChange={onSelectChange} value={initialValue}>
            {column?.options?.map((option: Option, index: number) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={
              column.formatValue
                ? column.formatValue(value)
                : typeof value === 'number'
                ? value
                : value || ''
            }
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            type={column?.type || 'text'}
            title={column?.title?.toString() || ''}
            min={column?.min?.toString() || ''}
            aria-autocomplete="none"
          />
        )
      ) : (
        <span key={`table-row-${rowKey}-cell-${column?.key}-value`}>
          {column.formatValue
            ? column.formatValue(value)
            : typeof value === 'number'
            ? value
            : value || ''}
        </span>
      )}
    </TableCell>
  );
};
