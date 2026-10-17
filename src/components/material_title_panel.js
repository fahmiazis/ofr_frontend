import React, { useContext } from "react";
import PropTypes from "prop-types";
import { LayoutContext } from "./AppLayout";

const styles = {
  root: {
    fontFamily:
      '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    fontWeight: 300,
  },
  header: {
    backgroundColor: "#c0392b",
    color: "#c0392b",
    // padding: "16px",
    // paddingLeft: "10px",
    // width: '95%',
    // height: '10%',
    // fontSize: "1.5em",
    // position: 'fixed'
  }
};

const MaterialTitlePanel = props => {
  const inLayout = useContext(LayoutContext);
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : styles.root;

  return (
    <div style={rootStyle}>
      {/* navbar lama tidak dirender lagi jika sudah memakai layout baru (NewNavbar) */}
      {!inLayout && <div style={styles.header}>{props.title}</div>}
      {props.children}
    </div>
  );
};

MaterialTitlePanel.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default MaterialTitlePanel;
