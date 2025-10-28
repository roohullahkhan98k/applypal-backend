# Frontend Integration Guide - University Email System

## Overview
This guide explains how to integrate the university email system with your frontend application. Universities can set their email addresses and send ambassador invitations through a beautiful email system.

## Backend API Base URL
```
http://localhost:3001
```

## Authentication
All university endpoints require JWT authentication. Include the token in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📧 Email Management APIs

### 1. Set University Email
**Endpoint:** `POST /university/email/set`

**Purpose:** University sets their email address for sending invitations

**Request Body:**
```json
{
  "email": "university@harvard.edu"
}
```

**Response:**
```json
{
  "success": true,
  "message": "University email set successfully",
  "email": "university@harvard.edu"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "This email is already registered to another university"
}
```

**Frontend Implementation:**
```javascript
const setUniversityEmail = async (email) => {
  const response = await fetch('/university/email/set', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  return response.json();
};
```

---

### 2. Get University Email
**Endpoint:** `GET /university/email`

**Purpose:** Check if university has set an email address

**Response:**
```json
{
  "email": "university@harvard.edu",
  "hasEmail": true
}
```

**Frontend Implementation:**
```javascript
const getUniversityEmail = async () => {
  const response = await fetch('/university/email', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

### 3. Send Ambassador Invitation
**Endpoint:** `POST /university/email/send-invitation`

**Purpose:** Send invitation email to potential ambassador

**Request Body:**
```json
{
  "ambassadorName": "John Doe",
  "ambassadorEmail": "john.doe@example.com",
  "universityName": "Harvard University"  // Optional - defaults to user's name
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully to john.doe@example.com",
  "sentTo": "john.doe@example.com"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "University email not set. Please set your email address first.",
  "sentTo": "john.doe@example.com"
}
```

**Frontend Implementation:**
```javascript
const sendInvitation = async (ambassadorData) => {
  const response = await fetch('/university/email/send-invitation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ambassadorData)
  });
  return response.json();
};
```

---

### 4. Send Bulk Ambassador Invitations
**Endpoint:** `POST /university/email/send-bulk-invitations`

**Purpose:** Send invitation emails to multiple ambassadors at once

**Request Body:**
```json
{
  "ambassadors": [
    { "name": "John Doe", "email": "john.doe@example.com" },
    { "name": "Jane Smith", "email": "jane.smith@example.com" },
    { "name": "Bob Johnson", "email": "bob.johnson@example.com" }
  ],
  "universityName": "Harvard University"  // Optional - defaults to user's name
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk invitations completed: 3 sent, 0 failed",
  "totalSent": 3,
  "totalFailed": 0,
  "results": [
    { "name": "John Doe", "email": "john.doe@example.com", "success": true },
    { "name": "Jane Smith", "email": "jane.smith@example.com", "success": true },
    { "name": "Bob Johnson", "email": "bob.johnson@example.com", "success": true }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Bulk invitations completed: 2 sent, 1 failed",
  "totalSent": 2,
  "totalFailed": 1,
  "results": [
    { "name": "John Doe", "email": "john.doe@example.com", "success": true },
    { "name": "Jane Smith", "email": "jane.smith@example.com", "success": true },
    { "name": "Bob Johnson", "email": "invalid-email", "success": false, "error": "Invalid email format" }
  ]
}
```

**Frontend Implementation:**
```javascript
const sendBulkInvitations = async (ambassadorsData) => {
  const response = await fetch('/university/email/send-bulk-invitations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ambassadorsData)
  });
  return response.json();
};
```

---

## 📋 Invitation Management APIs

### 4. Get Invited Ambassadors List
**Endpoint:** `GET /university/invitations`

**Purpose:** Get all invited ambassadors with their status

**Response:**
```json
{
  "invitations": [
    {
      "id": "abc123-def456-ghi789",
      "ambassadorName": "John Doe",
      "ambassadorEmail": "john.doe@example.com",
      "status": "INVITED",
      "invitedAt": "2025-01-08T10:30:00Z",
      "respondedAt": null
    },
    {
      "id": "xyz789-abc123-def456",
      "ambassadorName": "Jane Smith",
      "ambassadorEmail": "jane.smith@example.com",
      "status": "ACCEPTED",
      "invitedAt": "2025-01-08T09:15:00Z",
      "respondedAt": "2025-01-08T11:30:00Z"
    }
  ],
  "totalCount": 2,
  "statusCounts": {
    "INVITED": 1,
    "ACCEPTED": 1,
    "DECLINED": 0
  }
}
```

**Frontend Implementation:**
```javascript
const getInvitedAmbassadors = async () => {
  const response = await fetch('/university/invitations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

### 5. Update Invitation Status
**Endpoint:** `POST /university/invitations/:ambassadorEmail/status`

**Purpose:** Update invitation status (Accept/Decline)

**Request Body:**
```json
{
  "status": "ACCEPTED"  // or "DECLINED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation accepted successfully"
}
```

**Frontend Implementation:**
```javascript
const updateInvitationStatus = async (ambassadorEmail, status) => {
  const response = await fetch(`/university/invitations/${ambassadorEmail}/status`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  return response.json();
};
```

---

### 6. Handle Invitation Decline (Public)
**Endpoint:** `GET /university/invitations/decline?token=ambassador@example.com`

**Purpose:** Handle decline from email link (no authentication required)

**Response:**
```json
{
  "success": true,
  "message": "Invitation declined successfully"
}
```

---

## 🎨 Frontend UI Components Needed

### 1. Email Setup Form
```jsx
// Component for setting university email
const EmailSetupForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await setUniversityEmail(email);
      if (result.success) {
        setMessage('✅ Email set successfully!');
        // Show success state
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to set email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="university@harvard.edu"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Setting...' : 'Set Email'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};
```

### 2. Invitation Form
```jsx
// Component for sending ambassador invitations
const InvitationForm = () => {
  const [formData, setFormData] = useState({
    ambassadorName: '',
    ambassadorEmail: '',
    universityName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await sendInvitation(formData);
      if (result.success) {
        setMessage(`✅ Invitation sent to ${result.sentTo}!`);
        // Clear form
        setFormData({ ambassadorName: '', ambassadorEmail: '', universityName: '' });
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.ambassadorName}
        onChange={(e) => setFormData({...formData, ambassadorName: e.target.value})}
        placeholder="Ambassador Name"
        required
      />
      <input
        type="email"
        value={formData.ambassadorEmail}
        onChange={(e) => setFormData({...formData, ambassadorEmail: e.target.value})}
        placeholder="ambassador@example.com"
        required
      />
      <input
        type="text"
        value={formData.universityName}
        onChange={(e) => setFormData({...formData, universityName: e.target.value})}
        placeholder="University Name (Optional)"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Invitation'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};
```

### 2b. Bulk Invitation Form
```jsx
// Component for sending bulk ambassador invitations
const BulkInvitationForm = () => {
  const [ambassadors, setAmbassadors] = useState([
    { name: '', email: '' }
  ]);
  const [universityName, setUniversityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);

  const addAmbassador = () => {
    setAmbassadors([...ambassadors, { name: '', email: '' }]);
  };

  const removeAmbassador = (index) => {
    setAmbassadors(ambassadors.filter((_, i) => i !== index));
  };

  const updateAmbassador = (index, field, value) => {
    const updated = [...ambassadors];
    updated[index][field] = value;
    setAmbassadors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResults(null);
    
    try {
      const result = await sendBulkInvitations({
        ambassadors: ambassadors.filter(amb => amb.name && amb.email),
        universityName: universityName || undefined
      });
      
      setResults(result);
      setMessage(`✅ ${result.message}`);
      
      if (result.totalSent > 0) {
        // Clear form on success
        setAmbassadors([{ name: '', email: '' }]);
        setUniversityName('');
      }
    } catch (error) {
      setMessage('❌ Failed to send bulk invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Bulk Invite Ambassadors</h3>
      
      <form onSubmit={handleSubmit}>
        {ambassadors.map((ambassador, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ambassador.name}
              onChange={(e) => updateAmbassador(index, 'name', e.target.value)}
              placeholder="Ambassador Name"
              className="flex-1"
              required
            />
            <input
              type="email"
              value={ambassador.email}
              onChange={(e) => updateAmbassador(index, 'email', e.target.value)}
              placeholder="ambassador@example.com"
              className="flex-1"
              required
            />
            {ambassadors.length > 1 && (
              <button
                type="button"
                onClick={() => removeAmbassador(index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={addAmbassador}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add Ambassador
          </button>
        </div>
        
        <input
          type="text"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          placeholder="University Name (Optional)"
          className="w-full mb-4"
        />
        
        <button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : `Send ${ambassadors.length} Invitations`}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      {results && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Results:</h4>
          <div className="space-y-1">
            {results.results.map((result, index) => (
              <div key={index} className={`p-2 rounded text-sm ${
                result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {result.name} ({result.email}) - {result.success ? '✅ Sent' : `❌ ${result.error}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 3. Email Status Check
```jsx
// Component to check if university has set email
const EmailStatus = () => {
  const [emailStatus, setEmailStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        const result = await getUniversityEmail();
        setEmailStatus(result);
      } catch (error) {
        console.error('Failed to check email status');
      } finally {
        setLoading(false);
      }
    };
    checkEmailStatus();
  }, []);

  if (loading) return <div>Checking email status...</div>;

  return (
    <div>
      {emailStatus?.hasEmail ? (
        <div>
          <p>✅ Email set: {emailStatus.email}</p>
          <InvitationForm />
          <InvitedAmbassadorsList />
        </div>
      ) : (
        <div>
          <p>❌ No email set</p>
          <EmailSetupForm />
        </div>
      )}
    </div>
  );
};
```

### 4. Invited Ambassadors List
```jsx
// Component to display invited ambassadors with status
const InvitedAmbassadorsList = () => {
  const [invitations, setInvitations] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ INVITED: 0, ACCEPTED: 0, DECLINED: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const result = await getInvitedAmbassadors();
        setInvitations(result.invitations);
        setStatusCounts(result.statusCounts);
      } catch (error) {
        console.error('Failed to fetch invitations');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      INVITED: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      DECLINED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div>Loading invitations...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Invited Ambassadors</h3>
      
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.INVITED}</div>
          <div className="text-sm text-yellow-700">Invited</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.ACCEPTED}</div>
          <div className="text-sm text-green-700">Accepted</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts.DECLINED}</div>
          <div className="text-sm text-red-700">Declined</div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ambassador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invited
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responded
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <tr key={invitation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invitation.ambassadorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invitation.ambassadorEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invitation.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invitation.invitedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invitation.respondedAt 
                    ? new Date(invitation.respondedAt).toLocaleDateString()
                    : '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 📧 Email Features

### What Happens When Invitation is Sent:
1. **Email sent from:** Your system's Gmail account
2. **Shows as:** "Harvard University" (university name)
3. **Reply-To:** University's email address
4. **Contains:** Beautiful HTML template with Accept/Decline buttons
5. **Accept link:** `http://localhost:3000/auth/signup?invitedBy=Harvard University&email=ambassador@example.com`
6. **Decline link:** `http://localhost:3000/invitation/decline?token=ambassador@example.com`
7. **Database tracking:** Invitation record created with status "INVITED"
8. **Status updates:** When ambassador accepts/declines, status updates automatically

### Email Template Features:
- 🎨 Professional HTML design
- 🎓 University branding
- 📝 Ambassador benefits list
- 🔗 Direct signup link with pre-filled data
- 📧 Reply-to university's email
- 📱 Mobile responsive

---

## 🔧 Backend Configuration Required

### Environment Variables (Backend):
```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-app-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL for signup links
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup:
1. Create Gmail account for your app
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use app password in `SMTP_PASS`

---

## 🚀 Complete Integration Flow

### Step 1: University Onboarding
1. University logs in
2. Check if email is set (`GET /university/email`)
3. If not set, show email setup form
4. If set, show invitation form

### Step 2: Sending Invitations
1. University fills invitation form
2. Send invitation (`POST /university/email/send-invitation`)
3. Show success/error message
4. Ambassador receives beautiful email with Accept/Decline buttons
5. Invitation record created in database with "INVITED" status

### Step 3: Ambassador Response
1. Ambassador clicks Accept button in email
2. Redirected to: `http://localhost:3000/auth/signup?invitedBy=Harvard University&email=ambassador@example.com`
3. Pre-fill email and university name
4. Complete signup process
5. Status automatically updates to "ACCEPTED"

### Step 4: Tracking & Management
1. University can view all invitations (`GET /university/invitations`)
2. See status counts (Invited/Accepted/Declined)
3. Track response times and ambassador details
4. Real-time status updates

---

## 📱 Frontend State Management

### Recommended State Structure:
```javascript
const universityEmailState = {
  email: null,
  hasEmail: false,
  loading: false,
  error: null
};

const invitationState = {
  sending: false,
  lastSent: null,
  error: null
};
```

### API Service Functions:
```javascript
// api/university.js
export const universityAPI = {
  // Email Management
  setEmail: (email) => fetch('/university/email/set', { method: 'POST', body: JSON.stringify({email}) }),
  getEmail: () => fetch('/university/email'),
  sendInvitation: (data) => fetch('/university/email/send-invitation', { method: 'POST', body: JSON.stringify(data) }),
  
  // Invitation Management
  getInvitations: () => fetch('/university/invitations'),
  updateInvitationStatus: (email, status) => fetch(`/university/invitations/${email}/status`, { 
    method: 'POST', 
    body: JSON.stringify({status}) 
  }),
  declineInvitation: (email) => fetch(`/university/invitations/decline?token=${email}`)
};
```

---

## 🎯 Success Metrics

### What to Track:
- Email setup completion rate
- Invitation send success rate
- Ambassador signup conversion rate
- Email bounce rate (if using analytics)

### Error Handling:
- Network errors
- Authentication errors
- Email validation errors
- Duplicate email errors

---

## 📞 Support

### Common Issues:
1. **"University email not set"** → Show email setup form
2. **"Email already taken"** → Ask for different email
3. **"Failed to send invitation"** → Check Gmail credentials
4. **"Invalid email format"** → Validate email input

### Testing:
- Use test Gmail account for development
- Test with different email providers
- Verify signup links work correctly
- Test mobile email clients

---

**Ready to integrate? Start with the Email Status component and work your way up! 🚀**
