"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminUserTopUpDialog } from "@/components/admin-user-topup-dialog"
import { AdminUserDeductDialog } from "@/components/admin-user-deduct-dialog"
import { AdminUserSuspendDialog } from "@/components/admin-user-suspend-dialog"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminUser } from "@/app/actions/admin"

interface AdminUsersTableProps {
  users: AdminUser[]
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as "all" | "admin" | "user")
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-[#1a1b1f] border-[#2d2d32] text-white placeholder:text-[#9ca3af]"
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1b1f] border-[#2d2d32] text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1b1f] border-[#2d2d32]">
            <SelectItem value="all" className="text-white">All Roles</SelectItem>
            <SelectItem value="admin" className="text-white">Admin</SelectItem>
            <SelectItem value="user" className="text-white">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-[#9ca3af]">
        <div>
          Showing {paginatedUsers.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[100px] bg-[#1a1b1f] border-[#2d2d32] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1b1f] border-[#2d2d32]">
              <SelectItem value="10" className="text-white">10</SelectItem>
              <SelectItem value="20" className="text-white">20</SelectItem>
              <SelectItem value="50" className="text-white">50</SelectItem>
              <SelectItem value="100" className="text-white">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-[#2d2d32] bg-[#1a1b1f]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2d2d32] hover:bg-[#2d2d32]/50">
              <TableHead className="text-[#9ca3af]">Name</TableHead>
              <TableHead className="text-[#9ca3af]">Email</TableHead>
              <TableHead className="text-[#9ca3af]">Role</TableHead>
              <TableHead className="text-[#9ca3af]">Status</TableHead>
              <TableHead className="text-[#9ca3af]">Balance</TableHead>
              <TableHead className="text-[#9ca3af]">Created At</TableHead>
              <TableHead className="text-[#9ca3af] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow className="border-[#2d2d32]">
                <TableCell colSpan={7} className="text-center text-[#9ca3af] py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className="border-[#2d2d32] hover:bg-[#2d2d32]/50 text-[#d1d5db]">
                  <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? "bg-[#8C5CF7]" : "bg-[#2d2d32]"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_suspended ? (
                      <Badge className="bg-amber-600/80 text-white">
                        {user.suspended_until ? `Suspended until ${new Date(user.suspended_until).toLocaleDateString()}` : "Suspended"}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-700/70 text-white">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>${user.balance.toFixed(2)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <AdminUserTopUpDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                      <AdminUserDeductDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                      <AdminUserSuspendDialog userId={user.id} userEmail={user.email} isSuspended={user.is_suspended} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#9ca3af]">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-[#1a1b1f] border-[#2d2d32] text-white hover:bg-[#2d2d32] disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-[#1a1b1f] border-[#2d2d32] text-white hover:bg-[#2d2d32] disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
