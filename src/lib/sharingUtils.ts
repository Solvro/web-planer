function encodeToBase64(input: string) {
  return btoa(unescape(encodeURIComponent(input)));
}

function decodeFromBase64(encoded: string) {
  return decodeURIComponent(escape(atob(encoded)));
}

export { encodeToBase64, decodeFromBase64 };
