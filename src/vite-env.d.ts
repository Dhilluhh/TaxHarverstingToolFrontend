/// <reference types="vite/client" />

// Teach TypeScript how to handle CSS Module imports.
// Without this, TS errors with "Cannot find module '*.module.css'"
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
