import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import DBContext from "../context/DBContext";

const statsMap = {
  studentsCount: {
    title: "Total Students",
    icon: <LocalLibraryIcon fontSize="large" />,
    color: "#FF8800",
    link: "#",
  },
  teachersCount: {
    title: "Total Teachers",
    icon: <EscalatorWarningIcon fontSize="large" />,
    color: "#BB00DD",
    link: "#",
  },
  adminsCount: {
    title: "Total Admins",
    icon: <EngineeringIcon fontSize="large" />,
    color: "#DD0000",
    link: "#",
  },
  classesCount: {
    title: "Total Classes",
    icon: <GroupsIcon fontSize="large" />,
    color: "#008833",
    link: "#",
  },
};

function AdminStatsCard(props) {
  let { stat, statkey } = props;
  let { title, icon, color, link } = statsMap[statkey];

  return (
    <Card
      sx={{
        bgcolor: color,
        width: "85%",
        minWidth: "150px",
        marginX: "auto",
        borderRadius: "5%",
      }}
    >
      <CardActionArea href={link} target="_blank" rel="noreferrer">
        <CardHeader
          title={title}
          sx={{
            color: "#FFFFFF",
            paddingLeft: "10%",
            marginY: "auto",
            textAlign: "center",
            minWidth: "80%",
          }}
          titleTypographyProps={{ fontSize: "120%" }}
          avatar={<Box marginLeft={"5%"}>{icon}</Box>}
        />
        <Divider variant="middle" sx={{ bgcolor: "#FFFFFF", opacity: 0.6 }} />
        <CardContent sx={{ color: "#FFFFFF", fontSize: "200%", marginTop: 0 }}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            justifyItems={"center"}
          >
            {stat}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function AdminStatsView(props) {
  const {systemAPI} = useContext(DBContext);
  const [stats, setStats] = useState({});
  useEffect(() => {
    systemAPI.getStats().then((fetchedStats) => setStats(fetchedStats));
  }, [systemAPI]);

  return (
    <Grid container columns={1} rowSpacing={1}>
      {Object.keys(statsMap).map((k) => {
        let stat = stats[k] ?? "...";
        return (
          <Grid item xs={1} sx={{ display: "flex" }} key={k}>
            <AdminStatsCard statkey={k} stat={stat} />
          </Grid>
        );
      })}
    </Grid>
  );
}
