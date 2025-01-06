function Footer() {
  const styles = {
    fontFamily: "Roboto Condensed, Roboto, sans-serif",
  };

  return (
    <footer
      className="w-full py-6 bg-gradient-to-r from-slate-600 to-slate-800 text-white font-medium shadow-lg"
      style={styles}
    >
      <p className="ml-6 text-base md:text-lg">
        © GET. All Rights Reserved. &nbsp;
        <span
          className="italic underline cursor-pointer hover:text-blue-400 transition-colors duration-300"
          onClick={() => window.open("https://github.com/kalisurf3r/GET-frontend", "_blank")}
        >
          For More
        </span>
      </p>
    </footer>
  );
}

export default Footer;
