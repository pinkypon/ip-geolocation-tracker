# IP Geolocation Tracker

A full-stack web application for tracking IP geolocation information, built with Laravel and React as part of JLabs technical assessment.

## Features

### Required Features ✅

- User authentication (Register/Login/Logout)
- Auto-fetch user's IP geolocation on home screen
- Custom IP address search with validation
- Display comprehensive geolocation information
- Error handling for invalid IP addresses
- Clear search button (reverts to user's IP)
- Search history list with timestamps

### Optional Features (Bonus Points) ✅

- Clickable history items to reload IP information
- Checkbox selection with bulk delete functionality
- **Interactive map display with location pinning (Big Plus)**

## Tech Stack

### Backend

- Laravel 11
- Laravel Sanctum (Authentication)
- SQLite Database

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router

### External API

- IPInfo.io (Geolocation data)

## Installation

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- Git

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install PHP dependencies:

```bash
composer install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Create SQLite database:

```bash
touch database/database.sqlite
```

6. Run migrations:

```bash
php artisan migrate
```

7. (Optional) Seed test user:

```bash
php artisan db:seed --class=UserSeeder
```

8. Start the development server:

**Option A: Using php artisan serve**

```bash
php artisan serve --port=5173
```

The API will be available at `http://localhost:5173`

**Option B: Using Laravel Herd/Valet (if installed)**

- Herd/Valet serves automatically at `http://foldername.test`
- No need to run `php artisan serve`
- Update `.env` with your Herd domain:

```env
  APP_URL=http://yourproject.test
  FRONTEND_URL=http://yourproject.test:5174
  SANCTUM_STATEFUL_DOMAINS=yourproject.test:5174
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Usage

### Test Credentials (If using seeder)

- **Email:** test@example.com
- **Password:** password123

Or register a new account via the registration page.

### Testing IP Search

Try these IP addresses:

- `8.8.8.8` - Google DNS (Mountain View, California, US)
- `1.1.1.1` - Cloudflare DNS (Australia)
- `142.250.185.46` - Google (USA)

Invalid IPs will show appropriate error messages:

- `999.999.999.999` - Out of range
- `192.168.1.1` - Private IP (no geolocation)
- `hello world` - Invalid format

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires authentication)
- `GET /api/user` - Get authenticated user

### CSRF Protection

- `GET /sanctum/csrf-cookie` - Get CSRF token

## Features Demonstration

### Authentication Flow

1. Users must register or login to access the application
2. Protected routes redirect unauthenticated users to login
3. Sanctum handles session-based authentication with CSRF protection

### IP Geolocation

- Automatically detects and displays user's IP on page load
- Search for any public IP address
- Validates IP format (IPv4)
- Displays: IP, City, Region, Country, Coordinates, ISP, Timezone, Postal Code

### Search History

- Tracks all IP searches with timestamps
- Click any history item to reload that IP's information
- Select multiple items with checkboxes
- Bulk delete selected history items
- History stored in-memory (resets on page refresh)

### Map Integration

- Embedded OpenStreetMap showing pinned location
- Links to open location in Google Maps or OpenStreetMap
- Visual representation of IP coordinates

## Notes

- IP geolocation provides **city-level accuracy**, not exact GPS coordinates
- Geolocation is based on ISP routing information
- Private IP addresses (192.168.x.x, 10.x.x.x) won't return geolocation data
- Search history is stored in-memory and will reset on page refresh

## Troubleshooting

### CORS Issues

Ensure `backend/config/cors.php` has:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5174'],
'supports_credentials' => true,
```

### Sanctum Authentication Issues

Check `backend/.env` file:

```env
SESSION_DRIVER=file
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5174
```

### Database Not Found

Make sure SQLite file exists:

```bash
touch backend/database/database.sqlite
```

## Development Notes

- **Database:** Using SQLite for easy setup and portability
- **Authentication:** Laravel Sanctum with cookie-based sessions
- **CSRF Protection:** Enabled for all state-changing requests

## Author

Mark Jem Dee F. Garcia

## Submission

Created for JLabs Team technical assessment - November 2025

## License

This project is created for technical assessment purposes.
