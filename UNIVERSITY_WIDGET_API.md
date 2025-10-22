# University Widget API Documentation

## Overview
API for generating embeddable iframe widgets for universities. Users can customize their navigation widget and get an iframe code to embed on any website.

## Base URL
```
http://localhost:3001
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Generate Widget
**POST** `/university/widget/generate`

Creates a new widget configuration and returns iframe code for embedding.

**Request Body:**
```json
{
  "selectedIcons": ["Chat", "Home", "Mail", "Phone"],
  "selectedColor": "#131e42",
  "iconInputs": {
    "Chat": {
      "label": "Chat Support",
      "url": "https://university.com/chat"
    },
    "Home": {
      "label": "Homepage", 
      "url": "https://university.com"
    },
    "Mail": {
      "label": "Contact Us",
      "url": "https://university.com/contact"
    },
    "Phone": {
      "label": "Call Now",
      "url": "tel:+1234567890"
    }
  },
  "universityId": "optional-university-id"
}
```

**Request Body Fields:**
- `selectedIcons` (array, optional): Array of icon names to display
- `selectedColor` (string, optional): Hex color code for widget styling (default: "#131e42")
- `iconInputs` (object, optional): Configuration for each icon
  - `label` (string): Display name for the icon
  - `url` (string): Link URL when icon is clicked
- `universityId` (string, optional): University identifier

**Available Icons:**
- `"Chat"` - Chat/Message icon (always included)
- `"Home"` - Home icon
- `"User"` - User profile icon
- `"Mail"` - Email icon
- `"Phone"` - Phone icon
- `"Calendar"` - Calendar icon
- `"FileText"` - Document icon
- `"Book"` - Book icon
- `"Settings"` - Settings icon
- `"Globe"` - Globe/Website icon
- `"HelpCircle"` - Help icon
- `"Send"` - Send icon

**Response (201 Created):**
```json
{
  "iframeCode": "<iframe src=\"http://localhost:3001/university/widget/abc123\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" style=\"border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;\" title=\"University Navigation Widget\"></iframe>",
  "iframeFormats": {
    "html": "<iframe src=\"http://localhost:3001/university/widget/abc123\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" style=\"border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;\" title=\"University Navigation Widget\"></iframe>",
    "react": "<iframe src=\"http://localhost:3001/university/widget/abc123\" width=\"200\" height=\"300\" frameBorder=\"0\" scrolling=\"no\" style={{\"border\": \"none\", \"position\": \"fixed\", \"right\": \"20px\", \"top\": \"50%\", \"transform\": \"translateY(-50%)\", \"zIndex\": 9999}} title=\"University Navigation Widget\" />",
    "vue": "<iframe :src=\"'http://localhost:3001/university/widget/abc123'\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" :style=\"{border: 'none', position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 9999}\" title=\"University Navigation Widget\"></iframe>",
    "angular": "<iframe [src]=\"'http://localhost:3001/university/widget/abc123'\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" [style]=\"{'border': 'none', 'position': 'fixed', 'right': '20px', 'top': '50%', 'transform': 'translateY(-50%)', 'z-index': '9999'}\" title=\"University Navigation Widget\"></iframe>",
    "wordpress": "<!-- Add this to your WordPress theme's footer.php or use a plugin -->\n<iframe src=\"http://localhost:3001/university/widget/abc123\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" style=\"border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;\" title=\"University Navigation Widget\"></iframe>",
    "shopify": "<!-- Add this to your Shopify theme's layout/theme.liquid file before </body> -->\n<iframe src=\"http://localhost:3001/university/widget/abc123\" width=\"200\" height=\"300\" frameborder=\"0\" scrolling=\"no\" style=\"border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;\" title=\"University Navigation Widget\"></iframe>"
  },
  "previewUrl": "http://localhost:3001/university/widget/abc123",
  "widgetId": "abc123"
}
```

**Response Fields:**
- `iframeCode` (string): Complete HTML iframe code ready to embed (backward compatibility)
- `iframeFormats` (object): Iframe codes for different platforms and frameworks
  - `html` (string): Standard HTML iframe code
  - `react` (string): React/JSX iframe code with proper syntax
  - `vue` (string): Vue.js iframe code with Vue directives
  - `angular` (string): Angular iframe code with Angular bindings
  - `wordpress` (string): WordPress iframe code with installation instructions
  - `shopify` (string): Shopify iframe code with installation instructions
- `previewUrl` (string): Direct URL to preview the widget
- `widgetId` (string): Unique identifier for the widget

### 2. Get Widget Preview
**GET** `/university/widget/{widgetId}`

Serves the widget HTML for iframe embedding. This endpoint is called automatically by the iframe.

**Response (200 OK):**
Returns complete HTML page with the widget embedded.

### 3. Get Widget Configuration
**GET** `/university/widget/{widgetId}/config`

Retrieves the configuration for a specific widget.

**Response (200 OK):**
```json
{
  "selectedIcons": ["Chat", "Home", "Mail", "Phone"],
  "selectedColor": "#131e42",
  "iconInputs": {
    "Chat": {
      "label": "Chat Support",
      "url": "https://university.com/chat"
    },
    "Home": {
      "label": "Homepage",
      "url": "https://university.com"
    }
  },
  "universityId": "optional-university-id"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Widget not found"
}
```

## Frontend Integration Example

### Step 1: Send Widget Configuration
```javascript
// When user clicks "Save and Move to Next Section"
const widgetData = {
  selectedIcons: ["Chat", "Home", "Mail", "Phone"],
  selectedColor: "#131e42",
  iconInputs: {
    "Chat": { label: "Chat Support", url: "https://university.com/chat" },
    "Home": { label: "Homepage", url: "https://university.com" },
    "Mail": { label: "Contact Us", url: "https://university.com/contact" },
    "Phone": { label: "Call Now", url: "tel:+1234567890" }
  }
};

const response = await fetch('/university/widget/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(widgetData)
});

const result = await response.json();
```

### Step 2: Display Iframe Code Options to User
```javascript
// Show the iframe codes for different platforms
const { iframeFormats } = result;

// Display different format options in UI
document.getElementById('html-code').value = iframeFormats.html;
document.getElementById('react-code').value = iframeFormats.react;
document.getElementById('vue-code').value = iframeFormats.vue;
document.getElementById('angular-code').value = iframeFormats.angular;
document.getElementById('wordpress-code').value = iframeFormats.wordpress;
document.getElementById('shopify-code').value = iframeFormats.shopify;

// Or show a dropdown/selector for users to choose their platform
function showIframeCode(platform) {
  const code = iframeFormats[platform];
  document.getElementById('selected-code').value = code;
}
```

### Step 3: User Embeds Widget
The user copies the appropriate iframe code for their platform:

#### **HTML/Regular Websites**
```html
<iframe 
  src="http://localhost:3001/university/widget/abc123" 
  width="200" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;"
  title="University Navigation Widget">
</iframe>
```

#### **React/Next.js**
```jsx
<iframe 
  src="http://localhost:3001/university/widget/abc123" 
  width="200" 
  height="300" 
  frameBorder="0" 
  scrolling="no"
  style={{
    border: 'none',
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999
  }}
  title="University Navigation Widget"
/>
```

#### **Vue.js**
```vue
<iframe 
  :src="'http://localhost:3001/university/widget/abc123'" 
  width="200" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  :style="{
    border: 'none',
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999
  }"
  title="University Navigation Widget">
</iframe>
```

#### **Angular**
```html
<iframe 
  [src]="'http://localhost:3001/university/widget/abc123'" 
  width="200" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  [style]="{
    'border': 'none',
    'position': 'fixed',
    'right': '20px',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'z-index': '9999'
  }"
  title="University Navigation Widget">
</iframe>
```

#### **WordPress**
Add to your theme's `footer.php` file or use a plugin:
```html
<!-- Add this to your WordPress theme's footer.php or use a plugin -->
<iframe 
  src="http://localhost:3001/university/widget/abc123" 
  width="200" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;"
  title="University Navigation Widget">
</iframe>
```

#### **Shopify**
Add to your theme's `layout/theme.liquid` file before `</body>`:
```html
<!-- Add this to your Shopify theme's layout/theme.liquid file before </body> -->
<iframe 
  src="http://localhost:3001/university/widget/abc123" 
  width="200" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999;"
  title="University Navigation Widget">
</iframe>
```

## Widget Preview in Frontend

When the widget is generated, it will appear as a clean vertical icon rail in your frontend preview:

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Website Content                   │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  Live Preview of Widget             │ │
│  │                                     │ │
│  │  ┌─────┐                            │ │
│  │  │  🏠  │ ← Home icon with tooltip   │ │
│  │  │  ✉️  │ ← Mail icon               │ │
│  │  │  📞  │ ← Phone icon              │ │
│  │  │  💬  │ ← Chat icon (always shown)│ │
│  │  └─────┘                            │ │
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Widget Preview Features:
- **Clean Design**: Only the vertical icon rail is shown
- **Live Preview**: Real-time preview of your widget configuration
- **Hover Effects**: Tooltips appear when hovering over icons
- **Responsive**: Adapts to different screen sizes
- **Same Styling**: Identical to the embeddable widget

## Widget Appearance When Embedded

When users embed the iframe code on their website, the widget will appear as a fixed sidebar on the right side:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  User's Website Content                                     │
│                                                             │
│  ┌─────────────────────────────┐  ┌─────────┐              │
│  │                             │  │         │              │
│  │  Main Website Content       │  │    🏠    │ ← Fixed      │
│  │                             │  │    ✉️    │   Widget     │
│  │  - Articles                 │  │    📞    │   on Right   │
│  │  - Images                   │  │    💬    │   Side       │
│  │  - Navigation               │  │         │              │
│  │                             │  │         │              │
│  │  Scrollable Content...      │  │         │              │
│  │                             │  │         │              │
│  └─────────────────────────────┘  └─────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Embedded Widget Behavior:
- **Fixed Position**: Always visible on the right side
- **Vertically Centered**: Positioned at middle of viewport
- **Scroll Independent**: Stays in place when page scrolls
- **Always On Top**: Appears above other website content
- **Responsive**: Works on all screen sizes

## Widget Features

- **Fixed Position**: Widget appears on the right side of any website
- **Responsive**: Adapts to different screen sizes
- **Hover Tooltips**: Shows labels when hovering over icons
- **Clickable Icons**: Each icon links to the configured URL
- **Custom Colors**: Uses the selected color for styling
- **Blur Effects**: Modern glass-morphism design
- **Cross-Origin**: Works on any website without conflicts

## Notes

1. **Chat Icon**: Always included in the widget (cannot be removed)
2. **Max Icons**: Maximum 5 icons can be selected
3. **URL Validation**: Ensure URLs are properly formatted
4. **Color Format**: Use hex color codes (e.g., "#131e42")
5. **Iframe Security**: Widget runs in isolated iframe for security
6. **No Dependencies**: Works on any website without additional setup
