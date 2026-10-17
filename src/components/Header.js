import React from "react";
import PropTypes from "prop-types";
import AppLayout from "./AppLayout";

// Dulu komponen ini berupa react-sidebar (drawer). Sekarang hanya membungkus
// halaman dengan layout baru (sidebar + navbar NewNavbar), sehingga semua
// halaman yang memakai <Sidebar {...sidebarProps}> otomatis ikut tampilan baru.
// Props lama (sidebar, docked, open, onSetOpen, dll) diabaikan.
const Sidebar = props => {
  return (
    <AppLayout legacy>
      {props.children}
    </AppLayout>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired
};

export default Sidebar;
