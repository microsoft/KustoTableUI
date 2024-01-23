import './styles.scss';
import { TabPanel } from 'components';
import TableRenderer from '../TableRenderer';
import tableConfig from './../../config.json';

export interface ITabPanelOption {
  getLabel: (metadata?: any) => string;
  isVisible: (metadata?: any) => boolean;
  renderPanel: (props: ITabPanelRenderProps) => JSX.Element | null;
  value: number;
}

interface ITabPanelRenderProps {
  label: string;
  selectedTab: number;
}

/**
 * TabPanelOptions
 * @description The options for the tab panels.
 * @returns An array of ITabPanelOption.
 */
export const TabPanelOptions: ITabPanelOption[] = tableConfig.Tabs.map(
  (tab: any, index: number) => ({
    getLabel: () => tab.TabTitle,
    isVisible: () => true,
    renderPanel: (props: ITabPanelRenderProps) => {
      const { selectedTab } = props;
      return (
        <TabPanel
          className="tab-panel-main"
          isHidden={selectedTab !== index}
          isLoading={false}
          tabValue={tab.TabTitle}
          key={tab.TabTitle}
        >
          <TableRenderer
            tableName={tab.TableName}
            tableFunction={tab.TableFunction}
            tableTitle={tab.TabTitle}
            columnMetadata={tab.ColumnsMetadata}
            defaultSort={tab.DefaultSort}
          />
        </TabPanel>
      );
    },
    value: index,
  }),
);
