import React from "react";
import { Box } from "@material-ui/core";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";

import ghbttn from "../../assets/img/ghbttn.png";
import f4 from "../../assets/img/f4.png";
import fVeh from "../../assets/img/f_veh.png";
import fCad from "../../assets/img/f_cad.png";
import fBom from "../../assets/img/f_bom.png";

import dronepersp from "../../assets/img/dronepersp.jpg";
import dronetrio from "../../assets/img/dronetrio.jpg";
import dronebottom from "../../assets/img/dronebottom.jpg";

const Drones = () => (
  <>
    <NavBar searchLocation={false} />
    <Box py={6}>
      {/* Main container */}
      <div className="page-container">
        {/* topbox9 */}
        <div className="bloc l-bloc none" id="topbox9">
          <div className="container bloc-lg">
            <div className="row no-gutters">
              <div className="col bgc-white-smoke">
                <div className="dronecard">
                  <div className="row dronecardrow align-items-center">
                    <div className="col-sm-12 order-sm-1 col-lg-10 offset-md-0">
                      <h5 className="mg-md">
                        An Affordable Autonomous Surface Vehicle
                      </h5>
                      <p>
                        To complement our plans for underwater sensor
                        deployments we are publishing the software and a drone
                        kit to help automate surveys and other tasks. Our
                        Autonomous Surface Vehicle(ASV) is open source, built on
                        top of existing frameworks like Pixhawk and ROS and uses
                        a NVIDA Jetson GPU combined with machine vision stereo
                        cameras.
                      </p>
                    </div>
                    <div className="order-sm-2 offset-lg-0 offset-md-4 col-md-4 col-sm-6 offset-sm-3 col-10 offset-1 col-lg-2">
                      <a
                        href="https://github.com/aqualinkorg/asv"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={ghbttn}
                          className="img-fluid mx-auto d-block img-ghbt-style lazyload"
                          alt="Start button"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="row dronecardrow ndrow">
                    <div className="dronecard-col col-lg-2 col-md-3 col-sm-5 col-8">
                      <a
                        href="https://github.com/aqualinkorg/asv/tree/master/vehicle"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={fVeh}
                          className="img-fluid mx-auto d-block lazyload"
                          alt="f1"
                        />
                      </a>
                    </div>
                    <div className="dronecard-col col-lg-2 col-md-3 offset-lg-0 col-sm-5 col-8">
                      <a
                        href="https://github.com/aqualinkorg/asv/tree/master/groundstation"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={f4}
                          className="img-fluid mx-auto d-block lazyload"
                          alt="f4"
                        />
                      </a>
                    </div>
                    <div className="dronecard-col col-md-3 col-lg-2 offset-lg-0 offset-md-0 offset-sm-0 col-sm-5 offset-0 col-8">
                      <a
                        href="https://github.com/oceansystems/asv/tree/master/hardware/drawings_and_cad"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={fCad}
                          className="img-fluid mx-auto d-block lazyload"
                          alt="f3"
                        />
                      </a>
                    </div>
                    <div className="col-lg-2 col-md-3 offset-md-0 offset-sm-0 offset-lg-0 dronecard-col col-sm-5 offset-0 col-8">
                      <a
                        href="https://github.com/oceansystems/asv/blob/master/hardware/bill_of_materials.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={fBom}
                          className="img-fluid mx-auto d-block lazyload"
                          alt="f2"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* topbox9 END */}
        {/* hullconcept8 */}
        <div className="bloc l-bloc mt-4" id="hullconcept8">
          <div className="container bloc-sm">
            <div className="row">
              <div className="col">
                <div className="row align-items-start">
                  <div className="col">
                    <h5 className="mg-md">A New Hull Design Concept</h5>
                    <p>
                      The BOM Cost for the power system, electronics, and motors
                      – everything except for the hull, is less than $2,500. To
                      build your own ASV you’ll need to get your own hull. We
                      understand this makes things harder and we have a
                      completed hull design but would like to understand how
                      useful this is to the conservation community. If there’s
                      enough interest, we’ll start the tooling investment and
                      make it generally available.
                    </p>
                  </div>
                </div>
                <div className="row voffset">
                  <div className="col-md-12 order-md-2 order-sm-1 order-1 col-lg-6 order-lg-1">
                    <ul>
                      <li>
                        <p>
                          Capable of 35km autonomous missions
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          Able to indefinitely loiter in place
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          Stereo camera for obstacle avoidance
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>Long range Wifi and Cell communication</p>
                      </li>
                      <li>
                        <p>Max speed of 6km/h</p>
                      </li>
                      <li>
                        <p>Target cost of less than $5,000</p>
                      </li>
                      <li>
                        <p>Dimensions with solar panels 1.6m x 1.7m x .45m</p>
                      </li>
                      <li>
                        <p>
                          Able to fold up and check in on commercial flights
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-8 offset-md-2 order-md-1 offset-sm-1 col-sm-10 col-lg-6 offset-lg-0 ">
                    <img
                      src={dronepersp}
                      className="img-fluid mx-auto d-block lazyload"
                      alt="dronepersp"
                    />
                  </div>
                </div>
                <div className="row align-items-center voffset-lg">
                  <div className="col-sm-10 offset-sm-1 offset-lg-0 col-md-8 offset-md-2 col-lg-5">
                    <img
                      src={dronetrio}
                      className="img-fluid mx-auto d-block mg-md lazyload"
                      alt="drone"
                    />
                  </div>
                  <div className="order-1 order-sm-0 order-lg-1 order-md-1 col-md-10 offset-md-1 offset-lg-1 col-lg-6">
                    <ul>
                      <li>
                        <p>
                          Easily detachable amas (side panels) so that solar
                          panels can be easily removable for smaller missions
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          The primary hull can travel on battery power alone for
                          about 16km
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          This makes transport a lot easier as the dimensions
                          are then reduced to 1.6m x .4m
                          <br />
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row align-items-center voffset-lg">
                  <div className="offset-lg-0 order-lg-0 order-md-1 col-md-10 offset-md-1 order-sm-1 col-lg-6 order-1">
                    <ul>
                      <li>
                        <p>
                          Downward facing camera port
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          Sonar for depth measurements
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          Mechanical mounting bracket with ability to run wires
                          for power and communications into the center hull
                          <br />
                        </p>
                      </li>
                      <li>
                        <p>
                          Built with mechanical, electrical, and software
                          integration in mind
                          <br />
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 order-sm-0 col-lg-5 offset-lg-1">
                    <img
                      src={dronebottom}
                      className="img-fluid mx-auto d-block mg-md lazyload"
                      alt="drone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* hullconcept8 END */}
        {/* bloc-10 */}
        <div className="bloc none l-bloc " id="bloc-10">
          <div className="container bloc-md">
            <div className="row">
              <div className="col bgc-blue-green">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="helptext">
                      <h3 className="mg-md white">Get Involved</h3>
                      <p className="white">
                        We would like to hear from you if you need an ASV like
                        this or can contribute your skills to completing it’s
                        development.
                        <br />
                        Please email us at&nbsp;
                        <a className="white" href="mailto:asv@aqualink.org ">
                          asv@aqualink.org&nbsp;
                        </a>
                        to get involved.&nbsp;
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* bloc-10 END */}
      </div>
    </Box>
    <Footer />
  </>
);

export default Drones;
