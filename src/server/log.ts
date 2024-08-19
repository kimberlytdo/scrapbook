// This function logs messages to both the GAS logger and the console
function logToCloud(message) {
    Logger.log(message);
    console.log(message);
  }
  
  // A simple test function to verify logging works
  function testLogging() {
    Logger.log('Test log function called');
  }
  
  // Export functions to be accessible in other server files
  export { logToCloud, testLogging };
  