// Single "environment config" this project needs — no .env/react-native-config,
// since there are no secrets and no multi-environment deployment in this scope.
export const USE_MOCK_SERVER = true;
export const MOCK_SERVER_DELAY_MS = 300; // simulate network latency for perf benchmarks