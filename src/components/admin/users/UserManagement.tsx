"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserFilters } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import Avatar from "@/components/admin/common/Avatar";
import StatusBadge from "@/components/admin/common/StatusBadge";
import UserProfileSidebar from "@/components/admin/users/UserProfileSidebar";
import { CircleUserRound, Info, Plus } from "lucide-react";
import CustomLink from "../common/CustomLink";
import PageHeader from "../common/PageHeader";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { axiosAPI } from "@/api/axios";
import { deleteUser } from "@/api/users";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosAPI.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setIsLoading(false);

        console.log("Fetched users:", response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on current filters
  useEffect(() => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }
    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters((prev) => ({ ...prev, role }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsProfileSidebarOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: newStatus, updated_at: new Date().toISOString() }
          : u
      )
    );
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "teacher", label: "Teacher" },
    { value: "user", label: "User" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  if (isLoading) {
    return <DataLoading text="Loading Users List..." />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb currentPage="Users Management" />
      {/* Header */}
      <PageHeader
        title="Users Management"
        icon={<CircleUserRound />}
        actionLabel="Add new User"
        actionHref="/admin/users/add"
        actionIcon={<Plus />}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <SearchBar
            placeholder="Search by name or email..."
            onSearch={handleSearch}
            value={filters.search || ""}
          />
          <FilterSelect
            value={filters.role || ""}
            onChange={handleRoleFilter}
            options={roleOptions}
            placeholder="All Roles"
          />
          <FilterSelect
            value={filters.status || ""}
            onChange={handleStatusFilter}
            options={statusOptions}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date of birth
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar src={user.avatar} name={user.name} size="md" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.role} type="role" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phone_number || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.date_of_birth
                        ? formatDate(user.date_of_birth)
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} type="status" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.last_login ? formatDate(user.last_login) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <ActionButton
                        variant="view"
                        onClick={() => handleViewUser(user)}
                      />
                      <CustomLink
                        href={`/admin/users/${user.id}/edit`}
                        title="Edit User"
                        type="edit"
                      />
                      <ActionButton
                        variant={
                          user.status === "active" ? "deactivate" : "activate"
                        }
                        onClick={() => handleToggleStatus(user)}
                      />
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDeleteUser(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Profile Sidebar */}
      {isProfileSidebarOpen && selectedUser && (
        <UserProfileSidebar
          user={selectedUser}
          isOpen={isProfileSidebarOpen}
          onClose={() => setIsProfileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
