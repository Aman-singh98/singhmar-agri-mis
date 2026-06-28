// // CreateUser.jsx
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createUser, resetCreateStatus } from "../../store/userSlice";

// const initialState = {
//    role: "",
//    name: "",
//    fatherName: "",
//    gender: "",
//    mobile: "",
//    email: "",
//    password: "",
//    address: "",
//    adminId: "",
//    employeeId: "",
// };

// function CreateUser() {
//    const dispatch = useDispatch();
//    const { createLoading, createError, createSuccess } = useSelector((state) => state.user);

//    const [formData, setFormData] = useState(initialState);
//    const [errors, setErrors]     = useState({});

//    // Clear success/error banners when leaving / re-entering the form fresh
//    useEffect(() => {
//       return () => dispatch(resetCreateStatus());
//    }, [dispatch]);

//    function handleChange(e) {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//    }

//    function handleRoleChange(e) {
//       const role = e.target.value;
//       setFormData((prev) => ({ ...prev, role, adminId: "", employeeId: "" }));
//       setErrors((prev) => ({ ...prev, role: "", adminId: "", employeeId: "" }));
//    }

//    function validate() {
//       const newErrors = {};

//       if (!formData.role) newErrors.role = "Please select a role.";
//       if (!formData.name.trim()) newErrors.name = "Name is required.";
//       if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required.";
//       if (!formData.gender) newErrors.gender = "Please select a gender.";

//       if (!formData.mobile.trim()) {
//          newErrors.mobile = "Mobile number is required.";
//       } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
//          newErrors.mobile = "Mobile number must be 10 digits.";
//       }

//       if (!formData.email.trim()) {
//          newErrors.email = "Email is required.";
//       } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
//          newErrors.email = "Please enter a valid email address.";
//       }

//       if (!formData.password) {
//          newErrors.password = "Password is required.";
//       } else if (formData.password.length < 6) {
//          newErrors.password = "Password must be at least 6 characters.";
//       }

//       if (!formData.address.trim()) newErrors.address = "Address is required.";

//       if (formData.role === "admin" && !formData.adminId.trim()) {
//          newErrors.adminId = "Admin ID is required.";
//       }
//       if (formData.role === "employee" && !formData.employeeId.trim()) {
//          newErrors.employeeId = "Employee ID is required.";
//       }

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//    }

//    async function handleSubmit(e) {
//       e.preventDefault();
//       if (!validate()) return;

//       const payload = { ...formData };
//       if (formData.role === "admin") delete payload.employeeId;
//       if (formData.role === "employee") delete payload.adminId;

//       const result = await dispatch(createUser(payload));
//       if (createUser.fulfilled.match(result)) {
//          setFormData(initialState);
//          setErrors({});
//       }
//    }

//    return (
//       <div className="w-full h-full overflow-y-auto px-3 sm:px-5 lg:px-6 pb-6">
//          <form
//             onSubmit={handleSubmit}
//             noValidate
//             className="w-full bg-white border border-slate-200 rounded-lg p-5 sm:p-7"
//          >
//             <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
//                Create User
//             </h2>
//             <p className="text-xs text-slate-400 mt-0.5 mb-5">
//                Select a role first, and the relevant fields will appear below.
//             </p>

//             {createSuccess && (
//                <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-4">
//                   User created successfully.
//                </div>
//             )}
//             {createError && (
//                <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-4">
//                   {createError}
//                </div>
//             )}

//             {/* ROLE SELECTION */}
//             <div className="flex flex-col gap-1.5 mb-4">
//                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                   Role
//                </label>
//                <div className="flex gap-5 mt-1">
//                   <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
//                      <input
//                         type="radio"
//                         name="role"
//                         value="admin"
//                         checked={formData.role === "admin"}
//                         onChange={handleRoleChange}
//                         className="accent-green-600"
//                      />
//                      Admin
//                   </label>
//                   <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
//                      <input
//                         type="radio"
//                         name="role"
//                         value="employee"
//                         checked={formData.role === "employee"}
//                         onChange={handleRoleChange}
//                         className="accent-green-600"
//                      />
//                      Employee
//                   </label>
//                </div>
//                {errors.role && <span className="text-xs text-red-600">{errors.role}</span>}
//             </div>

//             {/* CONDITIONAL: ADMIN ID */}
//             {formData.role === "admin" && (
//                <div className="flex flex-col gap-1.5 mb-4">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Admin ID
//                   </label>
//                   <input
//                      type="text"
//                      name="adminId"
//                      value={formData.adminId}
//                      onChange={handleChange}
//                      placeholder="Enter Admin ID"
//                      className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   />
//                   {errors.adminId && <span className="text-xs text-red-600">{errors.adminId}</span>}
//                </div>
//             )}

//             {/* CONDITIONAL: EMPLOYEE ID */}
//             {formData.role === "employee" && (
//                <div className="flex flex-col gap-1.5 mb-4">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Employee ID
//                   </label>
//                   <input
//                      type="text"
//                      name="employeeId"
//                      value={formData.employeeId}
//                      onChange={handleChange}
//                      placeholder="Enter Employee ID"
//                      className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   />
//                   {errors.employeeId && <span className="text-xs text-red-600">{errors.employeeId}</span>}
//                </div>
//             )}

//             <hr className="border-slate-100 my-5" />

//             {/* COMMON FIELDS */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Name
//                   </label>
//                   <input
//                      type="text"
//                      name="name"
//                      value={formData.name}
//                      onChange={handleChange}
//                      placeholder="Full name"
//                      className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   />
//                   {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
//                </div>

//                <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Father's Name
//                   </label>
//                   <input
//                      type="text"
//                      name="fatherName"
//                      value={formData.fatherName}
//                      onChange={handleChange}
//                      placeholder="Father's name"
//                      className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   />
//                   {errors.fatherName && <span className="text-xs text-red-600">{errors.fatherName}</span>}
//                </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Gender
//                   </label>
//                   <select
//                      name="gender"
//                      value={formData.gender}
//                      onChange={handleChange}
//                      className="px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   >
//                      <option value="">Select gender</option>
//                      <option value="male">Male</option>
//                      <option value="female">Female</option>
//                      <option value="other">Other</option>
//                   </select>
//                   {errors.gender && <span className="text-xs text-red-600">{errors.gender}</span>}
//                </div>

//                <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                      Mobile No.
//                   </label>
//                   <input
//                      type="tel"
//                      name="mobile"
//                      value={formData.mobile}
//                      onChange={handleChange}
//                      placeholder="10-digit number"
//                      className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                   />
//                   {errors.mobile && <span className="text-xs text-red-600">{errors.mobile}</span>}
//                </div>
//             </div>


//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">


//             <div className="flex flex-col gap-1.5 mt-4">
//                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                   Email
//                </label>
//                <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="name@example.com"
//                   className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                />
//                {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
//             </div>

//             <div className="flex flex-col gap-1.5 mt-4">
//                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                   Password
//                </label>
//                <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="At least 6 characters"
//                   className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                />
//                {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
//             </div>
//             </div>

//             <div className="flex flex-col gap-1.5 mt-4">
//                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
//                   Address
//                </label>
//                <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Full address"
//                   rows={3}
//                   className="px-3 py-2 text-sm border border-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                />
//                {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
//             </div>

//             <button
//                type="submit"
//                disabled={createLoading}
//                className="w-full sm:w-auto mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition"
//             >
//                {createLoading && (
//                   <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
//                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//                   </svg>
//                )}
//                {createLoading ? "Creating..." : "Create User"}
//             </button>
//          </form>
//       </div>
//    );
// }

// export default CreateUser;









// CreateUser.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, resetCreateStatus } from "../../store/userSlice";

const initialState = {
   role: "",
   name: "",
   fatherName: "",
   gender: "",
   mobile: "",
   email: "",
   password: "",
   address: "",
   adminId: "",
   employeeId: "",
};

function CreateUser() {
   const dispatch = useDispatch();
   const { createLoading, createError, createSuccess } = useSelector((state) => state.user);

   const [formData, setFormData] = useState(initialState);
   const [errors, setErrors]     = useState({});

   useEffect(() => {
      return () => dispatch(resetCreateStatus());
   }, [dispatch]);

   function handleChange(e) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
   }

   // ── Mobile: sirf digits allow karo, max 10 ──────────────────
   function handleMobileChange(e) {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, mobile: digits }));
      setErrors((prev) => ({ ...prev, mobile: "" }));
   }

   // ── Name / FatherName: sirf letters + spaces ─────────────────
   function handleNameChange(e) {
      const { name, value } = e.target;
      const letters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: letters }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
   }

   function handleRoleChange(e) {
      const role = e.target.value;
      setFormData((prev) => ({ ...prev, role, adminId: "", employeeId: "" }));
      setErrors((prev) => ({ ...prev, role: "", adminId: "", employeeId: "" }));
   }

   function validate() {
      const newErrors = {};

      if (!formData.role) newErrors.role = "Please select a role.";

      if (!formData.name.trim()) {
         newErrors.name = "Name is required.";
      } else if (formData.name.trim().length < 2) {
         newErrors.name = "Name must be at least 2 characters.";
      }

      if (!formData.fatherName.trim()) {
         newErrors.fatherName = "Father's name is required.";
      } else if (formData.fatherName.trim().length < 2) {
         newErrors.fatherName = "Father's name must be at least 2 characters.";
      }

      if (!formData.gender) newErrors.gender = "Please select a gender.";

      if (!formData.mobile.trim()) {
         newErrors.mobile = "Mobile number is required.";
      } else if (formData.mobile.length !== 10) {
         newErrors.mobile = "Mobile number must be exactly 10 digits.";
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
         newErrors.mobile = "Enter a valid Indian mobile number.";
      }

      if (!formData.email.trim()) {
         newErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
         newErrors.email = "Please enter a valid email address.";
      }

      if (!formData.password) {
         newErrors.password = "Password is required.";
      } else if (formData.password.length < 6) {
         newErrors.password = "Password must be at least 6 characters.";
      }

      if (formData.role === "admin" && !formData.adminId.trim()) {
         newErrors.adminId = "Admin ID is required.";
      }
      if (formData.role === "employee" && !formData.employeeId.trim()) {
         newErrors.employeeId = "Employee ID is required.";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   }

   async function handleSubmit(e) {
      e.preventDefault();
      if (!validate()) return;

      const payload = { ...formData };
      if (formData.role === "admin") delete payload.employeeId;
      if (formData.role === "employee") delete payload.adminId;

      const result = await dispatch(createUser(payload));
      if (createUser.fulfilled.match(result)) {
         setFormData(initialState);
         setErrors({});
      }
   }

   return (
      <div className="w-full h-full overflow-y-auto px-3 sm:px-5 lg:px-6 pb-6">
         <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full bg-white border border-slate-200 rounded-lg p-5 sm:p-7"
         >
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
               Create User
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">
               Select a role first, and the relevant fields will appear below.
            </p>

            {createSuccess && (
               <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-4">
                  User created successfully.
               </div>
            )}
            {createError && (
               <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-4">
                  {createError}
               </div>
            )}

            {/* ROLE */}
            <div className="flex flex-col gap-1.5 mb-4">
               <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Role
               </label>
               <div className="flex gap-5 mt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                     <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === "admin"}
                        onChange={handleRoleChange}
                        className="accent-green-600"
                     />
                     Admin
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                     <input
                        type="radio"
                        name="role"
                        value="employee"
                        checked={formData.role === "employee"}
                        onChange={handleRoleChange}
                        className="accent-green-600"
                     />
                     Employee
                  </label>
               </div>
               {errors.role && <span className="text-xs text-red-600">{errors.role}</span>}
            </div>

            {/* ADMIN ID */}
            {formData.role === "admin" && (
               <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Admin ID
                  </label>
                  <input
                     type="text"
                     name="adminId"
                     value={formData.adminId}
                     onChange={handleChange}
                     placeholder="Enter Admin ID"
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.adminId && <span className="text-xs text-red-600">{errors.adminId}</span>}
               </div>
            )}

            {/* EMPLOYEE ID */}
            {formData.role === "employee" && (
               <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Employee ID
                  </label>
                  <input
                     type="text"
                     name="employeeId"
                     value={formData.employeeId}
                     onChange={handleChange}
                     placeholder="Enter Employee ID"
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.employeeId && <span className="text-xs text-red-600">{errors.employeeId}</span>}
               </div>
            )}

            <hr className="border-slate-100 my-5" />

            {/* NAME + FATHER NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Name
                  </label>
                  <input
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleNameChange}
                     placeholder="Full name"
                     maxLength={50}
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
               </div>

               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Father's Name
                  </label>
                  <input
                     type="text"
                     name="fatherName"
                     value={formData.fatherName}
                     onChange={handleNameChange}
                     placeholder="Father's name"
                     maxLength={50}
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.fatherName && <span className="text-xs text-red-600">{errors.fatherName}</span>}
               </div>
            </div>

            {/* GENDER + MOBILE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Gender
                  </label>
                  <select
                     name="gender"
                     value={formData.gender}
                     onChange={handleChange}
                     className="px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  >
                     <option value="">Select gender</option>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                     <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="text-xs text-red-600">{errors.gender}</span>}
               </div>

               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Mobile No.
                  </label>
                  <input
                     type="tel"
                     name="mobile"
                     value={formData.mobile}
                     onChange={handleMobileChange}
                     placeholder="10-digit number"
                     maxLength={10}
                     inputMode="numeric"
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.mobile
                     ? <span className="text-xs text-red-600">{errors.mobile}</span>
                     : <span className="text-xs text-slate-400">{formData.mobile.length}/10 digits</span>
                  }
               </div>
            </div>

            {/* EMAIL + PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Email
                  </label>
                  <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     placeholder="name@example.com"
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
               </div>

               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                     Password
                  </label>
                  <input
                     type="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     placeholder="At least 6 characters"
                     className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                  {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
               </div>
            </div>

            {/* ADDRESS — no validation */}
            <div className="flex flex-col gap-1.5 mt-4">
               <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Address
               </label>
               <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={3}
                  className="px-3 py-2 text-sm border border-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
               />
            </div>

            <button
               type="submit"
               disabled={createLoading}
               className="w-full sm:w-auto mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition"
            >
               {createLoading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
               )}
               {createLoading ? "Creating..." : "Create User"}
            </button>
         </form>
      </div>
   );
}

export default CreateUser;