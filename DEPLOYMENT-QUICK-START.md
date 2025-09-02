# 🚀 Quick Render Deployment Fix

## 🚨 **IMMEDIATE FIX FOR YOUR DEPLOYMENT ERROR**

The error `Cannot find module '/opt/render/project/src/backend/backend/server.js'` means Render is looking in the wrong directory.

## ✅ **SOLUTION: Use the Root render.yaml (Recommended)**

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Blueprint"**
3. **Connect your GitHub repository**: `dazeez1/blog-api`
4. **Select the root `render.yaml` file** (this will deploy both services automatically)
5. **Click "Apply"**

## 🔧 **Alternative: Manual Service Creation**

If you prefer to create services manually:

### Backend Service
1. **Click "New +" → "Web Service"**
2. **Repository**: `dazeez1/blog-api`
3. **Root Directory**: `backend` ⚠️ **CRITICAL: Must be `backend`**
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CORS_ORIGIN`: `https://bloghub-frontend.onrender.com`

### Frontend Service
1. **Click "New +" → "Static Site"**
2. **Repository**: `dazeez1/blog-api`
3. **Root Directory**: `frontend` ⚠️ **CRITICAL: Must be `frontend`**
4. **Build Command**: `echo "Static site - no build needed"`
5. **Publish Directory**: `public`

## 🎯 **Why This Fixes Your Error**

- **Root Directory**: Tells Render where to find your code
- **Start Command**: `node server.js` (not `npm start`)
- **Path Resolution**: Render will look in `/opt/render/project/src/backend/server.js` (correct)

## 🚀 **After Deployment**

1. **Backend Health Check**: `https://your-backend-name.onrender.com/health`
2. **Frontend**: `https://your-frontend-name.onrender.com`
3. **Update Frontend Config**: Point to your backend URL

## 📞 **Still Having Issues?**

1. **Check Render logs** for specific error messages
2. **Verify Root Directory** is set to `backend` (not root)
3. **Ensure Start Command** is `node server.js`
4. **Check Environment Variables** are set correctly

---

**Your project is ready for deployment! 🎉**
