function Footer() {
  
  const styles = {
      fontFamily: "Roboto Condensed, Roboto, sans-serif"
  };
  
    return (
    <footer className="w-full py-5 bg-zinc-300 font-medium " style={styles}>
      <p className="ml-6">Coders Journey 2024. All Rights Reserved.&nbsp;  
        <span className="italic cursor-pointer">
         For More.
        </span>
        </p>
    </footer>
  );
}

export default Footer;