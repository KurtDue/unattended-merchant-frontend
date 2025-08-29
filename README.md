<<<<<<< HEAD
# Unattended Merchant Frontend

A Next.js-based frontend application for managing unattended retail stores with secure authentication, door access control, camera monitoring, and analytics.

## Features

- **Secure Authentication**: Multi-tenant login system with demo accounts
- **Dashboard Overview**: Store statistics, system status, and activity monitoring
- **Door Access Control**: Real-time door unlock functionality with API integration
- **Camera Management**: Live camera feed monitoring and recording controls
- **Analytics Dashboard**: Visitor insights, trends, and performance metrics
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **API Integration**: Axios for HTTP requests
- **Deployment**: Azure Web Apps with GitHub Actions

## Demo Accounts

### Demo Joker Store Manager
- **Email**: `demo@joker.com`
- **Password**: `demo123`
- **Store**: Demo Joker Store (Entry ID: 390250)

### System Administrator
- **Email**: `admin@unattended.com`
- **Password**: `demo123`
- **Access**: Multi-store management

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unattended-merchant2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
unattended-merchant2/
├── app/                          # Next.js 13 App Router
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard
│   │   ├── doors/page.tsx       # Door access control
│   │   ├── cameras/page.tsx     # Camera management
│   │   └── analytics/page.tsx   # Analytics dashboard
│   ├── login/page.tsx           # Authentication page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx  # Dashboard layout wrapper
│   ├── providers/
│   │   └── AuthProvider.tsx     # Authentication context
│   └── ui/                      # Reusable UI components
├── .github/workflows/           # GitHub Actions
├── azure-deploy.json            # Azure ARM template
└── package.json                 # Dependencies and scripts
```

## API Integration

The application integrates with the Openpath API for door access control:

- **Base URL**: `https://openpath-api-prod.azurewebsites.net/api`
- **Unlock Endpoint**: `POST /unlock`
- **Authentication**: Entry ID-based access control

### Door Unlock Example

```typescript
const response = await axios.post(
  'https://openpath-api-prod.azurewebsites.net/api/unlock',
  {
    entryId: '390250',
    requestedBy: 'Demo User',
    requestSource: 'Web Portal'
  }
);
```

## Deployment

### Azure Web Apps

The application is configured for deployment to Azure Web Apps using GitHub Actions.

#### Prerequisites

1. **Azure Resources**
   - Azure Resource Group
   - Azure App Service Plan (B1 or higher)
   - Azure Web App

2. **GitHub Secrets**
   - `AZUREAPPSERVICE_PUBLISHPROFILE`: Azure Web App publish profile

#### Deployment Steps

1. **Create Azure resources**
   ```bash
   az deployment group create \
     --resource-group your-resource-group \
     --template-file azure-deploy.json \
     --parameters webAppName=unattended-merchant
   ```

2. **Configure GitHub Actions**
   - Add Azure publish profile to GitHub secrets
   - Push to `main` branch triggers automatic deployment

3. **Environment Variables**
   Set in Azure Web App configuration:
   ```
   NEXTAUTH_URL=https://your-app.azurewebsites.net
   NEXTAUTH_SECRET=your-secret-key
   API_BASE_URL=https://openpath-api-prod.azurewebsites.net/api
   ```

### GitHub Actions Workflow

The workflow automatically:
1. Installs Node.js dependencies
2. Builds the Next.js application
3. Runs type checking and linting
4. Deploys to Azure Web Apps

## Features Walkthrough

### Authentication System

- **Multi-tenant Support**: Users can belong to multiple stores
- **Role-based Access**: Merchant and admin roles
- **Session Management**: Persistent login with localStorage
- **Demo Environment**: Pre-configured demo accounts for testing

### Door Access Control

- **Real API Integration**: Direct connection to Openpath API
- **Activity Logging**: Track all unlock requests with timestamps
- **Status Monitoring**: Real-time door status updates
- **Security Features**: Request source tracking and user attribution

### Camera Management

- **Live Feed Simulation**: Visual representation of camera feeds
- **Recording Controls**: Start/stop recording for individual cameras
- **Status Monitoring**: Online/offline/maintenance status tracking
- **Full-screen View**: Detailed camera inspection modal

### Analytics Dashboard

- **Visitor Metrics**: Track store visitors and entry conversion
- **Time-based Analysis**: Hourly patterns and dwell time tracking
- **Visual Charts**: Interactive charts using Recharts library
- **Data Export**: Detailed breakdown tables with filtering

## Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency rules
- **Prettier**: Automated code formatting
- **Tailwind CSS**: Utility-first styling approach

### Component Architecture

- **Server Components**: Default for static content
- **Client Components**: Interactive features with 'use client'
- **Custom Hooks**: Reusable logic extraction
- **Context Providers**: Global state management

### API Integration

- **Axios Client**: Centralized HTTP request handling
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: User feedback during async operations
- **Type Safety**: Full TypeScript integration

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   npm run build
   # Check TypeScript errors and fix null safety issues
   ```

2. **Authentication Issues**
   ```bash
   # Clear browser localStorage
   localStorage.clear()
   ```

3. **API Connection**
   ```bash
   # Verify API endpoint accessibility
   curl https://openpath-api-prod.azurewebsites.net/api/health
   ```

### Development Tips

- Use browser dev tools for debugging
- Check console for React hydration warnings
- Verify environment variables in production
- Test responsive design on mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the GitHub Issues page
- Review deployment logs in Azure
- Verify API connectivity
- Check browser console for client-side errors
=======
# unattended-merchant-frontend
Next.js frontend for unattended merchant portal with door access, cameras, and analytics
>>>>>>> 53b55a3bc0d73e4be017f47a744361e4404829ef
