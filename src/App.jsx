import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function App() {
  const [isPopup, setIsPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchData, setSearchData] = useState({
    searchName: "",
  });

  const [insertData, setInsertData] = useState({
    eName: "",
    eDepartment: "",
    eSalary: 0,
  });

  const [deleteData, setDeleteData] = useState({
    eId: 0,
  });
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  useEffect(() => {
    fetchAllEmployee();
  }, []);

  const fetchAllEmployee = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api-getAllEmployee.php`
      );
      setAllEmployees(response.data);
      // console.log("all employees", response.data);
    } catch (err) {
      console.log("Failed to fetch All Employee", err);
    }
  };

  const handleAddNew = () => {
    setIsPopup(true);
  };
  const handleClosePopup = () => {
    setIsPopup(false);
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api-searchEmployee.php`,
        searchData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAllEmployees(response.data);
      // console.log("search data", response.data);
    } catch (err) {
      console.log("Failed to search employee", err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInsertData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSave = async () => {
    // console.log("data to send ", insertData);

    if (!isEditing) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api-insertEmployee.php`,
          insertData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.stsStatus == true) {
          alert(response.data.stsMessage);
        }

        fetchAllEmployee();
        setIsPopup(false);
      } catch (err) {
        console.log("Failed to insert data", err);
        alert("Server Issue");
      }
    }

    if (isEditing) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api-updateEmplyee.php`,
          insertData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.stsStatus == true) {
          alert(response.data.stsMessage);
        }

        setInsertData({
          eName: "",
          eDepartment: "",
          eSalary: 0,
        });
        fetchAllEmployee();
        setIsPopup(false);
        setIsEditing(false);
      } catch (err) {
        console.log("Failed to edit employee", err);
        alert("Server Issue");
      }
    }
  };

  const handleDelete = (empId) => {
    setDeleteData((prevValue) => ({ ...prevValue, eId: empId }));
    setOpenDeletePopup(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api-deleteEmployee.php`,
        deleteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.stsStatus == true) {
        alert(response.data.stsMessage);
      }

      fetchAllEmployee();
      setOpenDeletePopup(false);
    } catch (err) {
      console.log("Failed to delete employee", err);
      alert("Server Issue");
    }
  };

  const handleEdit = (empData) => {
    setInsertData((prevValue) => ({
      ...prevValue,
      eId: empData.EmpId,
      eName: empData.EmpName,
      eDepartment: empData.EmpDepartment,
      eSalary: empData.EmpSalary,
    }));

    setIsPopup(true);
    setIsEditing(true);
  };

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="text-3xl">Bismillahir-Rahmanir-Raheem</div>
        <div>Alhamdullilah for Everythings</div>
      </div>
      <hr />

      <div className="p-8">
        <div>
          <div className="text-xl font-semibold">Employees List</div>

          <div className="mt-4 w-full flex justify-between">
            <div className="flex gap-2">
              <input
                type="search"
                name="searchName"
                placeholder="Search by Name ..."
                className="w-96 border border-gray-500 rounded-md px-4 py-1"
                onChange={handleSearchChange}
              />
              <button
                className="px-6 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            <div>
              <button
                className="px-6 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                onClick={handleAddNew}
              >
                Add New
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-8 gap-1 border border-gray-500 rounded-t-md py-1 px-4 font-semibold">
          <div className="col-span-1">S.N.</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-1">Salary</div>
          <div className="col-span-1 text-center">Update</div>
          <div className="col-span-1 text-center">Delete</div>
        </div>

        {allEmployees.map((emp, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-8 gap-0.5 border border-gray-500 rounded-b-md py-1 px-4"
            >
              <div className="col-span-1">{index + 1}</div>
              <div className="col-span-2">{emp.EmpName}</div>
              <div className="col-span-2">{emp.EmpDepartment}</div>
              <div className="col-span-1">₹ {emp.EmpSalary}</div>
              <div className="col-span-1 text-center">
                <button
                  className="px-4 rounded-md bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
              </div>
              <div className="col-span-1 text-center">
                <button
                  className="px-4 rounded-md bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                  onClick={() => handleDelete(emp.EmpId)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {allEmployees.length == 0 && (
          <div className="mt-4 flex justify-center">
            <div>No Data Available !</div>
          </div>
        )}
      </div>

      {isPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="h-fit w-80 bg-white rounded-md p-4">
            <div>
              <div className="flex justify-between border-b border-gray-500">
                {isEditing ? (
                  <div>Edit Employee Data</div>
                ) : (
                  <div>Add New Employee</div>
                )}

                <div
                  className="px-2 bg-gray-500 hover:bg-red-500 rounded-full mb-1 text-white cursor-pointer"
                  onClick={handleClosePopup}
                >
                  X
                </div>
              </div>

              <div className="mt-2">
                <div className="mb-2 flex flex-col gap-0.5">
                  <label htmlFor="eName">Name</label>
                  <input
                    type="text"
                    name="eName"
                    value={insertData.eName}
                    placeholder="Enter Name"
                    className="border border-gray-500 rounded-md px-2 py-0.5"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2 flex flex-col gap-0.5">
                  <label htmlFor="eDepart">Department</label>
                  <input
                    type="text"
                    name="eDepartment"
                    value={insertData.eDepartment}
                    placeholder="Enter Department"
                    className="border border-gray-500 rounded-md px-2 py-0.5"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2 flex flex-col gap-0.5">
                  <label htmlFor="eSalary">Salary</label>
                  <input
                    type="number"
                    name="eSalary"
                    value={insertData.eSalary}
                    placeholder="Enter Salary"
                    className="border border-gray-500 rounded-md px-2 py-0.5"
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4 w-full">
                  <button
                    className="w-full py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="h-fit w-72 bg-white rounded-md p-4">
            <div>
              <div>Are you sure you want to delete ?</div>

              <div className="mt-4 flex justify-between gap-1">
                <button
                  className="px-4 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                  onClick={handleSubmitDelete}
                >
                  Delete
                </button>

                <button
                  className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  onClick={() => setOpenDeletePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
