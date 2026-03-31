import type { ProjectDetailBodyProps } from "@/pages/projects/types";

function ImgFigure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="rounded-2xl border border-border overflow-hidden bg-secondary/30">
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      {caption ? (
        <figcaption className="px-4 py-3 text-xs text-muted-foreground border-t border-border">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function GeneratedAnimationEmbed() {
  // These are produced by a build-time script (see `scripts/generate-landers-assets.mjs`).
  // Keeping them in `public/` ensures the deployed site never needs to expose raw CSVs.
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-secondary/30">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Generated Matplotlib animation</p>
        <p className="text-xs text-muted-foreground">EKF (blue) vs flight data (red)</p>
      </div>
      <div className="p-4">
        <img
          src="/projects/landers/generated/attitude_animation.gif"
          alt="Rocket attitude animation (EKF vs flight data)"
          className="w-full rounded-xl border border-border bg-black"
          loading="lazy"
        />
        <p className="text-xs text-muted-foreground mt-3">
          Animation showing a comparison between the estimate attitude of the rocket and the true attitude of the rocket.
        </p>
      </div>
    </div>
  );
}

export function PropulsiveLandersDeepDive({ project }: ProjectDetailBodyProps) {
  return (
    <div className="space-y-6">
      <GeneratedAnimationEmbed />

      <section className="card-surface p-7">
        <p className="section-label mb-3">Key Notes</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Initial Noise</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When the rocket is first launched, the model has no information about how much to trust the data coming from the sensors, and the estimate attitude is very far from the true attitude. As the simulation progresses, the filter adjusts its covariance matrix to better reflect the sensor noise and the true attitude of the rocket. 
              For non-simulated flight, the filter will be instantiated before launch and will avoid the issues of this initial noise.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Estimation under noise</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The EKF serves to take in the noisy data from the sensors and smooth it out based on patterns in the movement of the rocket, strengthening the estimate as more data is collected. An accurate EKF is critical for designing control systems that can keep the rocket stable and moving in the correct direction during flight despite outside conditions.
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface p-7">
        <p className="section-label mb-3">Source Code Excerpt</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          This model uses dynamic calculations to predict the next state of the rocket, using physics-based equations and the current state of the rocket to model the rocket's motion.
        </p>
        <pre className="rounded-2xl border border-border bg-secondary/30 p-4 overflow-auto text-xs text-foreground/80">
{`/// Discrete state transition x[k+1] = x[k] + dt * f(x[k]).
    fn state_transition_function(&self, state: &Array1<f64>, dt: f64) -> Array1<f64> {
        if !dt.is_finite() || dt <= 0.0 {
            return state.clone();
        }

        let phi = state[0];
        let theta = Self::safe_pitch(state[1]);
        let omega = [state[3], state[4], state[5]];
        let euler_dot = Self::euler_angle_rates(phi, theta, &omega);

        arr1(&[
            Self::wrap_angle(state[0] + dt * euler_dot[0]),
            Self::safe_pitch(state[1] + dt * euler_dot[1]),
            Self::wrap_angle(state[2] + dt * euler_dot[2]),
            state[3],
            state[4],
            state[5],
        ])
    }`}
        </pre>
      </section>

      <section className="card-surface p-7">
        <p className="section-label mb-3">Key contributions</p>
        <ul className="space-y-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
              <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

