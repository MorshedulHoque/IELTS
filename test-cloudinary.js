// Test script to verify Cloudinary credentials
// Run this with: node test-cloudinary.js

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Cloudinary Configuration...\n');

// Manually load .env.local file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ .env.local file loaded');
  } else {
    console.log('⚠️  .env.local file not found');
  }
}

loadEnvFile();

// Check environment variables
console.log('\nEnvironment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary environment variables!');
  console.error('Please check your .env.local file.');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔧 Testing Cloudinary connection...');

// Test the connection by getting account info
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Response:', result);
    
    // Test upload capabilities
    console.log('\n🔧 Testing upload capabilities...');
    return cloudinary.api.resources({
      type: 'upload',
      max_results: 1
    });
  })
  .then(result => {
    console.log('✅ Upload capabilities working!');
    console.log('Account has', result.total_count, 'resources');
  })
  .catch(error => {
    console.error('❌ Cloudinary test failed:', error.message);
    console.error('Error details:', error);
    
    if (error.http_code === 401) {
      console.error('\n🔍 401 Error indicates invalid credentials.');
      console.error('Please check your API Key and API Secret in .env.local');
    }
  }); 