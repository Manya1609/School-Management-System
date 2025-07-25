import React from "react";
import { Box, Card, Divider, Grid, Link } from "@mui/material";
import AdminStatsView from "../components/AdminStatsView";
import { useAuth } from "../hooks/useAuth";
import ClassStatsView from "../components/ClassStatsView";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GridCalendar from "../components/GridCalendar";

const DashboardItem = (props) => {
  let { gridXS = true, cardSX = {}, title, component } = props;
  return (
    <Grid item xs={gridXS}>
      <Card
        variant="outlined"
        sx={{ marginX: "1%", height: "100%", ...cardSX }}
      >
        <Box
          sx={{
            fontSize: "2.5vh",
            textAlign: "center",
            height: "3vh",
            marginY: "1vh",
          }}
        >
          <b>{title}</b>
        </Box>
        <Divider />
        <Box display={"flex"} minHeight={"75vh"} paddingY={"1vh"} marginY={"1vh"}>
          <Box minWidth={"80%"} width={"fit-content"} margin={"auto"}>
            {component}
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

function getStatsView(role) {
  switch (role) {
    case "admin":
      return (
        <DashboardItem
          gridXS={2}
          title={"Site Statistics"}
          component={<AdminStatsView />}
        />
      );
    case "teacher":
      return (
        <DashboardItem
          gridXS={2}
          title={"My Teaching"}
          component={<ClassStatsView />}
        />
      );
    case "student":
      return (
        <DashboardItem
          gridXS={2}
          title={"My Learning"}
          component={<ClassStatsView />}
        />
      );

    default:
      return null;
  }
}

const Dashboard = () => {
  const { basicRole } = useAuth();
  return (
    <Box className="w-full h-full">
      <Box
        sx={{
          fontSize: "200%",
          marginLeft: "5%",
          marginTop: "1%",
          marginBottom: "1%",
        }}
      >
        Dashboard
      </Box>
      <Grid container columns={7}>
        {getStatsView(basicRole)}
        <DashboardItem
          title={"Notices"}
          component={
            <Box width={"fit-content"} marginX={"auto"}>
              {basicRole === "student" && (
                <Box marginBottom={"5px"} textAlign={"right"}>
                  <Link
                    underline="hover"
                    href="/academics/timetable/my"
                    target="_blank"
                    rel="noreferrer"
                    fontSize={"large"}
                  >
                    Go to Timetable
                  </Link>{" "}
                  <OpenInNewIcon
                    fontSize="small"
                    color="primary"
                    sx={{ marginBottom: "0.8%" }}
                  />
                </Box>
              )}
              <Card>
                {/* <CalendarView /> */}
                <GridCalendar />
              </Card>
            </Box>
          }
        />
      </Grid>
    </Box>
  );
};

export default Dashboard;
