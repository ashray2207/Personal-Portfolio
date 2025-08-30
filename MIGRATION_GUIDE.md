# Migration Guide: Moving to src/ Structure

This guide will help you migrate your existing portfolio structure to work with Render deployment.

## Manual Steps Required

Since I can only create files and not move existing ones, you'll need to manually move your components to the new structure:

### 1. Move Components

Copy all files from `/components/` to `/src/components/`:

```bash
# Copy all component files to src/components/
cp -r components/* src/components/

# Copy UI components
cp -r components/ui src/components/ui
cp -r components/figma src/components/figma
```

### 2. Move Utils and Other Directories

```bash
# Copy utils if they exist
cp -r utils/* src/utils/ 2>/dev/null || true

# Copy any other directories that might be needed
cp -r supabase src/supabase 2>/dev/null || true
```

### 3. Update Import Paths

In your copied components, you might need to update import paths. Most imports should work as-is since they use relative paths, but check for:

- Any absolute imports that might reference the old structure
- Make sure all UI component imports work correctly
- Verify utility imports point to the correct locations

### 4. Files Already Created

I've already created these files for you:
- ✅ `/src/App.tsx` - Main application component
- ✅ `/src/main.tsx` - React application bootstrap
- ✅ `/src/lib/utils.ts` - Utility functions for shadcn
- ✅ `/src/styles/globals.css` - Global styles
- ✅ `/src/components/Navigation.tsx` - Updated navigation component
- ✅ `/package.json` - Dependencies and scripts
- ✅ `/vite.config.ts` - Build configuration
- ✅ `/tsconfig.json` - TypeScript configuration
- ✅ `/index.html` - Application entry point
- ✅ `/render.yaml` - Render deployment config
- ✅ `/.gitignore` - Git ignore rules
- ✅ `/.eslintrc.cjs` - ESLint configuration

### 5. Clean Up Old Files (Optional)

After successfully copying and verifying everything works:

```bash
# Remove old files (be careful!)
rm -rf components/
rm -rf styles/
rm App.tsx
```

### 6. Test Locally

Before deploying to Render, test locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test build
npm run build

# Test production build
npm run preview
```

## Verification Checklist

- [ ] All components render correctly
- [ ] Admin panel works with password "ashray2025"
- [ ] Navigation works smoothly
- [ ] Certificate and project sections display correctly
- [ ] Contact form functions properly
- [ ] Dark mode is enforced
- [ ] Mobile navigation works
- [ ] All animations work properly
- [ ] Build completes without errors
- [ ] Preview shows the site correctly

## Deployment to Render

Once everything is working locally:

1. Push your code to a GitHub repository
2. Connect the repository to Render
3. Render will automatically use the configuration in `render.yaml`
4. Your site will be live!

## Troubleshooting

### Common Issues:

1. **Import Errors**: Check that all imports use the correct relative paths
2. **Build Errors**: Ensure all dependencies are in `package.json`
3. **UI Components**: Verify shadcn components are copied correctly
4. **Type Errors**: Check that TypeScript configuration is correct

### Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Review the build output for specific error messages
3. Verify file paths and imports
4. Ensure all required dependencies are installed

Your portfolio will be production-ready once these steps are completed!