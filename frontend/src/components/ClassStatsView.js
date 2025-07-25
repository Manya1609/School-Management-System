import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DBContext from "../context/DBContext";
import { useAuth } from "../hooks/useAuth";

const statsMap = {
  classSectionAssigned: {
    title: "My Class",
    icon: <GroupsIcon fontSize="large" />,
    color: "#008833",
    link: "#",
    transformer: (classSec) => (
      <Typography fontSize={"200%"}>{classSec ?? "..."}</Typography>
    ),
  },
  subjectsList: {
    title: "My Subjects",
    icon: <LocalLibraryIcon fontSize="large" />,
    color: "#FF8800",
    link: "#",
    transformer: (subjList) =>
      subjList ? (
        <List sx={{ width: "80%", minWidth: "120px" }}>
          {subjList.map((subj) => (
            <ListItem key={subj}>
              <ListItemAvatar
                sx={{
                  minWidth: "10px",
                  width: "fit-content",
                  marginBottom: "1px",
                }}
              >
                <BookmarkIcon />
              </ListItemAvatar>
              <ListItemText sx={{ margin: "1%", textAlign: "center" }}>
                {subj}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      ) : (
        "..."
      ),
  },
};

function ClassStatsCard(props) {
  let { stat, statkey } = props;
  let { title, icon, color, link, transformer } = statsMap[statkey];

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
          titleTypographyProps={{ fontSize: "150%" }}
          avatar={<Box marginLeft={"5%"}>{icon}</Box>}
        />
        <Divider variant="middle" sx={{ bgcolor: "#FFFFFF", opacity: 0.6 }} />
        <CardContent sx={{ color: "#FFFFFF", marginTop: 0 }}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            justifyItems={"center"}
          >
            {transformer(stat)}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function ClassStatsView(props) {
  const { user } = useAuth();
  const { userId } = user;
  const { subjectsAPI, classesAPI } = useContext(DBContext);
  const [stats, setStats] = useState({});
  useEffect(() => {
    Promise.all([
      classesAPI.sections
        .getSectionAssignedTo({ userId })
        .then(({ className, sectionName }) => `${className} - ${sectionName}`),
      subjectsAPI
        .getSubjectsAssignedTo({ userId })
        .then((subjects) => subjects.map((sub) => sub.subjectName)),
    ]).then(([classSectionAssigned, subjectsList]) =>
      setStats({ classSectionAssigned, subjectsList })
    ).catch(err=>setStats({}));
  }, [userId, classesAPI, subjectsAPI]);

  return (
    <Grid container columns={1} rowSpacing={4}>
      {Object.keys(statsMap).map((k) => {
        let stat = stats[k];
        return (
          <Grid item xs={1} sx={{ display: "flex" }} key={k}>
            <ClassStatsCard statkey={k} stat={stat} />
          </Grid>
        );
      })}
    </Grid>
  );
}
