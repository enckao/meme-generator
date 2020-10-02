import React from "react";
import Grid from "@material-ui/core/Grid";
import "./index.css";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

class MemeGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeCollection: [],
      currentSelectedImg: 0,
      dialogIsOpen: false,
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

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ memeCollection: response.data.memes });
      });
  }

  openImage(index) {
    const { memeCollection, dialogIsOpen } = this.state;
    const image = memeCollection[index];
    const base_image = new Image(image.width, image.height);
    base_image.crossOrigin = "*";
    base_image.src = image.url;
    const base64 = this.getBase64Image(base_image);
    this.setState({
      currentSelectedImg: index,
      dialogIsOpen: !dialogIsOpen,
      currentSelectedImgbase64: base64,
    });
  }

  getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }

  toggleDialog() {
    this.setState((prevState) => ({
      dialogIsOpen: !prevState.dialogIsOpen,
    }));
  }

  handleTextChange(event) {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  getStateObj(e, type) {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;
    return type === "bottom"
      ? {
          isDraggingBot: true,
          isDraggingTop: false,
          bottomX: `${xOffset}px`,
          bottomY: `${yOffset}px`,
        }
      : {
          isDraggingTop: true,
          isDraggingBot: false,
          topX: `${xOffset}px`,
          topY: `${yOffset}px`,
        };
  }

  handleMouseDown(e, type) {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener("mousemove", (event) =>
      this.handleMouseDrag(event, type)
    );
    this.setState({
      ...stateObj,
    });
  }

  handleMouseDrag(e, type) {
    const { isDraggingTop, isDraggingBot } = this.state;
    if (isDraggingTop || isDraggingBot) {
      let stateObj = {};
      if (type === "bottom" && isDraggingBot) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && isDraggingTop) {
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj,
      });
    }
  }

  handleMouseUp() {
    document.removeEventListener("mousemove", this.handleMouseDrag);
    this.setState({
      isDraggingTop: false,
      isDraggingBot: false,
    });
  }

  convertSvgToImage() {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    );
    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  render() {
    const {
      memeCollection,
      dialogIsOpen,
      currentSelectedImg,
      topX,
      topY,
      isDraggingTop,
      topText,
      bottomX,
      bottomY,
      bottomText,
    } = this.state;
    let newWidth = 600;
    let newHeight;
    if (memeCollection.length) {
      let image = memeCollection[currentSelectedImg];
      let ratio = image.width / image.height;
      newHeight = newWidth / ratio;
    }
    const textStyle = {
      fontFamily: "Impact",
      fontSize: "50px",
      textTransform: "uppercase",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none",
    };
    return (
      <>
        {memeCollection.length ? (
          <>
            <Grid container spacing={10} style={{ padding: "24px" }}>
              {memeCollection.map((memeTile, index) => (
                <Grid
                  key={memeTile.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <Card className="card" onClick={() => this.openImage(index)}>
                    <CardActionArea className="item">
                      <CardMedia className="media" image={memeTile.url} />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Dialog
              maxWidth={newWidth}
              open={dialogIsOpen}
              aria-labelledby="meme-edit-dialog"
              onClose={() => this.toggleDialog()}
            >
              <DialogTitle>Créez votre propre meme !</DialogTitle>
              <DialogContent dividers>
                <svg
                  width={newWidth}
                  id="svg_ref"
                  height={newHeight}
                  ref={(el) => {
                    this.svgRef = el;
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <image
                    ref={(el) => {
                      this.imageRef = el;
                    }}
                    xlinkHref={memeCollection[currentSelectedImg].url}
                    height={newHeight}
                    width={newWidth}
                  />
                  <text
                    style={{
                      ...textStyle,
                      zIndex: isDraggingTop ? 4 : 1,
                    }}
                    x={topX}
                    y={topY}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    onMouseDown={(event) => this.handleMouseDown(event, "top")}
                    onMouseUp={(event) => this.handleMouseUp(event, "top")}
                  >
                    {topText}
                  </text>
                  <text
                    style={textStyle}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    x={bottomX}
                    y={bottomY}
                    onMouseDown={(event) =>
                      this.handleMouseDown(event, "bottom")
                    }
                    onMouseUp={(event) => this.handleMouseUp(event, "bottom")}
                  >
                    {bottomText}
                  </text>
                </svg>
              </DialogContent>
              <DialogActions>
                <TextField
                  autoFocus
                  margin="dense"
                  id="topText"
                  name="topText"
                  label="Top Text"
                  type="text"
                  fullWidth
                  onChange={this.handleTextChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="bottomText"
                  name="bottomText"
                  label="Bottom Text"
                  type="text"
                  fullWidth
                  onChange={this.handleTextChange}
                />
                <Button
                  autoFocus
                  onClick={() => this.convertSvgToImage()}
                  color="primary"
                >
                  Télécharger ce meme
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          "Loading memes, please stand by..."
        )}
      </>
    );
  }
}

export default MemeGallery;
