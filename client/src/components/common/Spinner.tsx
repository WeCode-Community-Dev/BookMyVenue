interface SpinnerProps {
  size?: string;
}

const Spinner = ({ size = 'h-4 w-4' }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-block ${size} shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent`}
  />
);

export default Spinner;
