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

    console.log('Audio file received:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Convert File to buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer created, size:', buffer.length);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary uses 'video' for audio files
          folder: 'ielts-speaking-audio',
          format: 'mp3',
          public_id: `speaking_${Date.now()}`,
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
    });

  } catch (error: any) {
    console.error('Audio upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload audio file',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 