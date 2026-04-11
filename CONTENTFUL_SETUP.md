# Contentful Setup Guide

## 🔧 **Fix the Access Token Error**

The error you're seeing indicates that the Contentful access token is invalid. Here's how to fix it:

### **1. ✅ Credentials Updated**

Your Contentful credentials have been successfully added:

#### **Space ID**
- ✅ **Correct:** `0nh1ov7pts2h`

#### **Access Token**
- ✅ **Correct:** `WLBpp0RCoDS5iGwO4EsoTbyoxKY49xHnlfLa6tnjpL8` (Delivery API)

### **2. ✅ Environment File Created**

The `.env.local` file has been created with your credentials:

```bash
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=0nh1ov7pts2h
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=WLBpp0RCoDS5iGwO4EsoTbyoxKY49xHnlfLa6tnjpL8
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

### **3. Create Content Type in Contentful**

1. **Go to Contentful dashboard**
2. **Navigate to Content model**
3. **Create a new content type with ID: `writingSample`**
4. **Add these fields:**

| Field Name | Field ID | Field Type | Required |
|------------|----------|------------|----------|
| Question | question | Short text | Yes |
| Slug | slug | Short text | Yes |
| Image | image | Media | No |
| Answer | answer | Rich text | Yes |
| Date | date | Date & time | Yes |
| Task Type | taskType | Short text | Yes |
| Question Type | questionType | Short text | Yes |

### **4. Test the Connection**

Visit `/writing-samples/test` to see if the connection works.

### **5. Add Sample Content**

1. **Go to Content in Contentful**
2. **Create a new entry of type "writingSample"**
3. **Fill in the fields**
4. **Publish the entry**

---

## 🚨 **Common Issues:**

### **Wrong Token Type**
- ❌ **Management API token** (starts with `CFPAT-`)
- ✅ **Delivery API token** (starts with `CFCDN-`)

### **Wrong Space ID**
- ❌ **Space name** ("ieltsWriting")
- ✅ **Space ID** (alphanumeric string)

### **Content Type Not Created**
- Make sure you create the content type with ID `writingSample`
- Publish the content type

### **Content Not Published**
- Make sure your entries are published, not just saved

---

## 🔍 **Debug Steps:**

1. **Check console logs** - the app now shows connection details
2. **Verify credentials** in Contentful dashboard
3. **Test with mock data** - the app will show sample content if Contentful fails
4. **Check content type** exists and is published
5. **Check entries** are published

---

## 📞 **Need Help?**

If you're still having issues:
1. **Double-check your Space ID and Access Token**
2. **Make sure the content type is created and published**
3. **Add at least one published entry**
4. **Check the console for detailed error messages**
