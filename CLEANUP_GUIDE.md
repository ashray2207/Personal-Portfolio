# Cleanup Guide - Remove Old Files

After completing the migration to the `/src/` directory structure, you can safely remove these duplicate files and directories:

## Files to Remove

### Root-level duplicate files:
- `/App.tsx` (moved to `/src/App.tsx`)
- `/styles/globals.css` (moved to `/src/styles/globals.css`)

### Old component directories:
- `/components/` (entire directory - all moved to `/src/components/`)
- `/utils/` (entire directory - moved to `/src/utils/`)

### Commands to clean up:
```bash
# Remove duplicate App.tsx
rm /App.tsx

# Remove old components directory
rm -rf /components/

# Remove old utils directory  
rm -rf /utils/

# Remove old styles directory
rm -rf /styles/
```

## Keep These Files:
- ✅ `/src/` directory (main source)
- ✅ `/public/` directory (static assets)
- ✅ `/index.html` (entry point)
- ✅ `/package.json` (dependencies)
- ✅ `/vite.config.ts` (build config)
- ✅ `/render.yaml` (deployment config)
- ✅ `/tsconfig.json` (TypeScript config)
- ✅ `/.gitignore` (Git ignore rules)
- ✅ Documentation files (*.md)

## Verification:
After cleanup, ensure the app still builds and runs:
```bash
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

## Final Structure:
```
/
├── src/                    # ✅ Main source directory
├── public/                 # ✅ Static assets
├── index.html             # ✅ Entry point
├── package.json           # ✅ Dependencies
├── vite.config.ts         # ✅ Build config
├── render.yaml            # ✅ Deployment config
├── tsconfig.json          # ✅ TypeScript config
└── README/docs files      # ✅ Documentation
```

The migration is complete and the portfolio is ready for Render deployment! 🚀