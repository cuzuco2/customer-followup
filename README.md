# EDS Customer Follow-up Tracker

A web application for tracking customer information, updates, and contract status with Google Sheets integration.

## Features

- **Multi-Page Interface**: Four dedicated pages for different functions:
  1. **Add Customer**: Dedicated form for adding new customers
  2. **Update Customer**: Search and update existing customer information
  3. **Search Customer**: Find and view customer details with date-ordered updates
  4. **Navigation**: Easy switching between different functions

- **Customer Management**: Track customer information including:
  - Customer Name (string)
  - IMS Org (string)
  - Updates (with timestamps, sortable by date)
  - Contract Signed (boolean)
  - AEM Type (EDS, AMS, or AEMACS)
  - Auto-optimization Enabled (boolean)
  - Issues (string)

- **Weekly Updates**: Add new updates with automatic date timestamps
- **Boolean State Management**: Toggle contract signed and auto-optimization status
- **Date-ordered Display**: View customer information ordered by update dates (newest first)
- **Modern UI**: Clean, responsive interface with real-time updates

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Sheets Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create credentials (Service Account)
5. Download the JSON credentials file and save it as `credentials.json` in the project root
6. Create a Google Sheet with the following columns:
   - A: Customer Name
   - B: IMS Org
   - C: Updates
   - D: Contract Signed
   - E: AEM Type
   - F: Auto-optimization Enabled
   - G: Issues

### 3. Environment Configuration

1. Copy `env.example` to `.env`
2. Update the following variables:
   ```
   GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials.json
   GOOGLE_SHEET_ID=your_google_sheet_id_here
   GOOGLE_SHEET_RANGE=A:Z
   PORT=3000
   NODE_ENV=development
   ```

### 4. Google Sheet Permissions

1. Open your Google Sheet
2. Click "Share" and add the service account email (from your credentials.json)
3. Give it "Editor" permissions

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Page Navigation

The application has three main pages accessible via the top navigation:

1. **Add Customer**: Create new customer records
2. **Update Customer**: Modify existing customer information
3. **Search Customer**: Find and view customer details

### Adding Customers

1. Navigate to the "Add Customer" page
2. Fill out the customer form with required information
3. Select the AEM type (EDS, AMS, or AEMACS)
4. Check the appropriate boolean fields
5. Click "Add Customer"

### Updating Customers

1. Navigate to the "Update Customer" page
2. Search for the customer by name
3. Once found, the form will populate with current data
4. Modify any fields as needed
5. Add new updates in the "Add New Update" field
6. Click "Update Customer"

### Searching Customers

1. Navigate to the "Search Customer" page
2. Enter the customer name in the search field
3. Click "Search" to view customer details
4. Updates are displayed in descending date order (newest first)

### Managing Updates

- Updates are automatically timestamped when added
- All updates are displayed in chronological order (newest first)
- Updates can be added through both the Update Customer and Search Customer pages

## API Endpoints

- `GET /api/customers` - Get all customers
- `GET /api/customers/:customerName` - Get specific customer
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:customerName` - Update customer

## Data Structure

### Customer Object
```javascript
{
  id: number,
  customerName: string,
  imsorg: string,
  updates: string, // Formatted with dates
  contractSigned: boolean,
  aemType: string, // 'EDS', 'AMS', or 'AEMACS'
  autoOptimizationEnabled: boolean,
  issues: string
}
```

## Google Sheets Format

The application expects the following column structure:
- Column A: Customer Name
- Column B: IMS Org
- Column C: Updates (formatted with dates)
- Column D: Contract Signed (TRUE/FALSE)
- Column E: AEM Type
- Column F: Auto-optimization Enabled (TRUE/FALSE)
- Column G: Issues

## Troubleshooting

### Common Issues

1. **Google Sheets API Error**: Ensure credentials are properly set up and the service account has access to the sheet
2. **Sheet ID Not Found**: Verify the GOOGLE_SHEET_ID in your .env file
3. **Permission Denied**: Make sure the service account email has editor access to the Google Sheet

### Development

- The application uses Express.js for the backend
- Google Sheets API for data persistence
- Vanilla JavaScript for the frontend
- Modern CSS with responsive design

## License

MIT
