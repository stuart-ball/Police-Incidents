﻿import { ITheme } from "../../providers/ITheme";

import { createUseStyles } from "react-jss";
export const useStyles = createUseStyles((theme: ITheme) => {
    return {
        container: {
            "& mgt-people-picker": {
                "--input-border": "none",
            },
        },
    };
});
