import './styles.scss';
import { ITabPanelOption, TabPanelOptions } from './../components';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';

/**
 * Plan of Record page.
 * @returns A JSX element
 */
export default function Example1(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);

  /**
   * Handles tab selection.
   * @param _ synthetic react event.
   * @param value The selected tab value.
   */
  function handleTabSelect(_: any, value: number): void {
    const tab: any = TabPanelOptions.find(
      (tab: ITabPanelOption) => tab.value === value,
    );
    setSelectedTab(tab?.value);
  }

  return (
    <div className="example-page">
      <Box
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          height: '100%',
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabSelect}
          aria-label="Vertical tabs"
          sx={{ borderColor: 'divider', borderRight: 1 }}
          className="tabs-container"
        >
          {TabPanelOptions.map((tab: ITabPanelOption) =>
            !tab.isVisible() ? null : (
              <Tab key={tab.value} label={tab.getLabel()} value={tab.value} />
            ),
          )}
        </Tabs>
        {TabPanelOptions.map((tab: ITabPanelOption) =>
          !tab.isVisible()
            ? null
            : tab.renderPanel({
                label: tab.getLabel(),
                selectedTab: selectedTab,
              }),
        )}
      </Box>
    </div>
  );
}
