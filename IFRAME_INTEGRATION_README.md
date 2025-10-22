# 🎯 Iframe Widget Integration & Detection System

## 📋 Overview

This system provides automatic detection when your iframe widget is successfully loaded on external websites. The iframe automatically notifies our backend when it loads, and you can check the integration status with a simple button click.

## 🚀 Quick Start

### 1. Generate Widget
```bash
POST /university/widget/generate
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "universityName": "Example University",
  "primaryColor": "#3B82F6",
  "icons": [
    {
      "name": "Admissions",
      "icon": "🎓",
      "url": "https://example.edu/admissions",
      "tooltip": "Apply Now"
    }
  ]
}
```

### 2. Get Embed Codes
The response includes ready-to-use embed codes for different platforms:

```json
{
  "widgetId": "abc123-def456-ghi789",
  "previewUrl": "http://localhost:3001/university/widget/abc123-def456-ghi789",
  "embedCodes": {
    "html": "<iframe src=\"...\" width=\"300\" height=\"300\" ...></iframe>",
    "react": "<iframe src=\"...\" width=\"300\" height=\"300\" ... />",
    "vue": "<iframe src=\"...\" width=\"300\" height=\"300\" ...></iframe>",
    "angular": "<iframe src=\"...\" width=\"300\" height=\"300\" ...></iframe>",
    "wordpress": "[iframe src=\"...\" width=\"300\" height=\"300\" ...]",
    "shopify": "{% iframe src=\"...\" width=\"300\" height=\"300\" ... %}"
  }
}
```

### 3. Embed on Website
Copy the appropriate embed code and paste it into your website. The iframe will automatically notify our backend when it loads!

### 4. Check Integration Status
Add a "Check Status" button in your frontend. When clicked, it will check if the iframe has been successfully loaded and integrated.

## 🔍 How It Works

1. **Auto-Notification**: When iframe loads, it sends a POST request to our backend
2. **Domain Tracking**: We capture domain, timestamp, and user agent
3. **Backend Logging**: Backend logs successful integrations with emojis
4. **Manual Check**: Frontend button checks integration status

### Backend Logs
When an iframe loads successfully, you'll see:
```
🎯 IFRAME INTEGRATION SUCCESS! Widget: abc123-def456-ghi789
📱 Domain: example.com
⏰ Timestamp: 2024-01-15T10:30:00Z
🌐 User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...
📊 Total loads for this widget: 3
✅ Integration Status: ACTIVE
```

## 📡 API Endpoints

### 1. Generate Widget
```bash
POST /university/widget/generate
```
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** Widget configuration (see Quick Start)

### 2. Get Widget HTML (Public)
```bash
GET /university/widget/{widgetId}
```
**Access:** Public (no auth required)
**Returns:** HTML content for iframe

### 3. Check Integration Status (Frontend Button)
```bash
GET /university/widget/{widgetId}/status
```
**Access:** Public (no auth required)
**Returns:** Integration status - use this for your "Check Status" button

**Response (Success):**
```json
{
  "verified": true,
  "message": "Iframe integration is active!",
  "details": {
    "latestDomain": "example.com",
    "lastSeen": "2024-01-15T10:30:00Z",
    "totalLoads": 5,
    "uniqueDomains": 2
  }
}
```

**Response (Not Yet Integrated):**
```json
{
  "verified": false,
  "message": "No iframe loads detected yet",
  "details": {
    "suggestion": "Embed the iframe code on your website and visit the page"
  }
}
```

## 🎨 Frontend Integration

### Check Status Button Implementation
Add a "Check Status" button that calls the status endpoint when clicked:

#### CSS Styling
```css
.check-status-btn {
  background: #3B82F6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.check-status-btn:hover:not(:disabled) {
  background: #2563EB;
  transform: translateY(-1px);
}

.check-status-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.status-message {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
}

.status-message.success {
  background: #D1FAE5;
  border-color: #10B981;
  color: #065F46;
}

.status-message.pending {
  background: #FEF3C7;
  border-color: #F59E0B;
  color: #92400E;
}
```

### React/Next.js Example
```jsx
import { useState } from 'react';

function WidgetIntegration({ widgetId }) {
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`/university/widget/${widgetId}/status`);
      const data = await response.json();
      setStatus(data);
      
      if (data.verified) {
        // Move to success screen!
        showSuccessScreen(data);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="integration-status">
      <button 
        onClick={checkStatus} 
        disabled={isChecking}
        className="check-status-btn"
      >
        {isChecking ? 'Checking...' : 'Check Integration Status'}
      </button>
      
      {status && (
        <div className={`status-message ${status.verified ? 'success' : 'pending'}`}>
          {status.verified ? (
            <div>
              ✅ Widget successfully integrated on {status.details.latestDomain}
              <p>Last seen: {new Date(status.details.lastSeen).toLocaleString()}</p>
              <p>Total loads: {status.details.totalLoads}</p>
            </div>
          ) : (
            <div>
              ⏳ {status.message}
              <p>{status.details.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Vue.js Example
```vue
<template>
  <div class="integration-status">
    <button 
      @click="checkStatus" 
      :disabled="isChecking"
      class="check-status-btn"
    >
      {{ isChecking ? 'Checking...' : 'Check Integration Status' }}
    </button>
    
    <div v-if="status" :class="['status-message', status.verified ? 'success' : 'pending']">
      <div v-if="status.verified">
        ✅ Widget successfully integrated on {{ status.details.latestDomain }}
        <p>Last seen: {{ formatDate(status.details.lastSeen) }}</p>
        <p>Total loads: {{ status.details.totalLoads }}</p>
      </div>
      <div v-else>
        ⏳ {{ status.message }}
        <p>{{ status.details.suggestion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: null,
      isChecking: false
    };
  },
  methods: {
    async checkStatus() {
      this.isChecking = true;
      try {
        const response = await fetch(`/university/widget/${this.widgetId}/status`);
        this.status = await response.json();
        
        if (this.status.verified) {
          // Move to success screen!
          this.showSuccessScreen(this.status);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      } finally {
        this.isChecking = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    showSuccessScreen(status) {
      // Navigate to success screen
      this.$router.push('/success');
    }
  },
  props: ['widgetId']
};
</script>
```

## 🎯 Success Flow

1. **Generate widget** → Get embed codes
2. **Embed iframe** → Copy code to website  
3. **Visit website** → Iframe loads and notifies backend
4. **Backend logs** → "🎯 IFRAME INTEGRATION SUCCESS!"
5. **Click "Check Status" button** → Frontend calls status endpoint
6. **If verified** → Move to success screen! 🎉

## 🔧 Configuration

### Environment Variables
```bash
BASE_URL=http://localhost:3001  # Your backend URL
```

### Widget Positioning
The iframe is positioned at:
- **Right edge:** 20px from right
- **Vertical:** Centered (50% from top)
- **Width:** 300px (allows tooltips to expand left)
- **Z-index:** 9999 (always on top)

## 📊 What We Track

- ✅ **Domain** where iframe is embedded
- ✅ **Timestamp** of when iframe loaded
- ✅ **User Agent** information
- ✅ **Widget ID** for tracking
- ✅ **Load count** per domain
- ✅ **Last seen** timestamp

## 🚨 Troubleshooting

### Iframe Not Detected
1. **Check iframe code** - Make sure it's properly embedded
2. **Visit the page** - Someone needs to actually load the page
3. **Check console** - Look for any JavaScript errors
4. **Verify URL** - Make sure the widget URL is accessible

### Common Issues
- **CORS errors:** Iframe should work from any domain
- **Network issues:** Check if backend is accessible
- **Widget not found:** Verify widget ID is correct

## 📝 Notes

- **No scraping needed** - iframe tells us directly
- **Real-time detection** - immediate notification
- **Works on any domain** - no CORS restrictions
- **Manual check** - Button-based status checking
- **Secure** - only public iframe endpoint, others require auth

## 🔗 Related Files

- `src/modules/university/university.service.ts` - Main service logic with enhanced logging
- `src/modules/university/university.controller.ts` - API endpoints including status endpoint
- `IFRAME_INTEGRATION_README.md` - This documentation file

---

**Need help?** Check the backend logs for detailed information about iframe loads and any errors.
