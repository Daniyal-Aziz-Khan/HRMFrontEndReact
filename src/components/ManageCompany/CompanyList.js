import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import CustomButtons from "../global_component/CustomButtonAddEdit";
import DataTableComponent from "../global_component/DataTableComponent";
import { companyList, deleteRecord } from "../redux/AdminController";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from "yup";
import { useEffect, useMemo, useRef, useState } from "react";
import defaultImageSrc from "../../assets/images/users/user1.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import CustomModal from "../global_component/CustomModal";

const CompanyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  //#region Datatables
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setsortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchParam, setSearchParam] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const buttons = [
    {
      id: 1,
      title: "Delete",
      onClick: (row) => onDelete(row),
      className: "btn btn-sm btn-danger me-1",
      icon: "bi bi-trash",
      label: "Delete",
    },
    {
      id: 2,
      title: "Update",
      onClick: (row) => onUpdate(row),
      className: "btn btn-sm btn-success me-1",
      icon: "bi bi-pencil-square",
      label: "update",
    },
  ];

  const columns = useMemo(
    () => [
      {
        name: "Actions",
        sortable: false,
        cell: (row) => <CustomButtons buttons={buttons} row={row} />,
      },
      {
        name: "Company Name",
        selector: "companyName",
        sortable: true,
        sortFunction: () => [],
      },
      {
        name: "Company Logo",
        cell: (row) => (
          <>
            <a href={row.profilePicture} target="_blank">
              <img
                src={row.profilePicture}
                alt={row.companyName}
                width="25"
                height="25"
              />
            </a>
          </>
        ),
      },
    ],
    []
  );

  const fetchCompanies = async (
    page = 1,
    size = 10,
    sortColumn = "",
    sortDirection = "",
    searchParam = ""
  ) => {
    setLoading(true);
    const params = {
      page: page,
      size: size,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchParam: searchParam,
    };
    try {
      const response = await dispatch(companyList(params));

      if (companyList.fulfilled.match(response)) {
        //   setData(response?.payload?.list);
        const updatedList = response?.payload?.list?.map((item) => {
          // Check if the column value is null
          if (item && item.profilePicture === "") {
            item.profilePicture = defaultImageSrc;
          }
          return item;
        });
        setData(updatedList);
        setTotalRows(response?.payload?.totalRecords);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    console.log("currentPage::", currentPage, perPage);
    fetchCompanies(
      currentPage,
      perPage,
      sortColumn,
      sortDirection,
      searchParam
    );
  }, [currentPage, perPage, sortColumn, sortDirection, searchParam]);

  const handlePageChange = (page) => {
    fetchCompanies(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchCompanies(page, newPerPage);
    setPerPage(newPerPage);
  };

  const handleSort = (column, direction) => {
    setsortColumn(
      column.selector.charAt(0).toUpperCase() + column.selector.slice(1)
    );
    setSortDirection(direction === "asc" ? "asc" : "desc");
  };

  const handleSearch = (e) => {
    setSearchParam(e.target.value ? e.target.value : "");
  };

  const onDelete = (row) => {
    setRowToDelete(row);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setRowToDelete(null);
    setShowDeleteModal(false);
  };

  const deleteCompany = async () => {
    const endpoint = `Admin/DeleteCompany?id=${rowToDelete.id}`;
    await dispatch(deleteRecord(endpoint));
    handleCloseDeleteModal();
    fetchCompanies();
  };

  const onUpdate = async (row) => {
    // const url = await dispatch(getById(`Admin/GetCompanyById?id=${row.id}`));
    // await handleUpdateCompany(url?.payload);
    navigate("/add-company", { state: row });
  };

  //#endregion

  //#region DatatTable

  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col md="12" className="text-end">
              <NavLink
                to="/add-company"
                className="text-white"
                style={{ textDecoration: "none" }}
              >
                <Button variant="primary">Add New Company</Button>
              </NavLink>
            </Col>
          </Row>
        </Card.Header>
        <CardBody>
          <div className="row">
            <div className="col-md-4 offset-md-8 col-sm-12">
              <div className=" mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-1 small"
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="table-responsive">
                <DataTableComponent
                  columns={columns}
                  data={data}
                  pagination
                  paginationServer
                  progressPending={loading}
                  paginationTotalRows={totalRows}
                  paginationDefaultPage={currentPage}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <CustomModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        size="md"
        classes="bg-danger text-white py-2"
        title={"Delete"}
        body={
          <>
            <p>
              Are you absolutely certain you want to permanently delete this
              record? Please be aware that deleting this record is an
              irreversible action.
            </p>
            <p>Please reaffirm your decision to proceed.</p>
            <Row>
              <Col className="text-end">
                <Button
                  onClick={() => deleteCompany()}
                  variant="outline-danger"
                >
                  Confirm.
                </Button>
              </Col>
            </Row>
          </>
        }
      />
    </>
  );

  //#endregion
};

export default CompanyList;
