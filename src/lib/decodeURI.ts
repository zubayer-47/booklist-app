export default function decodeURI(str: string) {
  return decodeURIComponent(str.replace(/\+/g, " "));
}
