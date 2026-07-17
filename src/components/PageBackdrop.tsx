import { motion, useScroll, useTransform } from "framer-motion";
import heroStars from "@/assets/hero-stars.jpg";
import contactRiver from "@/assets/contact-river.jpg";

/* A fixed backdrop behind the whole page: the night sky at the top
   cross-fades into the river as the page scrolls. A background-colored
   scrim stays heavy through the content sections so text reads cleanly,
   easing off at the very top and bottom where the photos lead. */
const PageBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const starsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const riverOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.48, 0.94, 0.94, 0.72]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <motion.img
        src={heroStars}
        alt=""
        style={{ opacity: starsOpacity }}
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <motion.img
        src={contactRiver}
        alt=""
        style={{ opacity: riverOpacity }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div className="absolute inset-0 bg-background" style={{ opacity: scrimOpacity }} />
    </div>
  );
};

export default PageBackdrop;
