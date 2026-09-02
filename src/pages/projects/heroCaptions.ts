/* Captions for the hero figure at the top of each project page, keyed by slug.
   Falls back to the project's result line when a slug has no entry. */
export const heroCaptions: Record<string, string> = {
  "build-rl-environments":
    "SupChain-Bench open on the Build canvas. The block tray sits on the left; the environment's block tree, with its Tasks, Scoring groups, and Tools, fills the right.",
  benchception:
    "The leaderboard after the full pipeline ran: three Qwen-8B students, two trained on model-authored environments and one untrained, tied on the held-out Supply Chain Bench.",
  "propulsive-landers-gnc":
    "Error-state EKF replay at real-time speed, EKF (blue) vs flight data (red). The estimated attitude (blue outline) tracks the true attitude (red core) closely enough that the two rockets overlap for the entire flight, averaging 0.17 degrees of attitude error over a 23 second replay.",
  "m3-math-modeling-champion":
    "The team at the M3 Challenge finals in New York City, where the model was presented to a panel of Ph.D. mathematicians.",
};

/* Mono note shown beside the figure label, e.g. "screenshot" or "replay". */
export const heroNotes: Record<string, string> = {
  "build-rl-environments": "screenshot",
  benchception: "screenshot",
  "propulsive-landers-gnc": "replay",
  "m3-math-modeling-champion": "photo",
};
