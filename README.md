# OnlyFoods

A beautiful food ordering and membership platform for a student-run food cooperative at Ohio State University.

## Features

- **Homepage**: Clean, modern design with mission statement and features
- **Join Us Page**: Membership application form with purpose information
- **Order Page**: Order form with Venmo payment link and pickup instructions
- **Email Automation**: Automatic email confirmations for orders and membership applications
- **Free Hosting**: Deployed on GitHub Pages (frontend) and Supabase (backend)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure email settings:
   - Create a `.env` file in the root directory
   - Add your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@onlyfoods.com
   ```

   **For Gmail users:**
   - Enable 2-factor authentication
   - Generate an "App Password" at https://myaccount.google.com/apppasswords
   - Use the app password (not your regular password) in `EMAIL_PASS`

3. Update the Venmo link in `public/order.html` with your actual Venmo profile URL

4. Update pickup location and times in `public/order.html` to match your actual details

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:3000

## Project Structure

```
OnlyFoods/
├── server.js                    # Express server (for local development)
├── package.json                 # Dependencies
├── public/                      # Frontend files (deployed to GitHub Pages)
│   ├── index.html              # Homepage
│   ├── join.html               # Join Us page
│   ├── order.html              # Order page
│   ├── styles.css              # Shared styles
│   ├── config.js               # Supabase configuration (create from config.example.js)
│   └── config.example.js       # Example config file
├── supabase/                    # Supabase configuration
│   ├── functions/              # Edge Functions (backend API)
│   │   ├── join/              # Membership application handler
│   │   └── order/             # Order submission handler
│   ├── migrations/             # Database migrations
│   └── config.toml             # Supabase local config
├── .github/workflows/          # GitHub Actions for deployment
└── DEPLOYMENT.md               # Detailed deployment guide
```

## Deployment

This project is set up for free hosting using:
- **GitHub Pages** - Frontend hosting
- **Supabase** - Backend API and database
- **Resend** - Email service

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Setup

1. **Set up Supabase:**
   - Create a Supabase project
   - Run database migrations
   - Deploy Edge Functions
   - Set environment variables (Resend API key, admin email)

2. **Set up GitHub Pages:**
   - Push code to GitHub
   - Enable GitHub Pages in repository settings
   - Set source to `/public` folder

3. **Configure Frontend:**
   - Copy `public/config.example.js` to `public/config.js`
   - Add your Supabase URL and API key

## Local Development

For local development with the Express server, follow the Setup section above.

## API Endpoints

### Production (Supabase Edge Functions)
- `POST /functions/v1/join` - Submit membership application
- `POST /functions/v1/order` - Submit order

### Local Development (Express Server)
- `POST /api/join` - Submit membership application
- `POST /api/order` - Submit order

Both endpoints store data and send automated emails.

## Customization

- Update colors in `styles.css` by modifying CSS variables in `:root`
- Modify email templates in `server.js`
- Update content in HTML files as needed
