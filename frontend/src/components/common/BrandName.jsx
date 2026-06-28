import Logo from "../../assets/logo.jpeg";

const variantStyles = {
  navbar: {
    wrapper: "gap-2.5 sm:gap-3",
    logo: "h-11 w-auto object-contain sm:h-12",
    text: "font-brand text-lg text-red-600 sm:text-xl lg:text-2xl",
  },
  inline: {
    wrapper: "gap-1.5",
    logo: "h-5 w-auto object-contain sm:h-6",
    text: "font-brand text-base text-red-400 sm:text-lg",
  },
  inlineLight: {
    wrapper: "",
    text: "font-brand text-base text-red-600 sm:text-lg",
  },
  heading: {
    wrapper: "",
    logo: "h-6 w-auto object-contain sm:h-7",
    text: "font-brand text-2xl text-red-600 sm:text-3xl",
  },
};

const BrandName = ({ variant = "navbar", showLogo, className = "" }) => {
  const styles = variantStyles[variant] ?? variantStyles.navbar;
  const displayLogo = showLogo ?? true;

  return (
    <span
      className={`inline-flex items-center align-baseline ${styles.wrapper} ${className}`}
    >
      {displayLogo && (
        <img
          src={Logo}
          alt=""
          className={styles.logo}
          aria-hidden="true"
        />
      )}
      <span className={styles.text}>Book My Venue</span>
    </span>
  );
};

export default BrandName;
