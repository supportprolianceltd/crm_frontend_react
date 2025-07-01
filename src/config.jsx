const config = {

API_BASE_URL: 'http://127.0.0.1:9090',
// API_BASE_URL: 'https://2fbe-102-90-98-83.ngrok-free.app',
// API_BASE_URL: 'https://ef6c-102-90-116-15.ngrok-free.app/',
API_BASE_URL: 'https://cmvp-api-v1.onrender.com',
// WEB_PAGE__URL: 'http://localhost:5173',
// WEB_PAGE__URL: 'https://370a-102-90-98-83.ngrok-free.app',

WEB_PAGE__URL : 'https://crm-frontend-react.vercel.app',

GOOGLE_CLIENT_ID: 'your-google-client-id', // Replace with your Google OAuth Client ID
};

export default config;

// ENDPOINTS
// GET All Tenants: http://127.0.0.1:9090/api/tenant/tenants/
// PATCH  A Tenants with id 2 : http://127.0.0.1:9090/api/tenant/tenants/2/
// POST  Create an Admin user for a Tenant : http://127.0.0.1:9090/api/user/admin/create/

// {
//     "username": "SupportAdmin",
//     "email": "admin@prolianceltd.com", 
//     "password": "qwerty"
// }
