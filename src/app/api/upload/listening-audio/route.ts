import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if cloudinary is available
    let cloudinary;
    try {
      cloudinary = require('cloudinary').v2;
    } catch (error) {
      console.error('Cloudinary package not found:', error);
      return NextResponse.json(
        { error: 'Cloudinary package not installed. Please run: npm install cloudinary' },
        { status: 500 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Validate environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Cloudinary configuration missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Listening audio file received:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an audio file.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for listening tests)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer created, size:', buffer.length);

    // Upload to Cloudinary with specific settings for listening tests
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary uses 'video' for audio files
          folder: 'ielts-listening-audio',
          format: 'mp3',
          public_id: `listening_${Date.now()}`,
          // Audio optimization settings
          audio_codec: 'mp3',
          bit_rate: '128k', // Good quality for listening tests
          audio_frequency: 44100, // Standard frequency
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      audioUrl: (result as any).secure_url,
      publicId: (result as any).public_id,
      duration: (result as any).duration, // Audio duration in seconds
      format: (result as any).format,
      size: (result as any).bytes,
    });

  } catch (error: any) {
    console.error('Listening audio upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload audio file',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 