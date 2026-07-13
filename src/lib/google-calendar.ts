import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function createCalendarEvent(
  tokens: {
    access_token: string;
    refresh_token: string;
    expiry_date?: number;
  },
  event: {
    summary: string;
    description?: string;
    location?: string;
    start: Date;
    durationMinutes: number;
    reminders?: { minutes: number }[];
  }
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const endTime = new Date(event.start.getTime() + event.durationMinutes * 60000);

  const calendarEvent = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: event.reminders?.map((r) => ({
          method: "popup",
          minutes: r.minutes,
        })) || [
          { method: "popup", minutes: 60 },
          { method: "email", minutes: 1440 },
        ],
      },
    },
  });

  return calendarEvent.data;
}

export async function updateCalendarEvent(
  tokens: {
    access_token: string;
    refresh_token: string;
    expiry_date?: number;
  },
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    location?: string;
    start?: Date;
    durationMinutes?: number;
  }
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const requestBody: Record<string, unknown> = {};

  if (event.summary) requestBody.summary = event.summary;
  if (event.description) requestBody.description = event.description;
  if (event.location) requestBody.location = event.location;

  if (event.start) {
    const endTime = new Date(
      event.start.getTime() + (event.durationMinutes || 30) * 60000
    );
    requestBody.start = {
      dateTime: event.start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    requestBody.end = {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  const calendarEvent = await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody,
  });

  return calendarEvent.data;
}

export async function deleteCalendarEvent(
  tokens: {
    access_token: string;
    refresh_token: string;
    expiry_date?: number;
  },
  eventId: string
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });
}
