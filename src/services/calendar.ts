/**
 * Google Calendar integration (optional).
 * To enable: add Google OAuth client ID, use @react-oauth/google or similar,
 * and fetch events from Calendar API. Use scope: calendar.events.readonly.
 * Work blocks can be derived from event titles or calendar IDs and used for quiet hours.
 */

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string; // ISO
  end: string;
}

export async function fetchCalendarEvents(_accessToken: string): Promise<CalendarEvent[]> {
  // TODO: call Google Calendar API when OAuth is set up
  return [];
}
