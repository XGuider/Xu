'use client';

import type { User } from '@/types';

import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'user123',
    email: 'user123@example.com',
    role: 'user',
    isActive: false,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'contributor',
    email: 'contributor@example.com',
    role: 'contributor',
    isActive: true,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    username: 'moderator',
    email: 'moderator@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date(),
  },
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'contributor',
    isActive: true,
  });

  // 筛选用户
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase())
      || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus
      || (selectedStatus === 'active' && user.isActive)
      || (selectedStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // 切换用户状态
  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
        : user,
    ));
  };

  // 添加用户
  const handleAddUser = () => {
    if (newUser.username.trim() && newUser.email.trim()) {
      const user: User = {
        id: (users.length + 1).toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUsers([...users, user]);
      setNewUser({ username: '', email: '', role: 'user', isActive: true });
      setIsAddingUser(false);
    }
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers(users.map(u =>
        u.id === editingUser.id
          ? { ...editingUser, updatedAt: new Date() }
          : u,
      ));
      setEditingUser(null);
    }
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    // eslint-disable-next-line no-alert
    if (confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // 获取角色显示文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'contributor': return '贡献者';
      case 'user': return '普通用户';
      default: return role;
    }
  };

  // 获取角色样式
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contributor': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600">管理平台用户，包括用户角色、状态管理和权限控制</p>
        </div>
        <Button onClick={() => setIsAddingUser(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加用户
        </Button>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索用户名或邮箱"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:w-80"
            />
            <svg className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="contributor">贡献者</option>
            <option value="user">普通用户</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>

      {/* 添加用户表单 */}
      {isAddingUser && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">添加新用户</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="用户名"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            />
            <Input
              type="email"
              placeholder="邮箱地址"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' | 'contributor' })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
              <option value="user">普通用户</option>
              <option value="contributor">贡献者</option>
              <option value="admin">管理员</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newUser.isActive}
                onChange={e => setNewUser({ ...newUser, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                启用用户
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAddUser}>保存</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingUser(false);
                setNewUser({ username: '', email: '', role: 'user', isActive: true });
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* 用户列表 */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  用户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  注册时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getRoleStyle(user.role),
                    )}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {user.createdAt.toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    )}
                    >
                      {user.isActive ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id)}
                        className={cn(
                          'hover:text-gray-900',
                          user.isActive ? 'text-red-600' : 'text-green-600',
                        )}
                      >
                        {user.isActive ? '禁用' : '启用'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">总用户数</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">活跃用户</div>
          <div className="text-2xl font-bold text-green-600">
            {users.filter(user => user.isActive).length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">管理员</div>
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(user => user.role === 'admin').length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">贡献者</div>
          <div className="text-2xl font-bold text-yellow-600">
            {users.filter(user => user.role === 'contributor').length}
          </div>
        </div>
      </div>

      {/* 编辑用户模态框 */}
      {editingUser && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">编辑用户</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="用户名"
                  value={editingUser.username}
                  onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="邮箱地址"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                <select
                  value={editingUser.role}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'user' | 'contributor' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                >
                  <option value="user">普通用户</option>
                  <option value="contributor">贡献者</option>
                  <option value="admin">管理员</option>
                </select>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editingUser.isActive}
                    onChange={e => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="editIsActive" className="ml-2 text-sm text-gray-700">
                    启用用户
                  </label>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={handleSaveEdit}>保存</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
