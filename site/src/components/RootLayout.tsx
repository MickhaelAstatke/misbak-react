//@ts-nocheck
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { isMobile } from "react-device-detect";
import { WeekEnum } from "../Helpers/WeekEnum";
import {
  AppBar,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import TableRowsIcon from "@mui/icons-material/TableRows";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Menu from "@mui/material/Menu";
import { Primary } from "../Helpers/Primary";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function RootLayout() {
  const params = useParams();
  const navigate = useNavigate();
  const [week, setWeek] = useState(params.week);
  const handleWeekChange = (event: SelectChangeEvent) => {
    setWeek(event.target.value);
    console.log(`navigating /${event.target.value}/${day}`);
    navigate(`/${event.target.value}/${day}`);
  };

  const [day, setDay] = useState(params.day);
  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value);
    console.log(`navigating /${week}/${event.target.value}`);
    navigate(`/${week}/${event.target.value}`);
  };

  const selectedWeek = Primary.find((item) => {
    return item.key == week;
  });

  const [layout, setLayout] = useState<string | null>(
    localStorage.getItem("view-layout") || "no-split-rows"
  );

  const handleLayout = (
    event: React.MouseEvent<HTMLElement>,
    newLayout: string | null
  ) => {
    console.log(newLayout);
    localStorage.setItem("view-layout", newLayout);
    setLayout(newLayout);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <Grid
            container
            // spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {!isMobile && (
              <Grid item container md={4} xs={12} direction="row">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>

                <h1>ምስባክ</h1>
              </Grid>
            )}
            <Grid item md={4} xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="week-label">Week</InputLabel>
                <Select
                  labelId="week"
                  id="week"
                  value={week}
                  label="Week"
                  onChange={handleWeekChange}
                >
                  {Primary.map((ww) => {
                    return (
                      <MenuItem key={ww.key} value={ww.key}>
                        {ww.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="day-label">Day</InputLabel>
                <Select
                  labelId="day"
                  id="day"
                  value={day}
                  label="Age"
                  onChange={handleDayChange}
                >
                  {selectedWeek?.child.map((dd) => {
                    return (
                      <MenuItem key={dd.key} value={dd.key}>
                        {dd.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <ToggleButtonGroup
                value={layout}
                exclusive
                size="small"
                onChange={handleLayout}
              >
                <ToggleButton value="no-split-rows" aria-label="row">
                  <TableRowsIcon />
                </ToggleButton>
                <ToggleButton value="split-column" aria-label="2 column split">
                  <ViewColumnIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Outlet context={[layout]} />
    </ThemeProvider>
  );
}

export default RootLayout;
