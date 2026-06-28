// // ManageUsers.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers, updateUser, deleteUser, resetUpdateStatus } from "../../store/userSlice";

// function ManageUsers() {
//    const dispatch = useDispatch();
//    const { list, listLoading, listError, updateLoading, deleteLoadingId, deleteError } =
//       useSelector((state) => state.user);

//    const [editingUser, setEditingUser] = useState(null); // full user object being edited
//    const [editForm, setEditForm]       = useState({});
//    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

//    useEffect(() => {
//       dispatch(fetchUsers());
//    }, [dispatch]);

//    function openEdit(user) {
//       setEditingUser(user);
//       setEditForm({
//          name: user.name ?? "",
//          fatherName: user.fatherName ?? "",
//          gender: user.gender ?? "",
//          mobile: user.mobile ?? "",
//          email: user.email ?? "",
//          address: user.address ?? "",
//          adminId: user.adminId ?? "",
//          employeeId: user.employeeId ?? "",
//       });
//    }

//    function closeEdit() {
//       setEditingUser(null);
//       dispatch(resetUpdateStatus());
//    }

//    function handleEditChange(e) {
//       const { name, value } = e.target;
//       setEditForm((prev) => ({ ...prev, [name]: value }));
//    }

//    async function handleEditSave() {
//       if (!editingUser) return;
//       const result = await dispatch(updateUser({ id: editingUser._id, payload: editForm }));
//       if (updateUser.fulfilled.match(result)) {
//          closeEdit();
//       }
//    }

//    async function handleConfirmDelete() {
//       if (!confirmDeleteId) return;
//       await dispatch(deleteUser(confirmDeleteId));
//       setConfirmDeleteId(null);
//    }

//    return (
//       <div className="w-full h-full overflow-y-auto px-3 sm:px-5 lg:px-6 pb-6">
//          <div className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">

//             <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
//                <div>
//                   <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
//                      Manage Users
//                   </h2>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                      List of all admin and employee accounts
//                   </p>
//                </div>
//                <button
//                   type="button"
//                   onClick={() => dispatch(fetchUsers())}
//                   className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
//                >
//                   Refresh
//                </button>
//             </div>

//             {listError && (
//                <div className="text-sm text-red-700 bg-red-50 border-b border-red-200 px-5 py-2.5">
//                   {listError}
//                </div>
//             )}
//             {deleteError && (
//                <div className="text-sm text-red-700 bg-red-50 border-b border-red-200 px-5 py-2.5">
//                   {deleteError}
//                </div>
//             )}

//             <div className="overflow-x-auto">
//                <table className="w-full text-sm">
//                   <thead>
//                      <tr className="bg-slate-50 border-b border-slate-200 text-left">
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Name</th>
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Role</th>
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">ID</th>
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Mobile</th>
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
//                         <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">Actions</th>
//                      </tr>
//                   </thead>
//                   <tbody>
//                      {listLoading && (
//                         <tr>
//                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
//                               Loading users...
//                            </td>
//                         </tr>
//                      )}

//                      {!listLoading && list.length === 0 && (
//                         <tr>
//                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
//                               No users found.
//                            </td>
//                         </tr>
//                      )}

//                      {!listLoading &&
//                         list.map((user) => (
//                            <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/60">
//                               <td className="px-4 py-2.5 text-slate-700">{user.name}</td>
//                               <td className="px-4 py-2.5">
//                                  <span
//                                     className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
//                                        user.role === "admin"
//                                           ? "bg-indigo-50 text-indigo-700"
//                                           : "bg-amber-50 text-amber-700"
//                                     }`}
//                                  >
//                                     {user.role}
//                                  </span>
//                               </td>
//                               <td className="px-4 py-2.5 text-slate-500">
//                                  {user.role === "admin" ? user.adminId : user.employeeId}
//                               </td>
//                               <td className="px-4 py-2.5 text-slate-500">{user.mobile}</td>
//                               <td className="px-4 py-2.5 text-slate-500">{user.email}</td>
//                               <td className="px-4 py-2.5 text-right">
//                                  <div className="inline-flex items-center gap-2">
//                                     <button
//                                        type="button"
//                                        onClick={() => openEdit(user)}
//                                        className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition"
//                                     >
//                                        Edit
//                                     </button>
//                                     <button
//                                        type="button"
//                                        onClick={() => setConfirmDeleteId(user._id)}
//                                        disabled={deleteLoadingId === user._id}
//                                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition"
//                                     >
//                                        {deleteLoadingId === user._id ? "Deleting..." : "Delete"}
//                                     </button>
//                                  </div>
//                               </td>
//                            </tr>
//                         ))}
//                   </tbody>
//                </table>
//             </div>
//          </div>

//          {/* ── Edit Modal ──────────────────────────────────────────── */}
//          {editingUser && (
//             <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
//                <div className="bg-white border border-slate-200 shadow-xl w-full sm:max-w-md rounded-t-xl sm:rounded-none">
//                   <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//                      <h3 className="text-base font-bold text-slate-800">Edit User</h3>
//                      <button onClick={closeEdit} className="text-slate-400 hover:text-slate-600 text-sm">
//                         ✕
//                      </button>
//                   </div>

//                   <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
//                      <div className="flex flex-col gap-1">
//                         <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Name</label>
//                         <input
//                            name="name"
//                            value={editForm.name}
//                            onChange={handleEditChange}
//                            className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                         />
//                      </div>
//                      <div className="flex flex-col gap-1">
//                         <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Father's Name</label>
//                         <input
//                            name="fatherName"
//                            value={editForm.fatherName}
//                            onChange={handleEditChange}
//                            className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                         />
//                      </div>
//                      <div className="grid grid-cols-2 gap-3">
//                         <div className="flex flex-col gap-1">
//                            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Gender</label>
//                            <select
//                               name="gender"
//                               value={editForm.gender}
//                               onChange={handleEditChange}
//                               className="px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                            >
//                               <option value="male">Male</option>
//                               <option value="female">Female</option>
//                               <option value="other">Other</option>
//                            </select>
//                         </div>
//                         <div className="flex flex-col gap-1">
//                            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Mobile</label>
//                            <input
//                               name="mobile"
//                               value={editForm.mobile}
//                               onChange={handleEditChange}
//                               className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                            />
//                         </div>
//                      </div>
//                      <div className="flex flex-col gap-1">
//                         <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Email</label>
//                         <input
//                            name="email"
//                            value={editForm.email}
//                            onChange={handleEditChange}
//                            className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                         />
//                      </div>
//                      <div className="flex flex-col gap-1">
//                         <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Address</label>
//                         <textarea
//                            name="address"
//                            value={editForm.address}
//                            onChange={handleEditChange}
//                            rows={2}
//                            className="px-3 py-2 text-sm border border-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                         />
//                      </div>

//                      {editingUser.role === "admin" && (
//                         <div className="flex flex-col gap-1">
//                            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Admin ID</label>
//                            <input
//                               name="adminId"
//                               value={editForm.adminId}
//                               onChange={handleEditChange}
//                               className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                            />
//                         </div>
//                      )}
//                      {editingUser.role === "employee" && (
//                         <div className="flex flex-col gap-1">
//                            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Employee ID</label>
//                            <input
//                               name="employeeId"
//                               value={editForm.employeeId}
//                               onChange={handleEditChange}
//                               className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
//                            />
//                         </div>
//                      )}
//                   </div>

//                   <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
//                      <button
//                         onClick={closeEdit}
//                         disabled={updateLoading}
//                         className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
//                      >
//                         Cancel
//                      </button>
//                      <button
//                         onClick={handleEditSave}
//                         disabled={updateLoading}
//                         className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition"
//                      >
//                         {updateLoading ? "Saving..." : "Save Changes"}
//                      </button>
//                   </div>
//                </div>
//             </div>
//          )}

//          {/* ── Delete Confirm Dialog ───────────────────────────────── */}
//          {confirmDeleteId && (
//             <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
//                <div className="bg-white border border-slate-200 shadow-xl w-full sm:max-w-sm rounded-t-xl sm:rounded-none">
//                   <div className="h-1 w-full bg-red-500 rounded-t-xl sm:rounded-none" />
//                   <div className="p-5 sm:p-6">
//                      <h3 className="text-base font-bold text-slate-800 mb-2">Delete User</h3>
//                      <p className="text-sm text-gray-600 mb-4">
//                         Are you sure? This action cannot be undone.
//                      </p>
//                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
//                         <button
//                            onClick={() => setConfirmDeleteId(null)}
//                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
//                         >
//                            Cancel
//                         </button>
//                         <button
//                            onClick={handleConfirmDelete}
//                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
//                         >
//                            Yes, Delete
//                         </button>
//                      </div>
//                   </div>
//                </div>
//             </div>
//          )}
//       </div>
//    );
// }

// export default ManageUsers;








// ManageUsers.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   fetchUsers,
   updateUser,
   deleteUser,
   resetUpdateStatus,
   resetUserPassword,
   resetUserPasswordStatus,
} from "../../store/userSlice";

function ManageUsers() {
   const dispatch = useDispatch();
   const {
      list,
      listLoading,
      listError,
      updateLoading,
      deleteLoadingId,
      deleteError,
      resetPasswordLoadingId,
      resetPasswordError,
      resetPasswordSuccess,
   } = useSelector((state) => state.user);

   const [editingUser, setEditingUser] = useState(null); // full user object being edited
   const [editForm, setEditForm]       = useState({});
   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
   const [resetPasswordUser, setResetPasswordUser] = useState(null); // user object for password reset
   const [newPassword, setNewPassword] = useState("");
   const [resetPasswordFieldError, setResetPasswordFieldError] = useState("");

   useEffect(() => {
      dispatch(fetchUsers());
   }, [dispatch]);

   function openEdit(user) {
      setEditingUser(user);
      setEditForm({
         name: user.name ?? "",
         fatherName: user.fatherName ?? "",
         gender: user.gender ?? "",
         mobile: user.mobile ?? "",
         email: user.email ?? "",
         address: user.address ?? "",
         adminId: user.adminId ?? "",
         employeeId: user.employeeId ?? "",
      });
   }

   function closeEdit() {
      setEditingUser(null);
      dispatch(resetUpdateStatus());
   }

   function handleEditChange(e) {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
   }

   async function handleEditSave() {
      if (!editingUser) return;
      const result = await dispatch(updateUser({ id: editingUser._id, payload: editForm }));
      if (updateUser.fulfilled.match(result)) {
         closeEdit();
      }
   }

   async function handleConfirmDelete() {
      if (!confirmDeleteId) return;
      await dispatch(deleteUser(confirmDeleteId));
      setConfirmDeleteId(null);
   }

   function openResetPassword(user) {
      setResetPasswordUser(user);
      setNewPassword("");
      setResetPasswordFieldError("");
   }

   function closeResetPassword() {
      setResetPasswordUser(null);
      setNewPassword("");
      setResetPasswordFieldError("");
      dispatch(resetUserPasswordStatus());
   }

   async function handleResetPasswordSubmit() {
      if (!newPassword || newPassword.length < 6) {
         setResetPasswordFieldError("Password must be at least 6 characters.");
         return;
      }
      if (!resetPasswordUser) return;

      const result = await dispatch(
         resetUserPassword({ id: resetPasswordUser._id, newPassword })
      );
      if (resetUserPassword.fulfilled.match(result)) {
         closeResetPassword();
      }
   }

   return (
      <div className="w-full h-full overflow-y-auto px-3 sm:px-5 lg:px-6 pb-6">
         <div className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
               <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                     Manage Users
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                     List of all admin and employee accounts
                  </p>
               </div>
               <button
                  type="button"
                  onClick={() => dispatch(fetchUsers())}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
               >
                  Refresh
               </button>
            </div>

            {listError && (
               <div className="text-sm text-red-700 bg-red-50 border-b border-red-200 px-5 py-2.5">
                  {listError}
               </div>
            )}
            {deleteError && (
               <div className="text-sm text-red-700 bg-red-50 border-b border-red-200 px-5 py-2.5">
                  {deleteError}
               </div>
            )}

            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-left">
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Name</th>
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Role</th>
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">ID</th>
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Mobile</th>
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
                        <th className="px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {listLoading && (
                        <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                              Loading users...
                           </td>
                        </tr>
                     )}

                     {!listLoading && list.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                              No users found.
                           </td>
                        </tr>
                     )}

                     {!listLoading &&
                        list.map((user) => (
                           <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/60">
                              <td className="px-4 py-2.5 text-slate-700">{user.name}</td>
                              <td className="px-4 py-2.5">
                                 <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                       user.role === "admin"
                                          ? "bg-indigo-50 text-indigo-700"
                                          : "bg-amber-50 text-amber-700"
                                    }`}
                                 >
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-500">
                                 {user.role === "admin" ? user.adminId : user.employeeId}
                              </td>
                              <td className="px-4 py-2.5 text-slate-500">{user.mobile}</td>
                              <td className="px-4 py-2.5 text-slate-500">{user.email}</td>
                              <td className="px-4 py-2.5 text-right">
                                 <div className="inline-flex items-center gap-2">
                                    <button
                                       type="button"
                                       onClick={() => openEdit(user)}
                                       className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition"
                                    >
                                       Edit
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => openResetPassword(user)}
                                       className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition"
                                    >
                                       Reset Password
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => setConfirmDeleteId(user._id)}
                                       disabled={deleteLoadingId === user._id}
                                       className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition"
                                    >
                                       {deleteLoadingId === user._id ? "Deleting..." : "Delete"}
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* ── Edit Modal ──────────────────────────────────────────── */}
         {editingUser && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
               <div className="bg-white border border-slate-200 shadow-xl w-full sm:max-w-md rounded-t-xl sm:rounded-none">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                     <h3 className="text-base font-bold text-slate-800">Edit User</h3>
                     <button onClick={closeEdit} className="text-slate-400 hover:text-slate-600 text-sm">
                        ✕
                     </button>
                  </div>

                  <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Name</label>
                        <input
                           name="name"
                           value={editForm.name}
                           onChange={handleEditChange}
                           className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                        />
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Father's Name</label>
                        <input
                           name="fatherName"
                           value={editForm.fatherName}
                           onChange={handleEditChange}
                           className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Gender</label>
                           <select
                              name="gender"
                              value={editForm.gender}
                              onChange={handleEditChange}
                              className="px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                           >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Mobile</label>
                           <input
                              name="mobile"
                              value={editForm.mobile}
                              onChange={handleEditChange}
                              className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Email</label>
                        <input
                           name="email"
                           value={editForm.email}
                           onChange={handleEditChange}
                           className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                        />
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Address</label>
                        <textarea
                           name="address"
                           value={editForm.address}
                           onChange={handleEditChange}
                           rows={2}
                           className="px-3 py-2 text-sm border border-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                        />
                     </div>

                     {editingUser.role === "admin" && (
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Admin ID</label>
                           <input
                              name="adminId"
                              value={editForm.adminId}
                              onChange={handleEditChange}
                              className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                           />
                        </div>
                     )}
                     {editingUser.role === "employee" && (
                        <div className="flex flex-col gap-1">
                           <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Employee ID</label>
                           <input
                              name="employeeId"
                              value={editForm.employeeId}
                              onChange={handleEditChange}
                              className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                           />
                        </div>
                     )}
                  </div>

                  <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
                     <button
                        onClick={closeEdit}
                        disabled={updateLoading}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleEditSave}
                        disabled={updateLoading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition"
                     >
                        {updateLoading ? "Saving..." : "Save Changes"}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* ── Delete Confirm Dialog ───────────────────────────────── */}
         {confirmDeleteId && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
               <div className="bg-white border border-slate-200 shadow-xl w-full sm:max-w-sm rounded-t-xl sm:rounded-none">
                  <div className="h-1 w-full bg-red-500 rounded-t-xl sm:rounded-none" />
                  <div className="p-5 sm:p-6">
                     <h3 className="text-base font-bold text-slate-800 mb-2">Delete User</h3>
                     <p className="text-sm text-gray-600 mb-4">
                        Are you sure? This action cannot be undone.
                     </p>
                     <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                        <button
                           onClick={() => setConfirmDeleteId(null)}
                           className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleConfirmDelete}
                           className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                        >
                           Yes, Delete
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {/* ── Reset Password Modal ────────────────────────────────── */}
         {resetPasswordUser && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
               <div className="bg-white border border-slate-200 shadow-xl w-full sm:max-w-sm rounded-t-xl sm:rounded-none">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                     <h3 className="text-base font-bold text-slate-800">Reset Password</h3>
                     <button onClick={closeResetPassword} className="text-slate-400 hover:text-slate-600 text-sm">
                        ✕
                     </button>
                  </div>

                  <div className="p-5">
                     <p className="text-sm text-gray-600 mb-4">
                        Set a new password for{" "}
                        <span className="font-semibold text-slate-800">{resetPasswordUser.name}</span>.
                        They will need to use this new password to log in.
                     </p>

                     {resetPasswordError && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-3">
                           {resetPasswordError}
                        </div>
                     )}

                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                           New Password
                        </label>
                        <input
                           type="password"
                           value={newPassword}
                           onChange={(e) => {
                              setNewPassword(e.target.value);
                              setResetPasswordFieldError("");
                           }}
                           placeholder="At least 6 characters"
                           className="px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                        />
                        {resetPasswordFieldError && (
                           <span className="text-xs text-red-600">{resetPasswordFieldError}</span>
                        )}
                     </div>
                  </div>

                  <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
                     <button
                        onClick={closeResetPassword}
                        disabled={resetPasswordLoadingId === resetPasswordUser._id}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleResetPasswordSubmit}
                        disabled={resetPasswordLoadingId === resetPasswordUser._id}
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition"
                     >
                        {resetPasswordLoadingId === resetPasswordUser._id ? "Resetting..." : "Reset Password"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default ManageUsers;