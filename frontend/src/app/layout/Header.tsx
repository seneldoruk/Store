import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { useStoreContext } from "../Context/StoreContext";
import { useAppSelector } from "../store/configureStore";

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
const midlinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];
const rightlinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyle = {
  color: "inherit",
  typography: "h6",
  "&:hover": {
    color: "secondary.main",
  },
  "&.active": {
    color: "text.secondary",
  },
  textDecoration: "none",
};
export default function Header({ isDarkMode, toggleDarkMode }: Props) {
  const { basket } = useAppSelector((state) => state.basket);
  const count = basket?.items.reduce((sum, item) => (sum += item.quantity), 0);
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <>
          <Box display="flex" alignItems="center">
            <Typography component={NavLink} to={"/"} variant="h6" sx={navStyle}>
              STORE
            </Typography>
            <Switch checked={isDarkMode} onChange={toggleDarkMode} />
          </Box>

          <Box>
            <List sx={{ display: "flex" }}>
              {midlinks.map(({ title, path }) => {
                return (
                  <ListItem
                    component={NavLink}
                    key={path}
                    to={path}
                    sx={navStyle}
                  >
                    {title.toUpperCase()}
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton
              component={Link}
              to="/basket"
              size="large"
              color="inherit"
            >
              <Badge badgeContent={count} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <List sx={{ display: "flex" }}>
              {rightlinks.map(({ title, path }) => {
                return (
                  <ListItem
                    component={NavLink}
                    key={path}
                    to={path}
                    sx={navStyle}
                  >
                    {title.toUpperCase()}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </>
      </Toolbar>
    </AppBar>
  );
}
