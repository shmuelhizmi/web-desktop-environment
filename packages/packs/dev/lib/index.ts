import("@web-desktop-environment/app-sdk").then(({ keepOpen }) => keepOpen());
import("./apps/VisualStudioCode").then(({ registerApp }) => registerApp());
