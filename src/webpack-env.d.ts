// Types for `require.context`, which the Remotion bundler (webpack/rspack) provides.
declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp,
    ): {
      keys(): string[];
      (id: string): unknown;
    };
  }
}
