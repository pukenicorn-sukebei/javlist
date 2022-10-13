export function replaceHost(url: string, newHost: string): string {
  const uri = new URL(url)
  const newHostUri = new URL(newHost, url) // put current url in as base path, in case new host is missing protocol

  // if both uri and new are equal, probably means newHost is a bare url
  uri.hostname =
    uri.hostname === newHostUri.hostname ? newHost : newHostUri.hostname

  return uri.toString()
}
