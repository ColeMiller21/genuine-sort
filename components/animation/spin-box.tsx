import { motion } from "framer-motion";

type BoxProps = {
  front: string;
  bottom: string;
  back: string;
  top: string;
};

export function SpinBox() {
  return (
    <div className="flex flex-col px-4 py-12">
      <SpinningBoxText />
    </div>
  );
}

const SpinningBoxText = () => {
  return (
    <span className="flex flex-col items-center justify-center gap-6 text-4xl font-semibold md:gap-4">
      <h2 className={`text-[3rem] lg:text-[4.5rem] leading-none font-didot`}>
        <i>GENUINE</i>
      </h2>
      <h2 className="font-teko text-[7rem] lg:text-[10rem] font-extrabold my-4 lg:my-8">
        GALLERY
      </h2>
      <Box front="COLLECT" bottom="CURATE" back="SHARE" top="REPEAT" />
    </span>
  );
};

const Box = ({ front, bottom, back, top }: BoxProps) => {
  return (
    <motion.span
      className="relative h-[3rem] w-60 font-black uppercase text-medium"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center -40px",
      }}
      initial={{ rotateX: "0deg" }}
      animate={{
        rotateX: [
          "0deg",
          "90deg",
          "90deg",
          "180deg",
          "180deg",
          "270deg",
          "270deg",
          "360deg",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 10,
        ease: "backInOut",
        times: [0, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75, 1],
      }}
    >
      {/* FRONT */}
      <span className="absolute flex h-full w-full items-center justify-center border-2 border-primary bg-background">
        {front}
      </span>

      {/* BOTTOM */}
      <span
        style={{ transform: "translateY(3rem) rotateX(-90deg)" }}
        className="absolute flex h-full w-full origin-top items-center justify-center border-2 border-primary bg-background"
      >
        {bottom}
      </span>

      {/* TOP */}
      <span
        style={{ transform: "translateY(-3rem) rotateX(90deg)" }}
        className="absolute flex h-full w-full origin-bottom items-center justify-center border-2 border-primary bg-background"
      >
        {top}
      </span>

      {/* BACK */}
      <span
        style={{
          transform: "translateZ(-3rem) rotateZ(-180deg) rotateY(180deg)",
        }}
        className="absolute flex h-full w-full origin-center items-center justify-center border-2 border-primary bg-background"
      >
        {back}
      </span>
    </motion.span>
  );
};
