import("@web-desktop-environment/app-sdk").then(({ keepOpen }) => keepOpen());
import("@apps/Hamsters").then(({ registerApp }) => registerApp());
