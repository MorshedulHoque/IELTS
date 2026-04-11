import { NextRequest, NextResponse } from 'next/server';
import { 
  deleteAudioFromCloudinary, 
  listAudioFiles, 
  getAudioInfo,
  deleteListeningAudio,
  listListeningAudioFiles
} from '@/lib/cloudinaryUtils';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const type = searchParams.get('type') || 'speaking'; // Default to speaking for backward compatibility
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'listening') {
      result = await deleteListeningAudio(publicId);
    } else {
      result = await deleteAudioFromCloudinary(publicId);
    }
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Audio file deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete audio file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const action = searchParams.get('action');
    const type = searchParams.get('type') || 'speaking'; // Default to speaking for backward compatibility
    
    if (action === 'list') {
      let result;
      if (type === 'listening') {
        result = await listListeningAudioFiles();
      } else {
        result = await listAudioFiles();
      }
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          result: result.result
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to list audio files' },
          { status: 500 }
        );
      }
    }
    
    if (action === 'info' && publicId) {
      const result = await getAudioInfo(publicId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          info: result.result
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to get audio info' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 