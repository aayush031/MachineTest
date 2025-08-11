import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("token");
            const data = await apiFetch(`/employees?search=${search}`, {
                token
            });
            setEmployees(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h2>Employees</h2>
            <input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchEmployees}>Search</button>

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Courses</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.f_Id}>
                            <td>{emp.f_Id}</td>
                            <td>{emp.f_Name}</td>
                            <td>{emp.f_Email}</td>
                            <td>{emp.f_Mobile}</td>
                            <td>{emp.f_Designation}</td>
                            <td>{emp.f_gender}</td>
                            <td>{emp.f_Course.join(", ")}</td>
                            <td>
                                {emp.f_Image ? (
                                    <img
                                        src={emp.f_Image}
                                        alt={emp.f_Name}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                ) : (
                                    "No Image"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
