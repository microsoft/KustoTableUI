import {
  DataFormat,
  IngestionProperties,
  StreamDescriptor,
  StreamingIngestClient,
} from 'azure-kusto-ingest';
import {
  Client as KustoClient,
  KustoConnectionStringBuilder,
} from 'azure-kusto-data';

const cluster = `https://${process.env.REACT_APP_KUSTO_CLUSTER_NAME}.kusto.windows.net`;
const database = `${process.env.REACT_APP_KUSTO_DATABASE_NAME}`;
let authenticatedKustoClient: KustoClient;
let authenticatedStreamIngestClient: StreamingIngestClient;

/*
 * This function is used to authenticate the kusto clients.
 */
async function authenticateKustoClient() {
  if (authenticatedKustoClient && authenticatedStreamIngestClient) {
    return;
  }

  const kustoConnectionStringBuilder =
    KustoConnectionStringBuilder.withUserPrompt(cluster, {
      clientId: `${process.env.REACT_APP_CLIENT_ID}`,
      redirectUri: `${process.env.REACT_APP_MSAL_REDIRECT_URI}`,
    });

  if (!authenticatedKustoClient) {
    authenticatedKustoClient = new KustoClient(kustoConnectionStringBuilder);
  }

  if (!authenticatedStreamIngestClient) {
    authenticatedStreamIngestClient = new StreamingIngestClient(
      kustoConnectionStringBuilder,
    );
  }
}

authenticateKustoClient();

/*
 * This function is used to execute the query.
 * @param query: string
 * @returns results: any
 */
export async function executeQuery(query: string) {
  if (!authenticatedKustoClient) {
    await authenticateKustoClient();
  }
  const results = await authenticatedKustoClient.execute(database, query);
  return {
    columns: results.primaryResults[0].columns,
    data: JSON.parse(results.primaryResults[0].toLocaleString()).data,
  };
}

/*
 * This function is used to ingest data into the table.
 * @param tableName: string
 * @param updatedTableRows: any[]
 * @returns void
 * */
export async function ingestData(tableName: string, updatedTableRows: any[]) {
  if (!authenticatedStreamIngestClient) {
    await authenticateKustoClient();
  }
  const stream = await new Blob([JSON.stringify(updatedTableRows)], {
    type: 'application/json',
  }).arrayBuffer();
  const ingestionProperties = new IngestionProperties({
    database,
    format: DataFormat.MULTIJSON,
    table: tableName,
  });
  const streamDescriptor = new StreamDescriptor(stream);
  await authenticatedStreamIngestClient.ingestFromStream(
    streamDescriptor,
    ingestionProperties,
  );
}
