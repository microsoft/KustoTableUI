import TableRenderer from './../components/TableRenderer';
import tableConfigs from './../config.json';

export default function Example2(): JSX.Element {
  const tableConfig = tableConfigs.Tabs[0];
  return (
    <div>
      <TableRenderer
        tableName={tableConfig.TableName}
        tableFunction={tableConfig.TableFunction}
        tableTitle={tableConfig.TabTitle}
        columnMetadata={tableConfig.ColumnsMetadata}
        defaultSort={tableConfig.DefaultSort}
      />
    </div>
  );
}
