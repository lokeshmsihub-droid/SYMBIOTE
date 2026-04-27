const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEBUG_MODE = import.meta.env.MODE === 'development';

let requestCounter = 0;

/**
 * Production-hardened fetch wrapper with:
 * - Unique Request Lifecycle Tracking (req_id)
 * - Structured Observability (Request/Response/Error logs)
 * - Safe Retry Logic (Idempotent GETs only)
 * - Timeout Controls (AbortController)
 */
const apiClient = async (endpoint, options = {}, retryCount = 0) => {
  const reqId = `req_${++requestCounter}_${Math.random().toString(36).substr(2, 5)}`;
  const startTime = performance.now();
  const token = localStorage.getItem('token');
  const method = options.method || 'GET';
  
  // 1. Setup Timeout (8s default)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    signal: controller.signal
  };

  if (DEBUG_MODE) {
    console.group(`%c[API REQUEST] ${reqId}`, 'color: #8b5cf6; font-weight: bold;');
    console.log(`%cURL:`, 'color: #6b7280;', `${API_BASE_URL}${endpoint}`);
    console.log(`%cMethod:`, 'color: #6b7280;', method);
    console.log(`%cTimestamp:`, 'color: #6b7280;', new Date().toISOString());
    if (options.body) console.log(`%cBody:`, 'color: #6b7280;', JSON.parse(options.body));
    console.groupEnd();
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);

    const duration = (performance.now() - startTime).toFixed(2);

    if (response.status === 401) {
      if (DEBUG_MODE) console.error(`%c[API ERROR] ${reqId} - Unauthorized`, 'color: #ef4444; font-weight: bold;');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized session. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Server responded with ${response.status}`;
      
      if (DEBUG_MODE) {
        console.group(`%c[API ERROR] ${reqId}`, 'color: #ef4444; font-weight: bold;');
        console.error(`Status: ${response.status}`);
        console.error(`Message: ${errorMessage}`);
        console.groupEnd();
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // 2. Response Validation (Harden against malformed/empty responses)
    if (data === undefined || data === null) {
      throw new Error('Malformed or empty API response');
    }

    if (DEBUG_MODE) {
      console.group(`%c[API RESPONSE] ${reqId}`, 'color: #10b981; font-weight: bold;');
      console.log(`%cStatus:`, 'color: #6b7280;', response.status);
      console.log(`%cDuration:`, 'color: #6b7280;', `${duration}ms`);
      console.log(`%cData:`, 'color: #6b7280;', data);
      console.groupEnd();
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 3. Safe Retry Logic (Only for network errors on idempotent GET requests)
    if (method === 'GET' && retryCount < 1 && (error.name === 'TypeError' || error.name === 'AbortError')) {
      if (DEBUG_MODE) console.warn(`%c[API RETRY] ${reqId} - Attempting retry...`, 'color: #f59e0b;');
      return apiClient(endpoint, options, retryCount + 1);
    }

    if (DEBUG_MODE) {
      console.group(`%c[API FAILURE] ${reqId}`, 'color: #ef4444; font-weight: bold;');
      console.error(`Error: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
      console.groupEnd();
    }
    throw error;
  }
};

// Add axios-style compatibility methods
// PHASE 3: Legacy Disposal - Methods now exclusively use the standardized shape
const wrapResponse = (data, error = null) => ({
  success: !error,
  data: error ? null : data,
  error: error ? {
    message: error.message || 'System Error',
    code: error.name || 'API_FATAL'
  } : null
});

apiClient.get = (url, options) => 
  apiClient(url, { ...options, method: 'GET' })
    .then(data => wrapResponse(data))
    .catch(err => wrapResponse(null, err));

apiClient.post = (url, data, options) => 
  apiClient(url, { ...options, method: 'POST', body: JSON.stringify(data) })
    .then(data => wrapResponse(data))
    .catch(err => wrapResponse(null, err));

apiClient.put = (url, data, options) => 
  apiClient(url, { ...options, method: 'PUT', body: JSON.stringify(data) })
    .then(data => wrapResponse(data))
    .catch(err => wrapResponse(null, err));

apiClient.delete = (url, options) => 
  apiClient(url, { ...options, method: 'DELETE' })
    .then(data => wrapResponse(data))
    .catch(err => wrapResponse(null, err));

export default apiClient;
