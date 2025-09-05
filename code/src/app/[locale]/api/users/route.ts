import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 用户验证模式
const UserSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: z.enum(['admin', 'user', 'contributor']),
  isActive: z.boolean().optional(),
});

const UpdateUserSchema = UserSchema.partial();

type UserItem = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'contributor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// 模拟用户数据
const users: UserItem[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user123',
    email: 'user123@example.com',
    role: 'user',
    isActive: false,
    createdAt: new Date('2023-02-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'contributor',
    email: 'contributor@example.com',
    role: 'contributor',
    isActive: true,
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'moderator',
    email: 'moderator@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2023-04-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    let filteredUsers = users;

    // 按角色筛选
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 按状态筛选
    if (isActive !== null) {
      const active = isActive === 'true';
      filteredUsers = filteredUsers.filter(user => user.isActive === active);
    }

    // 按搜索关键词筛选
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
        || user.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取用户列表失败' },
      { status: 500 },
    );
  }
}

// POST - 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UserSchema.parse(body);

    // 检查用户名是否已存在
    const existingUserByUsername = users.find(user => user.username === validatedData.username);
    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 },
      );
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = users.find(user => user.email === validatedData.email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, message: '邮箱已存在' },
        { status: 400 },
      );
    }

    const newUser: UserItem = {
      id: (users.length + 1).toString(),
      username: validatedData.username,
      email: validatedData.email,
      role: validatedData.role,
      isActive: validatedData.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: '用户创建成功',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: '数据验证失败', errors: error.issues },
        { status: 400 },
      );
    }

    console.error('创建用户失败:', error);
    return NextResponse.json(
      { success: false, message: '创建用户失败' },
      { status: 500 },
    );
  }
}

// PUT - 更新用户
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '用户ID不能为空' },
        { status: 400 },
      );
    }

    const validatedData = UpdateUserSchema.parse(updateData);
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 },
      );
    }

    // 如果更新用户名，检查是否与其他用户重名
    if (validatedData.username) {
      const existingUser = users.find(user => user.username === validatedData.username && user.id !== id);
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '用户名已存在' },
          { status: 400 },
        );
      }
    }

    // 如果更新邮箱，检查是否与其他用户重名
    if (validatedData.email) {
      const existingUser = users.find(user => user.email === validatedData.email && user.id !== id);
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '邮箱已存在' },
          { status: 400 },
        );
      }
    }

    const updatedUser: UserItem = {
      ...users[userIndex]!,
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '用户更新成功',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: '数据验证失败', errors: error.issues },
        { status: 400 },
      );
    }

    console.error('更新用户失败:', error);
    return NextResponse.json(
      { success: false, message: '更新用户失败' },
      { status: 500 },
    );
  }
}

// DELETE - 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '用户ID不能为空' },
        { status: 400 },
      );
    }

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 },
      );
    }

    // 检查是否是最后一个管理员
    const user = users[userIndex]!;
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin' && u.id !== id).length;
      if (adminCount === 0) {
        return NextResponse.json(
          { success: false, message: '不能删除最后一个管理员' },
          { status: 400 },
        );
      }
    }

    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, message: '删除用户失败' },
      { status: 500 },
    );
  }
}
