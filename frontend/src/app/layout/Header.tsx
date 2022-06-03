import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
export default function Header({ isDarkMode, toggleDarkMode }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <>
          <Typography variant="h6">STORE </Typography>
          <Switch checked={isDarkMode} onChange={toggleDarkMode} />
        </>
      </Toolbar>
    </AppBar>
  );
}
