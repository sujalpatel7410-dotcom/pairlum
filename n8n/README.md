# n8n integration

Pairlum has no backend of its own — the app runs entirely in the browser. To let
n8n react to what a couple does (a new memory, a sealed drawer item, the door
being opened), the app posts a small JSON event directly to an n8n webhook.

## Setup

1. In n8n, go to **Workflows → Import from File** and import
   `pairlum-notifications.workflow.json`.
2. Open the **Email Partner** node and attach your own SMTP credential (or swap
   the node for a Gmail/SendGrid node if you'd rather use those).
3. **Activate** the workflow, then open the **Pairlum Event Webhook** node and
   copy its *Production URL*.
4. In the app, set `VITE_N8N_WEBHOOK_URL` (see `.env.example`) to that URL and
   rebuild/restart the dev server. Leave it unset to disable notifications
   entirely — the app skips the call silently.

## Events sent

The app calls `sendN8nEvent` (`src/lib/n8n.ts`) from every couple action in
`src/context/PairlumContext.tsx` that's worth telling a partner about:

| eventType                | Fired from          | When                                             |
|---------------------------|----------------------|----------------------------------------------------|
| `memory_added`             | `addMemory`           | A new memory is added to The Wall                 |
| `drawer_item_added`        | `addDrawerItem`        | A letter/promise/capsule is sealed                |
| `door_opened`               | `openTheDoor`           | The reunion door is opened                        |
| `chapter_added`            | `addChapter`           | A new chapter is started on Our Shelf              |
| `reunion_stop_completed`   | `toggleReunionStop`     | A reunion roadmap step is checked off (not un-checked) |
| `goal_added`                | `addGoal`               | A new shared goal is created                       |
| `promise_added`            | `addPromise`            | A promise is made                                  |
| `parallel_moment_added`    | `addParallelMoment`      | A parallel moment is captured together             |
| `daily_prompt_answered`    | `answerDailyPrompt`      | Either partner answers today's daily prompt        |

Each event posts:

```json
{
  "eventType": "memory_added",
  "coupleId": "...",
  "actorName": "Emma",
  "partnerEmail": "liam@example.com",
  "title": "...",
  "subtitle": "...",
  "appUrl": "..."
}
```

The bundled workflow formats a subject/body per `eventType` and emails
`partnerEmail`. All events share the same generic body template, so the
`Format Notification` node only needs a new entry in its subject map — to add
another event (e.g. a goal reaching its target), call `sendN8nEvent` from
wherever that action happens and add the corresponding branch there.
