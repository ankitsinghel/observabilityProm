

# ✅ **STEP 1 — Add Tempo to your docker-compose.yml**

Add this service:

```yaml
tempo:
  image: grafana/tempo:latest
  container_name: tempo
  command: ["-config.file=/etc/tempo.yaml"]
  volumes:
    - ./config/tempo.yaml:/etc/tempo.yaml:ro
  ports:
    - "3200:3200"   # Tempo API
    - "4318:4318"   # OTLP HTTP endpoint
```

Also add **tempo** under depends_on of node app:

```yaml
depends_on:
  - prom-server
  - loki
  - tempo
```

---

# ✅ **STEP 2 — Create `config/tempo.yaml`**

Create this file exactly:

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        http:

ingester:
  trace_idle_period: 30s
  max_block_duration: 5m

compactor:
  compaction:
    block_retention: 1h

storage:
  trace:
    backend: local
    local:
      path: /tmp/tempo/traces
    wal:
      path: /tmp/tempo/wal
```

✔ This enables OTLP HTTP at **[http://tempo:4318/v1/traces](http://tempo:4318/v1/traces)**

---

# ✅ **STEP 3 — Install OpenTelemetry SDK in Node.js**

Run:

```
npm install @opentelemetry/api \
 @opentelemetry/sdk-node \
 @opentelemetry/sdk-trace-node \
 @opentelemetry/auto-instrumentations-node \
 @opentelemetry/exporter-trace-otlp-http
```

---

# ✅ **STEP 4 — Create `tracing.js` in your Node project**

Create a new file:

```js
// tracing.js
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const traceExporter = new OTLPTraceExporter({
  url: "http://tempo:4318/v1/traces", // important
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log("OpenTelemetry tracing started");
```

---

# ✅ **STEP 5 — Load tracing BEFORE your server**

Modify your server start command in `package.json`:

```json
"start": "node -r ./tracing.js index.js"
```

or if you run directly:

```js
require("./tracing");
require("./index");
```

---

# ✅ **STEP 6 — Rebuild & Restart Docker**

```
docker compose down
docker compose up --build -d
```

---

# ✅ **STEP 7 — Open Grafana and Add Tempo Datasource**

1. Visit Grafana → **[http://localhost:3030](http://localhost:3030)**
2. Login (admin / admin)
3. Go to **Connections → Data Sources**
4. Add **Tempo**
5. URL = `http://tempo:3200`

---

# ✅ **STEP 8 — View Your Traces**

Go to:

**Grafana → Explore → Select Tempo**
Then filter by:

```
service.name = node-app
```

You will see:

✔ request traces
✔ spans from auto-instrumentation
✔ timing of DB calls, fs, http etc.
✔ errors & latency breakdown

---

# 🎉 DONE — You now have FULL Observability

| Component  | Purpose               | URL                                            |
| ---------- | --------------------- | ---------------------------------------------- |
| Node App   | Your backend          | [http://localhost:3000](http://localhost:3000) |
| Prometheus | Metrics               | [http://localhost:9090](http://localhost:9090) |
| Loki       | Logs                  | [http://localhost:3100](http://localhost:3100) |
| Promtail   | Log collector         | (no UI)                                        |
| Grafana    | Unified observability | [http://localhost:3030](http://localhost:3030) |
| Tempo      | Tracing backend       | [http://localhost:3200](http://localhost:3200) |

---

If you want, I can generate a **complete updated docker-compose.yml** with all 5 services integrated cleanly.
