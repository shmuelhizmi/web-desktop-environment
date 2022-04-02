import { useTheme as useThemeBse } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

export function useTheme(): Theme {
	return useThemeBse();
}
