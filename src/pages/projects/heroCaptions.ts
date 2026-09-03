/* Captions for the hero figure at the top of each project page, keyed by slug.
   Falls back to the project's result line when a slug has no entry. */
export const heroCaptions: Record<string, string> = {
  "build-rl-environments":
    "An environment open on the Build canvas: here, SupChain-Bench. The block tray sits on the left; on the right, an Environment block, a Taskset of Tasks (each with a Question and a Scoring group of Good and Bad answers), and a column of Tool blocks, every one describing its goal, inputs, and outputs in plain language.",
  benchception:
    "The leaderboard after the full pipeline ran: three Qwen-8B students, two trained on model-authored environments and one untrained, tied on the held-out Supply Chain Bench.",
  "propulsive-landers-gnc":
    "Error-state EKF replay at real-time speed, EKF (blue) vs flight data (red). The estimated attitude (blue outline) tracks the true attitude (red core) closely enough that the two rockets overlap for the entire flight, averaging 0.17 degrees of attitude error over a 23 second replay.",
  "m3-math-modeling-champion":
    "The team at the M3 Challenge finals in New York City, where the model was presented to a panel of Ph.D. mathematicians.",
};

/* Heroes that are small renders (not photos or wide screenshots) sit at their
   natural size on dot-grid paper rather than being stretched to the frame. */
export const heroInset = new Set(["benchception", "propulsive-landers-gnc"]);

/* Mono note shown beside the figure label, e.g. "screenshot" or "replay". */
export const heroNotes: Record<string, string> = {
  "build-rl-environments": "build.transpiralabs.com",
  benchception: "screenshot",
  "propulsive-landers-gnc": "replay",
  "m3-math-modeling-champion": "photo",
};

/* Where each project's static media sits relative to the interactive
   figure (always Fig. 1): "after" as Fig. 2, "end" as the last figure,
   or "none" when the interactive figure already shows the same thing. */
export const heroPlacement: Record<string, "after" | "end" | "none"> = {
  "build-rl-environments": "after",
  benchception: "none",
  "propulsive-landers-gnc": "after",
  "m3-math-modeling-champion": "end",
};
export const heroLabels: Record<string, string> = {
  "build-rl-environments": "Fig. 2",
  "propulsive-landers-gnc": "Fig. 2",
  "m3-math-modeling-champion": "Fig. 6",
};

/* Optional width cap for the static media when it is a photo that reads
   better small than stretched across the column. */
export const heroWidth: Record<string, string> = {
  "m3-math-modeling-champion": "mx-auto max-w-[34rem]",
};
