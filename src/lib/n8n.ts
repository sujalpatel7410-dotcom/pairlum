// Fires app events at an n8n webhook so workflows (partner email notifications,
// reminders, etc.) can run outside the client. No-op if the webhook isn't configured,
// and never throws — a notification failing should never block the UI action it's tied to.

export type N8nEventType =
  | 'memory_added'
  | 'drawer_item_added'
  | 'door_opened'
  | 'chapter_added'
  | 'reunion_stop_completed'
  | 'goal_added'
  | 'promise_added'
  | 'parallel_moment_added'
  | 'daily_prompt_answered';

export interface N8nEventPayload {
  eventType: N8nEventType;
  coupleId: string;
  actorName: string;
  partnerEmail: string;
  title: string;
  subtitle?: string;
  appUrl?: string;
}

export function sendN8nEvent(payload: N8nEventPayload): void {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) return;

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Notification delivery is best-effort; swallow network/webhook errors.
  });
}
