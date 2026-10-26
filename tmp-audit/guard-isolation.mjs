import { withWordPressSlot } from "../src/lib/wordpress-fetch-guard.ts";

let inflight = 0;
let maxInflight = 0;

const tasks = Array.from({ length: 6 }, (_, index) =>
  withWordPressSlot(async () => {
    inflight += 1;
    maxInflight = Math.max(maxInflight, inflight);
    await new Promise((resolve) => setTimeout(resolve, 40));
    inflight -= 1;
    if (index === 0) throw new Error("staging unavailable");
    return index;
  }),
);

const settled = await Promise.allSettled(tasks);
const rejected = settled.filter((result) => result.status === "rejected").length;
const fulfilled = settled.filter((result) => result.status === "fulfilled").length;
if (maxInflight > 4 || rejected !== 1 || fulfilled !== 5) {
  console.error(JSON.stringify({ maxInflight, rejected, fulfilled }));
  process.exit(1);
}
console.log(JSON.stringify({ maxInflight, rejected, fulfilled }));
