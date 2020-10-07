import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Typography,
} from "@material-ui/core";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";

const Faq = ({ classes }: FaqProps) => {
  return (
    <>
      <NavBar searchLocation={false} />
      <div>
        {/* Main container */}
        <div className="page-container">
          {/* bloc-11 */}
          <div className="bloc l-bloc" id="bloc-11">
            <div className="container bloc-lg">
              <div className="row">
                <div className="col">
                  <Typography className={classes.title} variant="h4">
                    Frequently Asked Questions
                  </Typography>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    I am managing a large area and would like more than one
                    spotter, can I get multiple?
                  </Typography>
                  <p>
                    Please submit an application for each reef or location you
                    would like a spotter for and we’ll be in touch to figure out
                    a staged roll out with you.
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    Who is responsible for the satellite communication costs?
                  </Typography>
                  <p>
                    Aqualink will be responsible for any satellite communication
                    costs.
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    What is the maximum depth a temperature sensor on the smart
                    mooring can be deployed?
                  </Typography>
                  <p>100 meters.</p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    What are the shipping costs?
                    <br />
                  </Typography>
                  <p>
                    Shipping cost will vary greatly depending on your location.
                    To get an idea of shipping costs you can visit
                    https://onlineshippingcalculator.com/ and enter the
                    following:
                    <br />
                  </p>
                  <ul>
                    <li>
                      <p>Set ship from location to San Francisco CA USA</p>
                    </li>
                    <li>
                      <p>Set ship to location to your location</p>
                    </li>
                    <li>
                      <p>Weight will be 22lbs</p>
                    </li>
                    <li>
                      <p>
                        Dimension will be 18 inches x 18 inches x 14 inches.
                      </p>
                    </li>
                    <li>
                      <p>
                        Because our shipment will arrive in two boxes and using
                        our negotiated rates you will need to multiply this
                        result by 1.5x.&nbsp;
                        <br />
                      </p>
                    </li>
                    <li>
                      <p>
                        This should be a rough estimate.
                        <br />
                      </p>
                    </li>
                    <li>
                      <p>
                        This does not include total landed costs for
                        international shipping (see below).
                        <br />
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    Am I responsible for customs / duties / taxes?
                  </Typography>
                  <p>
                    Yes. As the recipient of the equipment you will need to
                    determine if you need to pay these to receive your equipment
                    at customs.
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    How big is the smart mooring and spotter buoy?
                  </Typography>
                  <p>
                    The total smart mooring system is small enough for regular
                    shipping such as UPS, DHL, FedEx, etc. The dimensions and
                    weight of the buoy are:
                    <br />
                    <br />
                    42cm diameter
                    <br />
                    31cm height
                    <br />
                    5.4 KG
                    <br />
                    <br />
                    There is a ballast chain and smart mooring cable, the weight
                    and dimensions are still TBD but depending on the length of
                    cable needed for your target depth this should be around the
                    same dimensions and less than 15kg.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    Can I see more specification for the spotter buoy?
                  </Typography>
                  <p>
                    You can see some of the specifications&nbsp;
                    <a
                      href="https://content.sofarocean.com/hubfs/Spotter%20product%20documentation%20page/Sofar_Spotter_Specs_8_30_19.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    :<br />
                    More specifications will be released soon.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    How is the smart mooring moored? Does it come with a mooring
                    anchor?
                  </Typography>
                  <p>
                    The smart mooring does not come with an anchor. It
                    terminates in a stainless steel shackle with a chain. This
                    can be attached to an existing mooring. We will work with
                    you to determine the best arrangement for mooring at your
                    site as factors like depth, wind, current, wave action, and
                    storms may determine the configuration of the mooring.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    Am I responsible for permitting and permissions to install?
                  </Typography>
                  <p>
                    Yes. You will need to know the regulations for your
                    installation site and ensure you have the proper permits and
                    permissions.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    How do I receive data from the smart mooring?
                  </Typography>
                  <p>
                    Data will be available in an open-source dashboard provided
                    by aqualink.org.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    How often will I receive data?
                  </Typography>
                  <p>
                    Data will be real time transmitted every 30-45 minutes.
                    <br />
                  </p>
                </div>
              </div>
              <div className="row faqq">
                <div className="col">
                  <Typography className={classes.question} variant="h5">
                    What data will I receive from the smart mooring?
                  </Typography>
                  <p>
                    The planned data available will be:
                    <br />
                    <br />
                    significant wave height
                    <br />
                    peak period
                    <br />
                    mean period
                    <br />
                    peak direction
                    <br />
                    mean direction
                    <br />
                    peak directional spread
                    <br />
                    mean directional spread
                    <br />
                    wind speed
                    <br />
                    wind direction
                    <br />
                    GPS coordinates
                    <br />
                    surface temperature (placement configurable)
                    <br />
                    subsurface temperature (placement configurable)
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* bloc-11 END */}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = () =>
  createStyles({
    title: {
      marginTop: "1rem",
      marginBottom: "1rem",
    },
    question: {
      marginTop: "1rem",
      marginBottom: "1rem",
      fontWeight: "bold",
    },
    root: {
      top: 10,
      height: "100%",
    },
    map: {
      height: "100%",
    },
    reefTable: {
      height: "calc(100vh - 64px)",
      overflowY: "auto",
    },
  });

type FaqProps = WithStyles<typeof styles>;

export default withStyles(styles)(Faq);
