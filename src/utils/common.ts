export const setFontSize: () => void = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let fontSize = (width * 16) / 375;
  fontSize = fontSize > 24 ? 24 : fontSize;
  document.documentElement.style.fontSize = `${fontSize}px`;
};
