# Deployment Guide - Ashray Bagde Portfolio

This guide explains how to deploy your portfolio website to Render.

## Prerequisites

- GitHub repository with your portfolio code
- Render account (free tier available)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has all the necessary files:
- `package.json` with build scripts
- `vite.config.ts` for build configuration
- `render.yaml` for Render configuration
- All source files in the `src/` directory

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure the deployment

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: `ashray-portfolio`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18.17.0`

### 3. Environment Variables (Optional)

If you need to customize any settings, add these environment variables in Render:

- `NODE_VERSION`: `18.17.0`
- `NODE_ENV`: `production`

### 4. Custom Domain (Optional)

After deployment, you can configure a custom domain:
1. Go to your service settings in Render
2. Navigate to "Custom Domains"
3. Add your domain and follow the DNS setup instructions

## Build Configuration

The portfolio uses Vite for building and bundling:

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Production**: `npm start`

## Features Included

- ✅ Responsive design optimized for all devices
- ✅ Dark mode enforced for professional look
- ✅ Admin panel with password protection
- ✅ Certificate and project management
- ✅ Contact form with local storage
- ✅ SEO optimized with meta tags
- ✅ Fast loading with optimized assets
- ✅ Professional typography and color scheme

## Performance Optimizations

- Code splitting for faster loading
- Optimized bundle size
- Efficient asset loading
- Modern ES modules
- Compressed CSS and JavaScript

## Support

If you encounter any issues during deployment:

1. Check the build logs in Render dashboard
2. Ensure all dependencies are correctly listed in `package.json`
3. Verify that the Node version matches the requirements
4. Contact Render support if needed

## Post-Deployment

After successful deployment:

1. Test all functionality including admin panel
2. Check responsive design on different devices
3. Verify all links and navigation work correctly
4. Update your social media profiles with the new portfolio URL

Your portfolio will be live at: `https://your-service-name.onrender.com`