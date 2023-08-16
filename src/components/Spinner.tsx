export const Spinner = () => {
  return (
    <svg width="12" height="12">
      <circle
        cx="6"
        cy="6"
        r="5.7"
        strokeWidth="1"
        fill="none"
        strokeDasharray="20, 200"
        className="stroke-current"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur=".75s"
          values="0 6 6;360 6 6"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  );
};
