# DSLR Booth Event Logging - Desktop App Integration TODO

## Overview
The desktop booth application needs to send event logs to our backend API to track booth sessions and user interactions. Each booth session should be tracked from start to finish with a unique session ID.

## Implementation Requirements

### 1. Session ID Generation
- **Desktop app generates unique string** for each new booth session
- Use any format you prefer (GUID, timestamp-based, custom format)
- **No UUID format requirement** - any unique string works
- Generate **once** when `session_start` event occurs
- Use the **same session ID** for all events in that session until `session_end`

```csharp
// Example (C# code)
string sessionId = Guid.NewGuid().ToString(); // Standard GUID
// OR
string sessionId = $"session-{DateTime.Now:yyyyMMdd-HHmmss}-{Environment.MachineName}"; // Custom format
// OR  
string sessionId = "booth1-" + DateTimeOffset.Now.ToUnixTimeSeconds(); // Timestamp-based
```

### 2. Event Logging API

**Endpoint:** `POST /logs/booth/event`
**Authentication:** Public endpoint (no auth required for now)
**Content-Type:** `application/json`

**Request Body Format:**
```json
{
  "sessionId": "any-unique-string-format",
  "boothEvent": {
    "event_type": "session_start",
    "param1": "PrintAndGIF",
    "param2": "optional",
    "param3": "optional", 
    "param4": "optional",
    "timestamp": "16:20:7.287"
  },
  "eventId": "event-uuid-from-qr-code",
  "qrCodeId": "qr-code-uuid",
  "boothIdentifier": "Booth-1"
}
```

**Response:**
```json
{
  "logId": "log-uuid",
  "message": "Booth event session_start logged successfully"
}
```

### 3. Required Event Types

The desktop app should send these events in sequence:

| Event Type | Description | Required Params |
|------------|-------------|-----------------|
| `session_start` | When booth session begins | `param1` = booth mode (e.g., "PrintAndGIF") |
| `countdown_start` | When countdown timer starts | `param1` = seconds (e.g., "5") |
| `countdown` | Countdown progress updates | `param1` = percent complete (e.g., "20", "50", "100") |
| `capture_start` | When camera capture begins | None |
| `file_download` | When photo downloaded from camera | `param1` = filename |
| `processing_start` | When photo processing starts | `param1` = original files, `param2` = final file |
| `sharing_screen` | When sharing screen is displayed | None |
| `printing` | When printing starts | `param1` = file path, `param2` = copies, `param3` = printer name |
| `file_upload` | When file uploaded to cloud | `param1` = file path, `param2` = URL, `param3` = file type, `param4` = album name |
| `session_end` | When session completes | None |

### 4. Timestamp Format
- Use format: `"HH:MM:SS.mmm"` (e.g., `"16:20:7.287"`)
- Should match the desktop app's internal timing
- Used for event sequencing and debugging

### 5. Offline Handling (Important!)

**The API calls may fail due to network issues. Desktop app should:**

1. **Queue events locally** when API calls fail
2. **Retry failed events** when connection is restored
3. **Maintain session ID** across retries
4. **Send events in chronological order** when uploading queued events

```csharp
// Example offline handling (C#)
private readonly Queue<EventData> eventQueue = new Queue<EventData>();

private async Task LogEventAsync(EventData eventData)
{
    try
    {
        var response = await httpClient.PostAsJsonAsync("/logs/booth/event", eventData);
        response.EnsureSuccessStatusCode();
    }
    catch (Exception ex)
    {
        // Store for retry
        eventQueue.Enqueue(eventData);
        Console.WriteLine($"Failed to log event, queued for retry: {ex.Message}");
    }
}

// Retry mechanism
private async Task RetryQueuedEventsAsync()
{
    while (eventQueue.Count > 0)
    {
        var eventData = eventQueue.Dequeue();
        try
        {
            await LogEventAsync(eventData);
        }
        catch (Exception)
        {
            // Put back at front and try again later
            var tempQueue = new Queue<EventData>();
            tempQueue.Enqueue(eventData);
            while (eventQueue.Count > 0)
                tempQueue.Enqueue(eventQueue.Dequeue());
            eventQueue.Clear();
            while (tempQueue.Count > 0)
                eventQueue.Enqueue(tempQueue.Dequeue());
            break;
        }
    }
}
```

### 6. Required Data Context

For each API call, include:
- `sessionId` - Desktop-generated unique string (any format)
- `eventId` - From QR code scan (if available)
- `qrCodeId` - From QR code scan (if available)
- `boothIdentifier` - Unique identifier for this physical booth (e.g., "Booth-1", "Main-Booth")

### 7. Error Handling

**API may return these HTTP status codes:**
- `201` - Success
- `400` - Bad request (invalid data format)
- `422` - Validation error (missing required fields)
- `500` - Server error

**Desktop app should:**
- Log API errors locally for debugging
- Continue booth operation even if logging fails
- Retry failed events when possible

### 8. Example Session Flow (C#)

```csharp
public class BoothEventLogger
{
    private readonly HttpClient httpClient;
    private string currentSessionId;
    
    public async Task StartSessionAsync(string boothMode)
    {
        // Generate session ID (any format works)
        currentSessionId = $"booth1-{DateTime.Now:yyyyMMdd-HHmmss}-{Guid.NewGuid():N}";
        
        await LogEventAsync(new
        {
            sessionId = currentSessionId,
            boothEvent = new
            {
                event_type = "session_start",
                param1 = boothMode,
                timestamp = GetCurrentTimestamp()
            },
            eventId = GetEventId(), // From QR code
            qrCodeId = GetQrCodeId(), // From QR code
            boothIdentifier = "Booth-1"
        });
    }
    
    public async Task LogCountdownStartAsync(int seconds)
    {
        await LogEventAsync(new
        {
            sessionId = currentSessionId,
            boothEvent = new
            {
                event_type = "countdown_start",
                param1 = seconds.ToString(),
                timestamp = GetCurrentTimestamp()
            },
            boothIdentifier = "Booth-1"
        });
    }
    
    // ... other event methods
    
    private string GetCurrentTimestamp()
    {
        var now = DateTime.Now;
        return $"{now.Hour}:{now.Minute}:{now.Second}.{now.Millisecond}";
    }
}
```

## Validation Requirements

The API validates:
- `sessionId` - Must be a non-empty string (any format)
- `event_type` - Must be one of the predefined event types
- `timestamp` - Must be provided (string format)
- `eventId`, `qrCodeId` - Must be valid UUIDs if provided
- All fields must match expected data types

## Testing

**Test the integration by:**
1. Running a complete booth session with various sessionId formats
2. Checking that all events are logged in sequence
3. Testing offline scenarios (disconnect internet mid-session)
4. Verifying session ID consistency across all events
5. Testing with different sessionId formats (GUID, custom strings, etc.)

## Questions?

Contact the backend team if you need:
- API endpoint changes
- Additional event types
- Error handling clarifications
- Testing assistance

---
**Note:** This is the initial implementation. Authentication and additional security measures will be added later.

**SessionId Format:** Any unique string format is accepted - use whatever works best for your C# application!
