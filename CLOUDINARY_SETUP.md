# Cloudinary Setup for IELTS Speaking Test

## 🚀 Complete Setup Guide

### 1. Install Dependencies
```bash
npm install cloudinary
```

### 2. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your credentials from the Dashboard

### 3. Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Get Your Cloudinary Credentials
1. Login to Cloudinary Dashboard
2. Go to "Dashboard" → "Account Details"
3. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 5. Features Implemented
✅ **Audio Upload API**: `/api/upload/audio`  
✅ **Cloudinary Integration**: Automatic audio storage  
✅ **Database Storage**: Audio URLs stored in MongoDB  
✅ **Speaking Test**: Updated to use Cloudinary  
✅ **Audio Management**: Public IDs for easy deletion  

### 6. File Structure
```
src/
├── lib/
│   └── cloudinary.ts          # Cloudinary configuration
├── app/api/upload/
│   └── audio/route.ts         # Audio upload endpoint
└── components/TestComponent/speakingTest/
    └── SpeakingTest.tsx       # Updated with Cloudinary upload
```

### 7. How It Works
1. **User records audio** in speaking test
2. **Audio uploaded** to Cloudinary via API
3. **URL stored** in database with public ID
4. **Audio accessible** from Cloudinary CDN

### 8. Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Perfect for**: Audio files from speaking tests

### 9. Testing
1. Start your development server
2. Go to a speaking test
3. Record audio and submit
4. Check Cloudinary dashboard for uploaded files

### 10. Troubleshooting
- **Upload fails**: Check environment variables
- **Audio not playing**: Verify Cloudinary URL format
- **Storage full**: Check Cloudinary usage dashboard

## 🎯 Next Steps
1. Install `cloudinary` package
2. Add environment variables
3. Test the speaking test upload
4. Monitor Cloudinary usage

Your speaking test audio storage is now ready! 🎉 