import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  card: {
    maxWidth: 425,
  },
  media: {
    height: 220,
  },
});

export default function PplCard({ meme }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia className={classes.media} image={meme.url} />
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Do ur meme
        </Button>
      </CardActions>
    </Card>
  );
}
