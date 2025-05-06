// api/debug.js - A simple endpoint to test connectivity and check logs

module.exports = async (req, res) => {
    try {
      // Get time in Indonesia timezone
      const options = { 
        timeZone: 'Asia/Jakarta',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
      };
      const jakartaTime = new Date().toLocaleString('id-ID', options);
      
      // Log info that can be checked in Vercel logs
      console.log(`Debug endpoint accessed at ${jakartaTime}`);
      
      // Return a simple JSON response
      res.status(200).json({
        status: 'online',
        message: 'Bot API is functioning correctly',
        serverTime: jakartaTime,
        environment: process.env.NODE_ENV || 'development',
        // Add values of environment variables (except for sensitive ones)
        env: {
          vercelEnv: process.env.VERCEL_ENV || 'Not set',
          region: process.env.VERCEL_REGION || 'Not set'
        }
      });
    } catch (error) {
      console.error('Error in debug endpoint:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  };