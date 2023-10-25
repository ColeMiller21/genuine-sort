import {
  LucideProps,
  Moon,
  SunMedium,
  Wallet,
  Loader2,
  Camera,
} from "lucide-react";

export const Icons = {
  loader: Loader2,
  sun: SunMedium,
  wallet: Wallet,
  moon: Moon,
  camera: Camera,
  discord: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-0.5 -0.5 14 14"
      {...props}
    >
      <g id="discord">
        <path
          id="Ellipse 1140"
          stroke="currentColor"
          d="M3.818 6.036a0.464 0.464 0 1 0 0.929 0 0.464 0.464 0 1 0 -0.929 0"
          strokeWidth="1"
        ></path>
        <path
          id="Ellipse 1141"
          stroke="currentColor"
          d="M7.997 6.036a0.464 0.464 0 1 0 0.929 0 0.464 0.464 0 1 0 -0.929 0"
          strokeWidth="1"
        ></path>
        <path
          id="Vector 597"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0.797 9.159c0 -2.229 0.797 -5.176 1.593 -6.371 0 0 0.797 -0.398 3.983 -0.398 3.185 0 3.982 0.399 3.982 0.399 0.797 1.194 1.593 4.14 1.593 6.37 -0.266 0.399 -1.195 1.275 -2.788 1.593l-1.402 -1.751a6.116 6.116 0 0 1 -2.772 0L3.584 10.753c-1.593 -0.319 -2.522 -1.195 -2.788 -1.593Z"
          strokeWidth="1"
        ></path>
        <path
          id="Vector 598"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.584 8.364c0.242 0.242 0.752 0.486 1.401 0.638a6.116 6.116 0 0 0 2.773 0c0.649 -0.152 1.158 -0.396 1.401 -0.638"
          strokeWidth="1"
        ></path>
      </g>
    </svg>
  ),

  x: (props: LucideProps) => (
    <svg
      {...props}
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.390625"
        y="0.917969"
        width="40"
        height="40"
        fill="currentColor"
        fillOpacity="0.01"
      />
      <path
        d="M6.73543 7.79297L17.4388 23.0836L6.66797 35.5156H9.09225L18.5223 24.631L26.1413 35.5156H34.3906L23.0848 19.3651L33.1103 7.79297H30.6861L22.0017 17.8172L14.9848 7.79297H6.73543ZM10.3004 9.70069H14.0901L30.8252 33.6079H27.0354L10.3004 9.70069Z"
        fill="currentColor"
      />
    </svg>
  ),
};
