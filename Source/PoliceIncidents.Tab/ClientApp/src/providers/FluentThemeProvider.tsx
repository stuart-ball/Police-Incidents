import * as React from "react";
import { Provider, teamsDarkV2Theme, teamsHighContrastTheme, teamsV2Theme, ThemePrepared } from "@fluentui/react-northstar";
import { ThemeProvider } from "react-jss";
import * as microsoftTeams from "@microsoft/teams-js";
import { GlobalContext } from "./GlobalContextProvider";

function FluentThemeProvider(props: any) {
    const ctx = React.useContext(GlobalContext);
    const [themeName, setThemeName] = React.useState(ctx.teamsContext.theme);

    React.useEffect(() => {
        microsoftTeams.registerOnThemeChangeHandler((theme) => {
            setThemeName(theme);
        });
    }, []);

    let theme: ThemePrepared<any> = teamsV2Theme;
    let mtgThemeRootClass = "mgt-dark";
    if (themeName === "dark") {
        theme = teamsDarkV2Theme;
    } else if (themeName === "contrast") {
        theme = teamsHighContrastTheme;
    } else {
        mtgThemeRootClass = "mgt-light";
    }
    return (
        <Provider theme={theme}>
            <ThemeProvider theme={theme}>
                <div className={mtgThemeRootClass}>{props.children}</div>
            </ThemeProvider>
        </Provider>
    );
}

export default FluentThemeProvider;
