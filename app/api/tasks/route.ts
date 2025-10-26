import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all tasks for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CREATE a new task
export async function POST(request: Request) {
  try {
    const { title, description, dueDate, status, assignee, userId } = await request.json();

    if (!title || !dueDate || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        dueDate: new Date(dueDate),
        status: status || 'not-started',
        assignee: assignee || null,
        userId: parseInt(userId),
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a task
export async function PUT(request: Request) {
  try {
    const { id, title, description, dueDate, status, assignee, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Task ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId),
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status }),
        ...(assignee !== undefined && { assignee }),
      },
    });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Task ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId),
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

