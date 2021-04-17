import("@web-desktop-environment/app-sdk").then(({ keepOpen }) => keepOpen());
import("@apps/media/MediaPlayer").then(({ registerApp }) => registerApp());
import("@apps/system/Settings").then(({ registerApp }) => registerApp());
import("@apps/utils/Explorer").then(({ registerApp }) => registerApp());
import("@apps/utils/Notepad").then(({ registerApp }) => registerApp());
import("@apps/utils/Terminal").then(({ registerApp }) => registerApp());
