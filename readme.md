# 📡 Node Observability Stack

A complete observability setup for a Node.js application using:

* **Prometheus** → Metrics
* **Loki** → Log aggregation
* **Grafana** → Visualization (metrics, logs)
* **Node.js App** → Exposes metrics + logs

This project demonstrates **modern observability practices** for Node.js, including structured logging, metrics instrumentation, and service monitoring.

---

## ✨ Features

### 📊 Metrics (Prometheus)

* Request counter
* Histogram for execution time
* Response time middleware
* `/metrics` endpoint exposed for scraping

### 🧾 Logging (Loki)

* Winston + Loki transport
* Docker container logs supported
* Queryable from Grafana

### 📈 Visualization (Grafana)

* Unified view for:

  * Metrics
  * Logs
  * Dashboards
  * Alerts (optional)

---

## 🏗 Architecture

| Component            | Purpose                          | Port            |
| -------------------- | -------------------------------- | --------------- |
| **Node Application** | API + metrics + structured logs  | **3000**        |
| **Prometheus**       | Metrics scraping & storage       | **9090**        |
| **Loki**             | Log aggregation backend          | **3100**        |
| **Grafana**          | Dashboards for metrics/logs      | **3030 → 3000** |

All services run inside Docker Compose.

---

## 🚀 Installation

### **Prerequisites**

* Docker
* Docker Compose

### **Start the entire stack**

```sh
docker compose up --build -d
```
---

## 🌐 Accessing Services

| Service               | URL                                                                         |
| --------------------- | --------------------------------------------------------------------------- |
| **Node App (API)**    | [http://localhost:3000](http://localhost:3000)                              |
| **Node Metrics**      | [http://localhost:3000/metrics](http://localhost:3000/metrics)              |
| **Prometheus UI**     | [http://localhost:9090](http://localhost:9090)                              |
| **Loki API**          | [http://localhost:3100](http://localhost:3100)                              |
| **Grafana Dashboard** | [http://localhost:3030](http://localhost:3030) (mapped to container's 3000) |


---

## 📡 API Endpoints (Node App)

### **GET /**

Basic root endpoint:

```sh
curl http://localhost:3000/
```

### **GET /slow**

Runs a simulated slow task and returns execution time:

```sh
curl http://localhost:3000/slow
```

### **GET /metrics**

Prometheus metrics endpoint:

```sh
curl http://localhost:3000/metrics
```

Returns counters, histograms, default Node metrics, etc.

---

## 📊 Observability Guide

### 🟦 Grafana Dashboards

Open Grafana:

👉 [http://localhost:3030](http://localhost:3030)

#### 1️⃣ Metrics via Prometheus

* Go to **Explore**
* Select **Prometheus** datasource
* Common queries:

  * `request_counter_total`
  * `execution_time_histogram_bucket`
  * `process_cpu_seconds_total`

#### 2️⃣ Logs via Loki

* Explore → change datasource to **Loki**
* Query logs:

```logql
{job="node-app"}
```

Or filtered by level:

```logql
{job="node-app", level="info"}
```

#### 3️⃣ Node Logs

winston sends logs 

---


## 🧪 Health Checks

Check Loki:

```
curl http://localhost:3100/ready
```

Check Prometheus scraping targets:

```
http://localhost:9090/targets
```

---

