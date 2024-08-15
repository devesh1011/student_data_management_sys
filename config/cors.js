const corsOptions = {
  origin: [
    "http://example.com", // Allow specific origins
    "http://another-example.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  exposedHeaders: ["Content-Length", "X-Total-Count"], // Expose specific headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Status for successful OPTIONS requests
  preflightContinue: false, // Pass the CORS preflight response to the next handler
  maxAge: 86400, // Cache preflight requests for 1 day (in seconds)
};

module.exports = corsOptions;
