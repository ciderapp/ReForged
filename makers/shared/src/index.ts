interface ParserVars {
  version: string | number;
  arch: string;
  targetArch: string;
  filename?: string;
}

type ForgeArch = "x64" | "arm64" | "armv7l" | "ia32" | "mips64el" | "universal";

interface PlatformArch {
  AppImage: "x86_64" | "aarch64" | "armhf" | "i686";
}

/**
 * Helper function used to parse various parts within the maker configuration.
 * @param string The string to be parsed.
 * @param {version, arch, targetArch, filename} The variables to be replaced.
 * @returns The parsed string.
 */
export function parseStr(string: string, { version, arch, targetArch, filename }: ParserVars): string {
  string = string
    .replaceAll(/{{ *version *}}/g, `${version}`)
    .replaceAll(/{{ *arch *}}/g, `${arch}`)
    .replaceAll(/{{ *node.arch *}}/g, `${targetArch}`);
  if (filename)
    string = string.replaceAll(/{{ *filename *}}/g, filename);
  return string;
}

/**
 * Maps Node.js architecture to the AppImage-friendly format.
 */
export function mapArch<T extends keyof PlatformArch>(arch: ForgeArch, maker: keyof PlatformArch): PlatformArch[T] {
  if (maker === "AppImage") {
    switch (arch) {
      /*________________________________________________________________________*/
      /*  [Forge]    :                     [AppImage]                           */
      case "x64": return "x86_64";
      case "ia32": return "i686";
      case "arm64": return "aarch64";
      case "armv7l": return "armhf";
      default: throw new Error("Unsupported architecture: '" + arch + "'.");
      /*________________________________________________________________________*/
      /*                                                                        */
    }
  } else {
    throw new Error("Unsupported maker: '" + maker + "'.");
  }
}