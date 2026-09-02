import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import { CodeBlock, Highlights, P, SectionHeading } from "@/components/casestudy";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// The ES-EKF replay GIF (rendered by rust-ekf/src/testing/ekf_attitude_gif.py
// in the MonopropUAV repo and committed to public/projects/landers/generated)
// is the project's hero figure, so the page header shows it once with its
// caption and the body picks up from there.

const EKF_EXCERPT = `/// Nominal state: [px, py, pz, vx, vy, vz, qw, qx, qy, qz, abx, aby, abz, wbx, wby, wbz]
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
}`;

export function PropulsiveLandersDeepDive({ project }: ProjectDetailBodyProps) {
  return (
    <div className="max-w-[52rem]">
      <section>
        <SectionHeading eyebrow="Key notes" title="How the filter is built" />
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
              Error-state formulation
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The filter tracks a 16-dimensional nominal state (position, velocity, attitude quaternion, and
              accelerometer and gyroscope biases) and estimates a 15-dimensional error state around it. The
              quaternion is corrected multiplicatively, which keeps it unit-length by construction and avoids the
              gimbal lock and linearization issues of Euler-angle filters. Process noise is built directly from the
              VN-200 IMU datasheet: accelerometer and gyroscope noise densities plus bias instability terms, scaled
              by the actual sample period.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
              Yaw observability
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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

      <motion.section {...reveal} className="mt-20">
        <SectionHeading eyebrow="Source code excerpt" title="The fast loop" />
        <P className="mt-5">
          The fast loop integrates raw IMU data through the nonlinear kinematics to propagate the nominal state,
          while the error covariance is propagated separately through a linearized transition matrix.
        </P>
        <CodeBlock className="mt-6" title="rust-ekf · nominal_prediction" lang="Rust" code={EKF_EXCERPT} />
      </motion.section>

      <motion.section {...reveal} className="mt-20">
        <Highlights items={project.highlights} />
      </motion.section>
    </div>
  );
}
