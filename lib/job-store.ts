/**
 * In-memory job store for background persona generation
 */

export interface Job {
  id: string;
  status: "pending" | "fetching" | "analyzing" | "generating" | "formatting" | "completed" | "error";
  progress: number;
  result?: unknown;
  error?: string;
  createdAt: number;
}

// Use globalThis to persist across hot reloads in development
const globalForJobs = globalThis as unknown as {
  jobStore: Map<string, Job> | undefined;
};

export const jobStore = globalForJobs.jobStore ?? new Map<string, Job>();

if (process.env.NODE_ENV !== "production") {
  globalForJobs.jobStore = jobStore;
}

export function createJob(id: string): Job {
  const job: Job = {
    id,
    status: "pending",
    progress: 0,
    createdAt: Date.now(),
  };
  jobStore.set(id, job);

  // Clean up old jobs (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [jobId, job] of jobStore.entries()) {
    if (job.createdAt < oneHourAgo) {
      jobStore.delete(jobId);
    }
  }

  return job;
}

export function getJob(id: string): Job | undefined {
  return jobStore.get(id);
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const job = jobStore.get(id);
  if (job) {
    Object.assign(job, updates);
  }
}

export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
