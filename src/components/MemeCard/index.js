import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import "./index.css";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles({
  card: {
    maxWidth: "100vh/4",
    margin: "0",
  },
  media: {
    height: 220,
  },
});

export default function PplCard({ meme }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea className={classes.item}>
        <CardMedia className={classes.media} image={meme.url} />
      </CardActionArea>
    </Card>
  );
}
