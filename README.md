# KUSTOTABLEUI

A component to render an editable table UI dynamically based on the schema and contents of a Kusto table.

## Getting started

There are no changes needed to run locally though you do need to have an app id that has access to the kusto cluster and database. Update the environment file with all required variables(clusterName, databaseName, clientId, tenantId). Note: Onload login window pops up to enter login credentials to connect to kusto cluster.

Update config.json under src/pages to include tableFunction, tableName, column metadata, sorting order.

Here is an example of the page rendering table component based on the data returned from kusto function

![Alt text](./example_screenshot.png)

## Available Scripts

In the project directory, you can run:

npm start: Runs the project locally.
npm test: Runs all test in the project.
npm run build: Builds the project.

As the maintainer of this project, please make a few updates:

- Improving this README.MD file to provide a great experience
- Updating SUPPORT.MD with content about this project's support experience
- Understanding the security reporting process in SECURITY.MD
- Remove this section from the README

## Contributing

Issues, additional features, and tests are all welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
