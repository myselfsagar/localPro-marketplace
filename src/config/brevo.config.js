const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Create an API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Authenticate with your API key
apiInstance.apiClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

module.exports = apiInstance;
