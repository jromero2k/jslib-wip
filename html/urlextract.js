"use strict" // @flow

function savedFrom( html: string ): string { // Extracts URL from `<!-- Saved from ... -->`
  console.assert( html && typeof html === "string", "!!" )
  const result = /<!--\s*(Saved\s+From|Archive processed by SingleFile\s*url)\s*:\s*([^>\s]+)/i.exec(html)
  return result && result[2] || "";
}

function baseHref( html: string ): string { // Extracts URL from `<base href="...">`
  console.assert( html && typeof html === "string", "!!" )
  const result = /<base[^>]+href\s*=\s*["']([^>"\s]+)["']/i.exec(html)
  return result && result[1] || "";
}

function canonicalHref( html: string ): string { // Extracts URL from `<link rel="canonical" href="...">`
  console.assert( html && typeof html === "string", "!!" )
  const result = /<link[^>]+rel\s*=\s*["']canonical["'][^>]+href\s*=\s*["']([^>"\s]+)["']/i.exec(html)
  return result && result[1] || "";
}

function ogUrl( html: string ): string { // Extracts URL from `<meta property="og:url" content="..." />`
  console.assert( html && typeof html === "string", "!!" );
  const result = /<meta[^>]+property\s*=\s*["']og:url["'][^>]+content\s*=\s*["']([^>"\s]+)["']/i.exec(html)
  return result && result[1] || "";
}

function iconHref( html: string ): string { // Extracts URL from `<link rel="shortcut icon" href="...">`
  console.assert( html && typeof html === "string", "!!" )
  const result = /<link[^>]+rel\s*=\s*["']shortcut\s+icon["'][^>]+href\s*=\s*["']([^>"\s]+)["']/i.exec(html)
  return result && result[1] || "";
}

export {
  savedFrom,
  baseHref,
  canonicalHref,
  ogUrl,
  iconHref,
};
