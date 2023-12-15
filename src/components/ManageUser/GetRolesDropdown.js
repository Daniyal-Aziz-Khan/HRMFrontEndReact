export const GetRolesDropdown = (getRole) => {
  if (getRole === "SuperAdmin") {
    return [
      { id: "", roleName: "Select Role" },
      { id: "2", roleName: "CompanyAdmin" },
      { id: "3", roleName: "Hr" },
      { id: "4", roleName: "Manager" },
      { id: "5", roleName: "Lead" },
      { id: "6", roleName: "Employee" },
    ];
  } else if (getRole === "CompanyAdmin") {
    return [
      { id: "", roleName: "Select Role" },
      { id: "3", roleName: "Hr" },
      { id: "4", roleName: "Manager" },
      { id: "5", roleName: "Lead" },
      { id: "6", roleName: "Employee" },
    ];
  } else {
    return [
      { id: "", roleName: "Select Role" },
      { id: "4", roleName: "Manager" },
      { id: "5", roleName: "Lead" },
      { id: "6", roleName: "Employee" },
    ];
  }
};
