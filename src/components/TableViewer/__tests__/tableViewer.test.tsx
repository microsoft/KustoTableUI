import { TableViewer } from '..';
import { render } from '@testing-library/react';

// mock Kusto Client.
jest.mock('services/KustoClient', () => ({
  executeQuery: jest.fn(),
  ingestData: jest.fn(),
}));

// mock useStateStore class
jest.mock('state', () => ({
  useStateStore: jest.fn(),
}));
describe('TableViewer Snapshot UI Tests', () => {
  const columnsData = [
    { key: 'prop1', label: 'Property 1' },
    { key: 'prop2', label: 'Property 2' },
  ];

  const dataSourceData = [{ prop1: 'Some Value to Display' }, { prop2: 1 }];

  const noneMappedDataSourceData = [
    { prop3: 'Some Value Not Diplayed' },
    { prop4: <div>A JSX Element Not Displayed</div> },
  ];

  test.each`
    columns        | dataSource                  | isEditableTable | scenario
    ${columnsData} | ${dataSourceData}           | ${false}        | ${'With Valid Data'}
    ${columnsData} | ${dataSourceData}           | ${true}         | ${'With Valid Data in edit mode'}
    ${columnsData} | ${dataSourceData}           | ${false}        | ${'With Valid Data'}
    ${columnsData} | ${[]}                       | ${false}        | ${'With No Data Rows'}
    ${[]}          | ${dataSourceData}           | ${false}        | ${'With No Columns'}
    ${[]}          | ${[]}                       | ${false}        | ${'With No Columns Or Rows'}
    ${columnsData} | ${noneMappedDataSourceData} | ${false}        | ${'With None Mapped Data Source'}
  `(
    'Test TableViewer Rendering $scenario',
    ({ columns, dataSource, isEditableTable }) => {
      const tableViewer = render(
        <TableViewer
          columns={columns}
          dataSource={dataSource}
          isEditableTable={isEditableTable}
          onChangeCallback={() => jest.fn()}
          onDeleteCallback={() => jest.fn()}
          onSortCallback={() => jest.fn()}
          order={'asc'}
          orderBy={'prop1'}
        />,
      );
      expect(tableViewer.asFragment()).toMatchSnapshot();
    },
  );
});
