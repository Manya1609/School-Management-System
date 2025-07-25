import { Box, Card, CardContent, CardHeader, Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DBContext from "../context/DBContext";

function getDate(dateStr){
  return (new Date(dateStr)).toDateString().split(' ').slice(1).join(' ');
}

export default function SingleNotice(props) {
  const { id } = useParams();
  const {noticesAPI} = useContext(DBContext);
  const [noticeData, setNoticeData] = useState(null);

  useEffect(() => {
    noticesAPI
      .get({id})
      .then((data) => setNoticeData(data));
  }, [id,noticesAPI]);

  return (
    <>
    <Box width={"100%"} textAlign={"center"} marginY={"1%"} fontSize={"200%"}>Notice</Box>
    <Box width={"100%"} display={"flex"} marginY={"1%"}>
      {noticeData ? (
        <Card sx={{ width: "60%", marginX: "auto" }}>
          <CardHeader
            title={
              <Box width={"90%"} display={"flex"} marginX={"auto"}>
                <Box width={"70%"}>{noticeData.title}</Box>
                <Box width={"30%"} textAlign={"right"}>
                  {getDate(noticeData.dueDate)}
                </Box>
              </Box>
            }
            titleTypographyProps={{ width: "100%", display: "flex" }}
          />
          <Divider variant="middle" />
          <CardContent sx={{ display: "flex" }}>
            <Box width={"90%"} marginX={"auto"}>
              <div dangerouslySetInnerHTML={{__html: noticeData.content.replace(/\n/g,"<br />")}} />
            </Box>
          </CardContent>
        </Card>
      ) : (
        "Loading..."
      )}
    </Box>
    </>
  );
}
