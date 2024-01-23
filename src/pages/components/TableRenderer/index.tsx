import './styles.scss';
import { Banner, TableViewer } from 'components';
import { Button, IconButton } from '@mui/material';
import { Cancel, Edit, PlaylistAdd, Save } from '@mui/icons-material';
import { RowState, useTableState } from '../hooks/useTableState';
import { PageLoader } from 'components/PageLoader';

interface ITableRenderer {
  tableFunction: string;
  tableName: string;
  tableTitle: string;
  columnMetadata?: any;
  defaultSort?: any;
}

/**
 * TableRenderer
 * @description Renders a table based on the table name.
 * @param tableName The name of the table to render.
 * @returns A JSX.Element.
 * @example
 */
export default function TableRenderer({
  tableFunction,
  tableName,
  tableTitle,
  columnMetadata,
  defaultSort,
}: ITableRenderer): JSX.Element {
  const {
    state: {
      columns,
      error,
      isLoading,
      referrence,
      order,
      orderBy,
      tableRows,
      isEditable,
    },
    effects: {
      addNewRow,
      deleteRow,
      enableEdit,
      updateTableRow,
      handleSort,
      hasUpdates,
      resetTableData,
      saveUpdatedRows,
    },
  } = useTableState(tableName, tableFunction, columnMetadata, defaultSort);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="table-container" ref={referrence}>
      {error || error != '' ? (
        <Banner
          message={<span>{error}</span>}
          isVisible={true}
          severity="warning"
          variant="standard"
        />
      ) : null}
      {
        <>
          <div className="table-title-container">
            <h2>{tableTitle}</h2>
            <div>
              {!isEditable ? (
                <Button
                  className="tablerenderer-button"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    enableEdit(true);
                  }}
                  color="primary"
                  startIcon={<Edit />}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <IconButton
                    className="tablerenderer-icon-button"
                    onClick={addNewRow}
                  >
                    <PlaylistAdd fontSize="large" />
                  </IconButton>
                  <Button
                    className="tablerenderer-button"
                    variant="contained"
                    size="small"
                    disabled={!hasUpdates()}
                    onClick={async () => {
                      try {
                        await saveUpdatedRows();
                      } catch (error: any) {
                        enableEdit(true);
                      }
                    }}
                    color="primary"
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                  <Button
                    className="tablerenderer-button"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      resetTableData();
                      enableEdit(false);
                    }}
                    startIcon={<Cancel />}
                    color="inherit"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          <TableViewer
            columns={columns}
            dataSource={tableRows.filter(
              (row: any) => row.currentState !== RowState.DELETED,
            )}
            isEditableTable={isEditable}
            onChangeCallback={updateTableRow}
            onDeleteCallback={deleteRow}
            onSortCallback={handleSort}
            order={order}
            orderBy={orderBy}
          />
        </>
      }
    </div>
  );
}
