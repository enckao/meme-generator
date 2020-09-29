import React from "react";
import Grid from "@material-ui/core/Grid";
import "./index.css";
import MemeCard from "../MemeCard/index";

class MemeGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeCollection: [],
      currentSelected: 0,
      modalIsOpen: false,
      currentSelectedbase64: null,
      topText: "",
      bottomText: "",
      isDraggingTop: false,
      isDraggingBot: false,
      topY: "10%",
      topX: "50%",
      bottomX: "50%",
      bottomY: "90%",
    };
  }

  componentDidMount() {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ memeCollection: response.data.memes });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.memeCollection.length ? (
          <Grid container spacing={10} style={{ padding: "24px" }}>
            {this.state.memeCollection.map((memeTile) => (
              <Grid key={memeTile.id} item xs={12} sm={6} md={4} lg={4} xl={3}>
                <MemeCard meme={memeTile} />
              </Grid>
            ))}
          </Grid>
        ) : (
          "Loading memes, please stand by..."
        )}
      </React.Fragment>
    );
  }
}

export default MemeGallery;
