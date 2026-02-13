# RabbitMQ + Node.js Learning Project

A didactic project to learn the basics of message queues with RabbitMQ and Node.js. This app demonstrates the producer-consumer pattern: it publishes messages to a queue via an HTTP endpoint and processes them asynchronously in the background.

## Prerequisites

- **Node.js** 18+ (or Bun)
- **Docker**

## Running RabbitMQ

Start RabbitMQ with the project's `docker-compose.yml`:

```bash
docker-compose up -d
```

- `5672` – AMQP protocol (used by the app)
- `15672` – Management UI (optional, open http://localhost:15672, user/pass: `guest`/`guest`)

## Installation

```bash
# Install dependencies
npm install
# or
bun install
```

## Running the Project

```bash
# Development (with hot reload)
npm run dev
# or
bun run dev
```

The server starts at `http://localhost:3000`.

## Testing the Email Queue

### Step 1: Start the server

Make sure the app is running and RabbitMQ is connected. You should see:

```
Connected to RabbitMQ
Server running on http://localhost:3000
```

### Step 2: Send a message to the queue

Use `curl` (or Postman) to post a message:

```bash
curl -X POST http://localhost:3000/email \
  -H "Content-Type: application/json" \
  -d '{"message": "Welcome to RabbitMQ!"}'
```

**Expected response:**

```json
{
  "message": "Email sent to the queue"
}
```

### Step 3: Watch the consumer process the message

In the server terminal you should see:

1. Right after the request: `Message sent to email: {"message":"Welcome to RabbitMQ!"}`
2. After about 5 seconds (simulated email send):  
   `Received message from email queue: ...`  
   `Email sent to the user: {"message":"Welcome to RabbitMQ!"}`  
   `Date: 2025-02-13T...`

The 5-second delay simulates sending an email. The consumer processes one message at a time (`prefetch(1)`).

### Step 4: Send multiple messages

```bash
# Send several messages quickly
curl -X POST http://localhost:3000/email -H "Content-Type: application/json" -d '{"message": "First email"}'
curl -X POST http://localhost:3000/email -H "Content-Type: application/json" -d '{"message": "Second email"}'
curl -X POST http://localhost:3000/email -H "Content-Type: application/json" -d '{"message": "Third email"}'
```

Messages are queued and processed sequentially. Each one takes about 5 seconds.

## Project Structure

```
src/
├── consumers/           # Queue consumers (process messages)
│   ├── consumers.ts     # Starts all consumers
│   └── emailConsumer.ts # Consumes the "email" queue
├── lib/
│   └── rabbitmq.ts      # RabbitMQ connection, channel, sendMessage
├── routes/
│   ├── router.ts        # Express router
│   └── email.route.ts   # POST /email – publishes to queue
├── constants.ts         # Queue names
└── index.ts             # App entry point
```

## Flow Diagram

```
┌─────────────┐     POST /email      ┌─────────────┐     publish      ┌──────────────┐
│   Client    │ ──────────────────► │  Express    │ ───────────────► │   RabbitMQ   │
│  (curl)     │                     │  (Producer) │                  │   "email"    │
└─────────────┘                     └─────────────┘                  │    queue     │
                                                                     └──────┬───────┘
                                                                            │ consume
                                                                            ▼
                                                                     ┌──────────────┐
                                                                     │   Consumer   │
                                                                     │ (emailConsumer)
                                                                     └──────────────┘
```

## Environment Variables

| Variable      | Default              | Description                    |
|---------------|----------------------|--------------------------------|
| `PORT`        | `3000`               | Express server port            |
| `RABBITMQ_URL`| `amqp://localhost:5672` | RabbitMQ connection URL     |

## License

ISC
