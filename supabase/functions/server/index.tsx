import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

// Logger
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Create storage bucket on startup
const initializeStorage = async () => {
  try {
    const bucketName = 'make-985d7d68-certificates';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Certificate bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Create projects storage bucket on startup
const initializeProjectsStorage = async () => {
  try {
    const bucketName = 'make-985d7d68-projects';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
      });
      if (error) {
        console.error('Error creating projects bucket:', error);
      } else {
        console.log('Projects bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing projects storage:', error);
  }
};

// Initialize both storages on startup
initializeStorage();
initializeProjectsStorage();

// Send email notification function
const sendEmailNotification = async (message: any) => {
  try {
    // You would need to configure an email service (like Resend, SendGrid, etc.)
    // For now, we'll log the email that would be sent
    console.log('Email notification would be sent to bagdeashray@gmail.com:', {
      subject: 'New Portfolio Message Received',
      content: `
        New message received on your portfolio:
        
        Name: ${message.name}
        Email: ${message.email}
        Subject: ${message.subject}
        Message: ${message.message}
        
        Sent at: ${new Date(message.timestamp).toLocaleString()}
      `
    });
    
    // TODO: Implement actual email sending when email service is configured
    return { success: true };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: error.message };
  }
};

// Contact form submission
app.post('/make-server-985d7d68/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();
    
    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Generate unique message ID
    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const messageData = {
      id: messageId,
      name,
      email,
      subject: subject || 'No Subject',
      message,
      timestamp,
      read: false
    };
    
    // Store message in KV store
    await kv.set(`message:${messageId}`, messageData);
    
    // Send email notification
    await sendEmailNotification(messageData);
    
    return c.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get all messages (admin only)
app.get('/make-server-985d7d68/messages', async (c) => {
  try {
    const messages = await kv.getByPrefix('message:');
    
    // Sort messages by timestamp (newest first)
    const sortedMessages = messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ success: true, messages: sortedMessages });
    
  } catch (error) {
    console.error('Get messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// Mark message as read
app.post('/make-server-985d7d68/messages/:id/read', async (c) => {
  try {
    const messageId = c.req.param('id');
    const messageKey = `message:${messageId}`;
    
    const [existingMessage] = await kv.mget([messageKey]);
    if (!existingMessage) {
      return c.json({ error: 'Message not found' }, 404);
    }
    
    const updatedMessage = { ...existingMessage, read: true };
    await kv.set(messageKey, updatedMessage);
    
    return c.json({ success: true, message: 'Message marked as read' });
    
  } catch (error) {
    console.error('Mark message read error:', error);
    return c.json({ error: 'Failed to update message' }, 500);
  }
});

// Delete message
app.delete('/make-server-985d7d68/messages/:id', async (c) => {
  try {
    const messageId = c.req.param('id');
    const messageKey = `message:${messageId}`;
    
    await kv.del(messageKey);
    
    return c.json({ success: true, message: 'Message deleted' });
    
  } catch (error) {
    console.error('Delete message error:', error);
    return c.json({ error: 'Failed to delete message' }, 500);
  }
});

// Upload certificate image
app.post('/make-server-985d7d68/upload-certificate', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('certificate') as File;
    const certificateId = formData.get('certificateId') as string;
    
    if (!file || !certificateId) {
      return c.json({ error: 'Missing file or certificate ID' }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.' }, 400);
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File too large. Maximum size is 10MB.' }, 400);
    }
    
    const bucketName = 'make-985d7d68-certificates';
    const fileName = `${certificateId}-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds
    
    return c.json({
      success: true,
      fileName: data.path,
      signedUrl: signedUrlData?.signedUrl || null
    });
    
  } catch (error) {
    console.error('Certificate upload error:', error);
    return c.json({ error: 'Failed to upload certificate' }, 500);
  }
});

// Get certificate image signed URL
app.get('/make-server-985d7d68/certificate-image/:fileName', async (c) => {
  try {
    const fileName = c.req.param('fileName');
    const bucketName = 'make-985d7d68-certificates';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600); // 1 hour
    
    if (error) {
      return c.json({ error: 'Failed to get certificate image' }, 404);
    }
    
    return c.json({ success: true, signedUrl: data.signedUrl });
    
  } catch (error) {
    console.error('Get certificate image error:', error);
    return c.json({ error: 'Failed to fetch certificate image' }, 500);
  }
});

// Upload project media
app.post('/make-server-985d7d68/upload-project-media', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('media') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file || !projectId) {
      return c.json({ error: 'Missing file or project ID' }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, MP4, WebM, and QuickTime are allowed.' }, 400);
    }
    
    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeText = file.type.startsWith('video/') ? '50MB' : '10MB';
      return c.json({ error: `File too large. Maximum size is ${maxSizeText}.` }, 400);
    }
    
    const bucketName = 'make-985d7d68-projects';
    const fileName = `${projectId}-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds
    
    return c.json({
      success: true,
      fileName: data.path,
      signedUrl: signedUrlData?.signedUrl || null,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image'
    });
    
  } catch (error) {
    console.error('Project media upload error:', error);
    return c.json({ error: 'Failed to upload project media' }, 500);
  }
});

// Get project media signed URL
app.get('/make-server-985d7d68/project-media/:fileName', async (c) => {
  try {
    const fileName = c.req.param('fileName');
    const bucketName = 'make-985d7d68-projects';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600); // 1 hour
    
    if (error) {
      return c.json({ error: 'Failed to get project media' }, 404);
    }
    
    return c.json({ success: true, signedUrl: data.signedUrl });
    
  } catch (error) {
    console.error('Get project media error:', error);
    return c.json({ error: 'Failed to fetch project media' }, 500);
  }
});

// Health check
app.get('/make-server-985d7d68/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
Deno.serve(app.fetch);