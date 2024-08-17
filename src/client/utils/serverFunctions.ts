import { GASClient } from 'gas-client';
import * as publicServerFunctions from '../../server'; // Adjust the path to your public server functions

const { serverFunctions } = new GASClient<typeof publicServerFunctions>({
  allowedDevelopmentDomains: (origin) =>
    /https:\/\/.*\.googleusercontent\.com$/.test(origin),
});

export { serverFunctions };
