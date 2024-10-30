// src/App.js
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBell, FaUser, FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa'; // Import new icons
import '../App.css'; // Import custom CSS

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        startDate: '',
        endDate: '',
        status: '',
        search: ''
      },
      currentPage: 1,
      data: [],
      sidebarOpen: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    // Simulate data fetch
    const allData = [
      { nomorTransaksi: '12345', costCenter: 'A1', keterangan: 'Pengadaan Barang', tglAjuan: '2024-09-01' },
      { nomorTransaksi: '67890', costCenter: 'B2', keterangan: 'Pembelian Alat', tglAjuan: '2024-08-25' },
      // Add more items here
    ];

    this.setState(prevState => {
      const filteredData = allData.filter(item =>
        (!prevState.filters.startDate || new Date(item.tglAjuan) >= new Date(prevState.filters.startDate)) &&
        (!prevState.filters.endDate || new Date(item.tglAjuan) <= new Date(prevState.filters.endDate)) &&
        (!prevState.filters.status || item.status === prevState.filters.status) &&
        (!prevState.filters.search || item.nomorTransaksi.includes(prevState.filters.search))
      );
      return { data: filteredData };
    });
  };

  handleDateChange = (type, value) => {
    this.setState(prevState => ({
      filters: { ...prevState.filters, [`${type}Date`]: value }
    }), this.fetchData);
  };

  handleStatusChange = (value) => {
    this.setState(prevState => ({
      filters: { ...prevState.filters, status: value }
    }), this.fetchData);
  };

  handleSearchChange = (value) => {
    this.setState(prevState => ({
      filters: { ...prevState.filters, search: value }
    }), this.fetchData);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  toggleSidebar = () => {
    this.setState(prevState => ({ sidebarOpen: !prevState.sidebarOpen }));
  };

  render() {
    const { filters, currentPage, data, sidebarOpen } = this.state;
    const totalPages = Math.ceil(data.length / 10); // For pagination

    return (
      <div className="d-flex">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <button className="btn btn-light mb-3" onClick={this.toggleSidebar}>
            {sidebarOpen ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />} {/* Use chevron icons for collapse */}
          </button>
          <div className={`list-group ${sidebarOpen ? '' : 'd-none'}`}>
            <a href="#" className="list-group-item list-group-item-action">Home</a>
            <a href="#" className="list-group-item list-group-item-action">Operasional</a>
            <a href="#" className="list-group-item list-group-item-action">Klaim</a>
            <a href="#" className="list-group-item list-group-item-action">IKK</a>
            <a href="#" className="list-group-item list-group-item-action">Kasbon</a>
          </div>
        </div>

        <div className={`flex-grow-1 ${sidebarOpen ? 'ml-250' : 'ml-0'}`} style={{ marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <button className="navbar-toggler" type="button" onClick={this.toggleSidebar}>
                <FaBars size={24} />
              </button>
              <a className="navbar-brand" href="/">Web OFR</a>
              <div className="d-flex align-items-center ms-auto">
                <div className="me-3">
                  <FaBell size={24} />
                </div>
                <div className="me-3">
                  <FaUser size={24} />
                </div>
              </div>
            </div>
          </nav>

          <div className="container-fluid mt-4">
            {/* Page Title */}
            <h1 className="mb-4" style={{ color: '#C62828', textAlign: 'center' }}>Pengajuan Operasional</h1>

            <form className="mb-4">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label htmlFor="startDate">Tanggal Mulai</label>
                  <input type="date" className="form-control border-primary" id="startDate" value={filters.startDate} onChange={e => this.handleDateChange('start', e.target.value)} />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="endDate">Tanggal Selesai</label>
                  <input type="date" className="form-control border-primary" id="endDate" value={filters.endDate} onChange={e => this.handleDateChange('end', e.target.value)} />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="status">Status</label>
                  <select id="status" className="form-control border-primary" value={filters.status} onChange={e => this.handleStatusChange(e.target.value)}>
                    <option value="">Semua</option>
                    <option value="approved">Disetujui</option>
                    <option value="pending">Menunggu</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="search">Cari</label>
                  <input type="text" className="form-control border-primary" id="search" placeholder="Cari..." value={filters.search} onChange={e => this.handleSearchChange(e.target.value)} />
                </div>
              </div>
            </form>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Transaksi</th>
                  <th>Cost Center</th>
                  <th>Keterangan</th>
                  <th>Tgl Ajuan</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {data.slice((currentPage - 1) * 10, currentPage * 10).map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{item.nomorTransaksi}</td>
                    <td>{item.costCenter}</td>
                    <td>{item.keterangan}</td>
                    <td>{item.tglAjuan}</td>
                    <td>
                      <button className="btn btn-primary">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i + 1}>
                    <button className="page-link" onClick={() => this.handlePageChange(i + 1)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default App;