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
  // Rendered by rust-ekf/src/testing/ekf_attitude_gif.py in the MonopropUAV repo
  // and committed here, so the deployed site never needs to run Python or expose raw CSVs.
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-secondary/30">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Error-state EKF replay, real-time speed</p>
        <p className="text-xs text-muted-foreground">EKF (blue) vs flight data (red)</p>
      </div>
      <div className="p-4">
        <img
          src="/projects/landers/generated/esekf_attitude.gif"
          alt="Rocket attitude animation comparing the error-state EKF estimate against flight data"
          className="w-full rounded-xl border border-border bg-black"
          loading="lazy"
        />
        <p className="text-xs text-muted-foreground mt-3">
          The estimated attitude (blue outline) tracks the true attitude (red core) closely enough that the two
          rockets overlap for the entire flight, averaging 0.17 degrees of attitude error over a 23 second replay.
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
            <h3 className="text-base font-semibold text-foreground mb-2">Error-state formulation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The filter tracks a 16-dimensional nominal state (position, velocity, attitude quaternion, and
              accelerometer and gyroscope biases) and estimates a 15-dimensional error state around it. The
              quaternion is corrected multiplicatively, which keeps it unit-length by construction and avoids the
              gimbal lock and linearization issues of Euler-angle filters. Process noise is built directly from the
              VN-200 IMU datasheet: accelerometer and gyroscope noise densities plus bias instability terms, scaled
              by the actual sample period.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Yaw observability</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              GPS position alone cannot observe rotation about the vertical axis, so yaw slowly drifts as gyro bias
              integrates uncorrected. Fusing the magnetometer against the known local magnetic field closes that
              gap. Replay testing also exposed a subtle tuning bug: an inflated initial bias covariance let
              measurement updates swing the bias estimates and pump error into the one direction a magnetometer
              cannot see. Bounding the initial covariance to realistic sensor bias scales cut the average deviation
              from ground truth to 0.14 percent.
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface p-7">
        <p className="section-label mb-3">Source Code Excerpt</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The fast loop integrates raw IMU data through the nonlinear kinematics to propagate the nominal state,
          while the error covariance is propagated separately through a linearized transition matrix.
        </p>
        <pre className="rounded-2xl border border-border bg-secondary/30 p-4 overflow-auto text-xs text-foreground/80">
{`/// Nominal state: [px, py, pz, vx, vy, vz, qw, qx, qy, qz, abx, aby, abz, wbx, wby, wbz]
fn nominal_prediction(&self, state: &Array1<f64>, imu: &[f64], dt: f64) -> Array1<f64> {
    // Remove estimated biases from the raw IMU measurements
    let a_body = a_measured - a_bias;
    let w_body = w_measured - w_bias;

    // Rotate specific force into the world frame and remove gravity
    let gravity = Vector3::new(0.0, 0.0, 9.81);
    let a_world = quat.transform_vector(&a_body) - gravity;

    let next_pos = pos + vel * dt + 0.5 * a_world * dt * dt;
    let next_vel = vel + a_world * dt;

    // Quaternion integration via the exponential map
    let q_update = UnitQuaternion::from_scaled_axis(w_body * dt);
    let next_quat = quat * q_update;
    // ...
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
